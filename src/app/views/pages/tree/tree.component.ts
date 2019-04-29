import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2, Self } from '@angular/core';
import 'jstree';
import { Node } from '../../../core/test-case/model/Node';
import { TestCaseService } from '../../../core/test-case/services/test-case.service';
import { ToastrService } from 'ngx-toastr';
import { OffcanvasOptions } from '../../../core/_base/metronic';
import { MenuOptions, LayoutConfigService, MenuAsideService } from './../../../core/_base/layout';
import { Router } from '@angular/router';
import { HtmlClassService } from '../../themes/default/html-class.service';
import { ToggleOptions } from '../../../core/_base/metronic';

declare var $: any;
import * as objectPath from 'object-path';

@Component({
  selector: 'kt-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Output() nodeSelected = new EventEmitter<any>();
  @Output() editRequested = new EventEmitter<any>();
  @Input() nodeAdded: Node;

  @ViewChild('jstreearea') jsTree: ElementRef;
  treeData: Array<any> = [];
  selectedNode;
  tree;

  // MENU CONFIG

  @ViewChild('asideMenu') asideMenu: ElementRef;

  currentRouteUrl: string = '';
  insideTm: any;
  outsideTm: any;

  menuCanvasOptions: OffcanvasOptions = {
    baseClass: 'kt-aside',
    overlay: false,
    closeBy: 'kt_aside_close_btn',
    toggleBy: {
      target: 'kt_aside_mobile_toggler',
      state: 'kt-header-mobile__toolbar-toggler--active'
    }
  };

  toggleOptions: ToggleOptions = {
    target: 'body',
    targetState: 'kt-aside--minimize',
    togglerState: 'kt-aside__brand-aside-toggler--active'
  };

  menuOptions: MenuOptions = {
    // vertical scroll
    scroll: null,

    // submenu setup
    submenu: {
      desktop: {
        // by default the menu mode set to accordion in desktop mode
        default: 'dropdown',
      },
      tablet: 'accordion', // menu set to accordion in tablet mode
      mobile: 'accordion' // menu set to accordion in mobile mode
    },

    // accordion setup
    accordion: {
      expandAll: false // allow having multiple expanded accordions in the menu
    }
  };

  constructor(private toastr: ToastrService,
    private testCaseService: TestCaseService,

    public htmlClassService: HtmlClassService,
    public menuAsideService: MenuAsideService,
    public layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2) {
    this.initTree();
  }

  ngOnInit() {

    const config = this.layoutConfigService.getConfig();

    if (objectPath.get(config, 'aside.menu.dropdown') !== true && objectPath.get(config, 'aside.self.fixed')) {
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-scroll', '1');
    }

    if (objectPath.get(config, 'aside.menu.dropdown')) {
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown', '1');
      // tslint:disable-next-line:max-line-length
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown-timeout', objectPath.get(config, 'aside.menu.submenu.dropdown.hover-timeout'));
    }

  }


  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  isMenuRootItemIsActive(item): boolean {
    let result: boolean = false;

    for (const subItem of item.submenu) {
      result = this.isMenuItemIsActive(subItem);
      if (result) {
        return true;
      }
    }

    return false;
  }

	/**
	 * Use for fixed left aside menu, to show menu on mouseenter event.
	 * @param e Event
	 */
  mouseEnter(e: Event) {
    // check if the left aside menu is fixed
    if (document.body.classList.contains('kt-aside--fixed')) {
      if (this.outsideTm) {
        clearTimeout(this.outsideTm);
        this.outsideTm = null;
      }

      this.insideTm = setTimeout(() => {
        // if the left aside menu is minimized
        if (document.body.classList.contains('kt-aside--minimize') && KTUtil.isInResponsiveRange('desktop')) {
          // show the left aside menu
          this.render.removeClass(document.body, 'kt-aside--minimize');
          this.render.addClass(document.body, 'kt-aside--minimize-hover');
        }
      }, 50);
    }
  }

	/**
	 * Use for fixed left aside menu, to show menu on mouseenter event.
	 * @param e Event
	 */
  mouseLeave(e: Event) {
    if (document.body.classList.contains('kt-aside--fixed')) {
      if (this.insideTm) {
        clearTimeout(this.insideTm);
        this.insideTm = null;
      }

      this.outsideTm = setTimeout(() => {
        // if the left aside menu is expand
        if (document.body.classList.contains('kt-aside--minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
          // hide back the left aside menu
          this.render.removeClass(document.body, 'kt-aside--minimize-hover');
          this.render.addClass(document.body, 'kt-aside--minimize');
        }
      }, 100);
    }
  }

  getItemCssClasses(item) {
    let classes = 'kt-menu__item';

    if (objectPath.get(item, 'submenu')) {
      classes += ' kt-menu__item--submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' kt-menu__item--active kt-menu__item--here';
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' kt-menu__item--open kt-menu__item--here';
    }

    // custom class for menu item
    if (objectPath.has(item, 'custom-class')) {
      classes += ' ' + item['custom-class'];
    }

    if (objectPath.get(item, 'icon-only')) {
      classes += ' kt-menu__item--icon-only';
    }

    return classes;
  }

  getItemAttrSubmenuToggle(item) {
    let toggle = 'hover';
    if (objectPath.get(item, 'toggle') === 'click') {
      toggle = 'click';
    } else if (objectPath.get(item, 'submenu.type') === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  // END MENU CONFIG

  createDataTree(data) {
    let treeOnClick = (treeId, treeNode) => {
      this.selectedNode = treeNode.original;
      if (this.selectedNode) {
        this.nodeSelected.emit({
          selectedNode: this.selectedNode,
          tree: this.treeData
        });
      }
    };

    for (let item of data) {
      this.treeData.push(item);
    }

    this.tree = $(this.jsTree.nativeElement).jstree({
      core: {
        data: this.treeData,
        check_callback: true,
      },
      types: {
        folder: {
          icon: 'jstree-icon jstree-folder'
        },
        file: {
          icon: 'jstree-icon jstree-file'
        },
        B: {
          icon: 'fa fa-database'
        }
      },
      contextmenu: {
        items: this.customMenu.bind(this)
      },
      plugins: ['sort', 'wholerow', 'dnd', 'contextmenu', 'types']

    });
    this.tree.on('select_node.jstree', function (e, data) {
      treeOnClick('jstree_data', data.node);
    });
  }

  customMenu(this) {
    let self = this;
    let items;
    if (this.selectedNode && this.selectedNode.type !== 'file') {
      items = {
        item1: {
          label: 'Create folder',
          action: function () {
            self.treeData.push({
              id: 'folder' + (self.getMaxFolderID()),
              seq: self.getMaxFolderID(),
              text: 'folder ' + (self.getMaxFolderID()),
              type: 'folder',
              parent: self.selectedNode.id
            });
            $('#data').jstree(true).settings.core.data = self.treeData;
            $('#data').jstree(true).refresh(true, true);
          }
        },
        item2: {
          label: 'Create test case',
          action: function () {
            self.treeData.push({
              id: 'file' + (self.getMaxFileID()),
              seq: self.getMaxFileID(),
              text: 'test case ' + (self.getMaxFileID()),
              type: 'file',
              parent: self.selectedNode.id
            });
            $('#data').jstree(true).settings.core.data = self.treeData;
            $('#data').jstree(true).refresh();
          }
        },
        item3: {
          label: 'Rename',
          action: function () {
            let newName = prompt('Enter new folder name');
            self.selectedNode.text = newName;
            self.renameNode(self.selectedNode);
          }
        },
        item4: {
          label: 'Delete',
          action: function () {
            self.deleteNode();
            $('#data').jstree(true).settings.core.data = self.treeData;
            $('#data').jstree(true).refresh(true, true);
          }
        }
      };
    } else if (this.selectedNode && this.selectedNode.type === 'file' && this.selectedNode.technicalID) {
      items = {
        item1: {
          label: 'Delete',
          action: function () {
            self.deleteNode();
            $('#data').jstree(true).settings.core.data = self.treeData;
            $('#data').jstree(true).refresh(true, true);
          }
        },
        item2: {
          label: 'Edit',
          action: function () {
            self.editRequested.emit({
              node: self.selectedNode
            });
          }
        }
      }
    }
    return items;
  }

  renameNode() {
    this.testCaseService.renameNode(this.selectedNode).subscribe((resp: any) => {
      console.log('Node renamed');
      for (let i = 0; i < this.treeData.length; i++) {
        let obj = this.treeData[i];
        if (obj.id === this.selectedNode.id) {
          obj.text = resp.text;
          obj.technicalID = resp.technicalID;
          $('#data').jstree(true).settings.core.data = this.treeData;
          $('#data').jstree(true).refresh(true, true);
        }
      }
    }, error => {
      console.log(error);
    });
  }

  deleteNode() {
    if (confirm('Are you sure to delete ' + this.selectedNode.text)) {
      const backUpTreeDate = this.treeData;
      const id = this.selectedNode.technicalID;
      // this.mockDeletion(id);
      this.testCaseService.deleteNode(id).subscribe(resp => {
        this.toastr.info('Test case successfully deleted');
        return this.testCaseService.getTree().subscribe(
          (resp: any) => {
            if (resp.length === 0) {
              this.treeData.push({
                'id': '1',
                'text': 'root',
                'type': 'B',
                'parent': '#'
              });
            } else {
              $('#data').jstree(true).settings.core.data = resp;
              $('#data').jstree(true).refresh(true, true);
            }
          },
          error => {
            console.log(error);
          }
        );
      }, error => {
        console.log(error);
        this.setTreeData(backUpTreeDate);
      });
    }
  }

  mockDeletion(id) {
    const treeData = this.treeData.filter(node => {
      return node.technicalID !== id;
    });
    this.nodeSelected.emit({
      nodeDeleted: true
    });
    this.setTreeData(treeData);
  }

  setTreeData(data) {
    this.treeData = data;
    $('#data').jstree(true).settings.core.data = this.treeData;
    $('#data').jstree(true).refresh();
  }

  initTree(cameFromSave?, data?) {
    if (cameFromSave) {
      this.createDataTree(data);
    } else {
      return this.testCaseService.getTree().subscribe(
        (resp: any) => {
          if (resp.length === 0) {
            this.treeData.push({
              'id': '1',
              'text': 'root',
              'type': 'B',
              'parent': '#'
            });
          }
          this.createDataTree(resp);
        },
        error => {
          console.log(error);
        }
      );
    }
  }



  getMaxFolderID() {
    let id = 0;
    this.treeData.forEach(node => {
      if (node.type === 'folder' && node.seq >= id) {
        id = node.seq + 1;
      }
    });
    return id;
  }

  getMaxFileID() {
    let id = 0;
    this.treeData.forEach(node => {
      if (node.type === 'file' && node.seq >= id) {
        id = node.seq + 1;
      }
    });
    return id;
  }





}
