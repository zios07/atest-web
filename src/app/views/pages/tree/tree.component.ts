import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import 'jstree';
import { Node } from '../../../core/test-case/model/Node';
import { TestCaseService } from '../../../core/test-case/services/test-case.service';
declare var $: any;

@Component({
  selector: 'kt-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Output() nodeSelected = new EventEmitter<any>();
  @Input() nodeAdded: Node;

  @ViewChild('jstreearea') jsTree: ElementRef;
  treeData: Array<any> = [];
  selectedNode;
  tree;

  constructor(private testCaseService: TestCaseService) {
    this.initTree();
  }

  ngOnInit() {
  }


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
        check_callback: true
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
        }
      };
    }
    return items;
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
