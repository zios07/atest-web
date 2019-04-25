import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'jstree';
import { Node } from '../../../core/test-case/model/Node';
import { TestCase } from '../../../core/test-case/model/TestCase';
import { TestCaseService } from '../../../core/test-case/services/test-case.service';

declare var $: any;

@Component({
  selector: 'kt-test-case',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.scss']
})
export class TestCaseComponent implements OnInit {

  @ViewChild('jstreearea') jsTree: ElementRef;
  treeData: Array<any> = [];
  selectedNode;
  tree;

  maxFolderID: number = 1;
  maxFileID: number = 1;

  testCase: TestCase;
  public Editor = ClassicEditor;
  testCaseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private testCaseService: TestCaseService) {
    this.testCase = new TestCase();
  }

  ngOnInit() {
    this.initTestCaseForm();
    this.initTree();
    this.calculateMaxIDs();
  }

  submitForm() {
    let treeToSave = this.createTreeToSave();
    this.testCaseService.createTestCase(treeToSave, 'node/multiple').subscribe(
      resp => {
        this.initTree(true, resp);
      },
      error => {
        console.log(error);
      }
    );
  }

  createTreeToSave() {
    let tree = [];
    this.treeData.forEach(node => {
      let n = new Node();
      n.testCase = (node.type !== 'folder' && this.selectedNode.id === node.id) ? this.testCaseForm.value : null;
      n.text = node.text;
      n.type = node.type;
      n.parent = node.parent;
      tree.push(n);
    });
    return tree;
  }


  initTree(cameFromSave?, data?) {
    if (cameFromSave) {
      this.createDataTree(data);
    } else {
      return this.testCaseService.getTree().subscribe(
        resp => {
          // TODO: Just refresh it to you the new data , depending on when we came from ?
          if (this.treeData.length === 0) {
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

  createDataTree(data) {
    let treeOnClick = (treeId, treeNode) => {
      this.selectedNode = treeNode.original;
      // TODO: two way binding thing ...
      if (this.selectedNode && this.selectedNode.testCase) {
        console.log('Selected node test case');
        console.log(this.selectedNode.testCase);
        this.testCase = treeNode.original.testCase;
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

  calculateMaxIDs() {
    this.treeData.forEach(item => {
      if (item.type === 'folder') {
        this.maxFolderID = item.id;
      }
      if (item.type === 'file') {
        this.maxFileID = item.id;
      }
    });
  }



  customMenu(this) {
    let self = this;
    let items;
    if (this.selectedNode && this.selectedNode.type !== 'file') {
      items = {
        item1: {
          label: 'Create folder',
          action: function (data) {
            console.log(data);
            self.treeData.push({
              id: 'folder' + (self.maxFolderID + 1),
              text: 'folder ' + (self.maxFolderID + 1),
              type: 'folder',
              parent: self.selectedNode.id
            });
            self.maxFolderID++;
            $('#data').jstree(true).settings.core.data = self.treeData;
            $('#data').jstree(true).refresh();
          }
        },
        item2: {
          label: 'Create test case',
          action: function (data) {
            console.log(data);
            self.treeData.push({
              id: 'file' + (self.maxFileID + 1),
              text: 'test case ' + (self.maxFileID + 1),
              type: 'file',
              parent: self.selectedNode.id
            });
            self.maxFileID++;
            $('#data').jstree(true).settings.core.data = self.treeData;
            $('#data').jstree(true).refresh();
          }
        }
      };
    }
    return items;
  }


  initTestCaseForm() {
    this.testCaseForm = this.fb.group({
      title: [''],
      type: [''],
      category: [''],
      priority: [],
      complexity: [''],
      componentName: [''],
      componentOwner: [''],
      executionType: [''],
      requirementReference: [''],
      requirementOwner: [''],
      requirementPath: [''],
      preConditions: [''],
      steps: [''],
      verifications: ['']
    });
  }
}