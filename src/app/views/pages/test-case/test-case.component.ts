import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'jstree';
import { TestCase } from '../../../core/test-case/model/TestCase';
import { TestCaseService } from '../../../core/test-case/services/test-case.service';

declare var $: any;

class TreeNode {
  id: number;
  text: string;
  type: string;
  parent: TreeNode;
  children: TreeNode[];
  testCase: TestCase;
}

@Component({
  selector: 'kt-test-case',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.scss']
})
export class TestCaseComponent implements OnInit {

  @ViewChild('jstreearea') jsTree: ElementRef;
  data: TreeNode[] = [];

  testCase: TestCase;
  treeNode: TreeNode;
  public Editor = ClassicEditor;
  testCaseForm: FormGroup;
  errors: any = [];

  constructor(
    private fb: FormBuilder,
    private testCaseService: TestCaseService) {
    this.testCase = new TestCase();
    this.treeNode = new TreeNode();
  }

  ngOnInit() {
    this.initTestCaseForm();
    this.createDataTree([1]);
  }

  submitForm() {
    this.testCaseService.createTestCase(this.testCaseForm.value).subscribe(
      resp => {
        this.newTestCaseAdded(resp);
      },
      error => {
        console.log(error);
      }
    );
  }

  newTestCaseAdded(testCase) {

  }

  toggleDetailsView() {
    alert(' I am triggered ');
  }

  createDataTree(data: Array<any>) {
    let treeOnClick = (treeId, treeNode) => {
      console.log(treeId);
      console.log(treeNode);
    };
    let treeData = [];
    for (let item of data) {
      treeData.push({
        'id': 1,
        'text': 'name',
        'type': 'B',
        'parent': '#'
      },
        {
          'id': 2,
          'text': 'cris',
          'type': 'folder',
          'parent': 1
        });
    }

    let tree = $(this.jsTree.nativeElement).jstree({
      'core': {
        'data': treeData,
        'check_callback': true
      },
      'types': {
        'folder': {
          'icon': 'jstree-icon jstree-folder'
        },
        'file': {
          'icon': 'jstree-icon jstree-file'
        },
        'B': {
          'icon': 'fa fa-database'
        }
      },
      'plugins': ['sort', 'wholerow', 'dnd', 'contextmenu', 'types']

      // 'plugins': ['dnd', 'wholerow', 'search', 'types']
    });
    tree.on('select_node.jstree', function (e, data) {
      treeOnClick('jstree_data', data.node)
    });
  }

  buildTreeData(result) {

    for (let v = 0; v < result.length; v++) {
      this.treeNode = new TreeNode();
      this.treeNode.id = result[v].nodeId;
      this.treeNode.type = 'folder';
      this.treeNode.text = result[v].nodeName;
      this.treeNode.children = [];
      // for (let i = 0; i < result[v].testCases.length; i++) {
      //   this.treeNodeschild = new TreeNode();
      //   this.treeNodeschild.type = 'file';
      //   this.treeNodeschild.id = result[v].testCases[i].id;
      //   this.treeNodeschild.text = result[v].testCases[i].name;
      //   this.treeNode.children.push(this.treeNodeschild);
      // }
    }
  }

	/**
	 * Form initalization
	 * Default params, validators
	 */
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