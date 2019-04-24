import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'jstree';
import { TestCaseService } from '../../../core/test-case/services/test-case.service';

declare var $: any;

@Component({
  selector: 'kt-test-case',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.scss']
})
export class TestCaseComponent implements OnInit {

  @ViewChild('jstreearea') jsTree: ElementRef;
  data: any[] = [];
  treeData: TreeDatas = new TreeDatas();
  treeDataschild: TreeDatasChild = new TreeDatasChild();
  treeDataschildNode: TreeDatasChild = new TreeDatasChild();
  public Editor = ClassicEditor;
  testCaseForm: FormGroup;
  loading = false;
  errors: any = [];

  constructor(
    private fb: FormBuilder,
    private testCaseService: TestCaseService) { }

  submitForm() {
    this.loading = true;
    this.testCaseService.createTestCase(this.testCaseForm.value).subscribe(
      resp => {
        this.loading = false;
        console.log(this.loading);
        console.log(resp);
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }

  ngOnInit() {
    this.initTestCaseForm();
    this.getAllData();
  }

  toggleDetailsView() {
  }

  getAllData() {
    let result = [];
    this.jsTree.nativeElement.addEventListener('click', this.toggleDetailsView.bind(this));

    this.buildTreeData(result);
    this.data.push(this.treeData);

    $('#data').jstree({
      "types": {
        "folder": {
          "icon": "jstree-icon jstree-folder"
        },
        "file": {
          "icon": "jstree-icon jstree-file"
        }
      },
      'core': {
        'data': this.data
      },

      "plugins": ["sort", "wholerow", "dnd", "contextmenu", "types"]
    });

    $('#data').on("changed.jstree", (e, data) => {
      if (data.node && data.node.type === 'file') {
      }
    });
    $('#data').on('activate_node.jstree', function (e, data) {
      if (data === undefined || data.node === undefined || data.node.id === undefined) {
        return;
      }
    });
  }

  buildTreeData(result) {

    for (let v = 0; v < result.length; v++) {
      this.treeData = new TreeDatas();
      this.treeData.id = result[v].nodeId;
      this.treeData.type = 'folder';
      this.treeData.text = result[v].nodeName;
      this.treeData.children = [];
      for (let i = 0; i < result[v].testCases.length; i++) {
        this.treeDataschild = new TreeDatasChild();
        this.treeDataschild.type = 'file';
        this.treeDataschild.id = result[v].testCases[i].id;
        this.treeDataschild.text = result[v].testCases[i].name;
        this.treeData.children.push(this.treeDataschild);
      }
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
    })
  }
}

class TreeDatas {
  public id: number;
  public text: string;
  public type: string;
  public children: TreeDatasChild[];
}

class TreeDatasChild {
  public id: number;
  public type: string;
  public text: string;
}
