import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'jstree';
import { TestCase } from '../../../core/test-case/model/TestCase';
import { TestCaseService } from '../../../core/test-case/services/test-case.service';
import { Node } from '../../../core/test-case/model/Node';
import { ToastrService } from 'ngx-toastr';
import { TreeComponent } from '../tree/tree.component';

declare var $: any;

@Component({
  selector: 'kt-test-case',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.scss']
})
export class TestCaseComponent implements OnInit {

  @ViewChild('child')
  private childComponent: TreeComponent;

  testCase: TestCase;
  public Editor = ClassicEditor;
  testCaseForm: FormGroup;
  showForm = false;

  // incoming infos from tree component
  treeData = [];
  selectedNode;

  constructor(private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private testCaseService: TestCaseService) {
    this.testCase = new TestCase();
  }

  ngOnInit() {
    this.initTestCaseForm();
  }

  onNodeSelected(event) {
    if (event.nodeDeleted) {
      this.showForm = false;
      return;
    }
    this.treeData = event.tree;
    this.selectedNode = event.selectedNode;
    if (this.selectedNode && this.selectedNode.type === 'file') {
      this.showForm = true;
    } else {
      this.showForm = false;
    }
    if (this.selectedNode.testCase) {
      this.testCase = this.selectedNode.testCase;
      this.testCaseForm.get('title').setValue(this.testCase.title);
      this.testCaseForm.get('type').setValue(this.testCase.type);
      this.testCaseForm.get('category').setValue(this.testCase.category);
      this.testCaseForm.get('priority').setValue(this.testCase.priority);
      this.testCaseForm.get('complexity').setValue(this.testCase.complexity);
      this.testCaseForm.get('componentName').setValue(this.testCase.componentName);
      this.testCaseForm.get('componentOwner').setValue(this.testCase.componentOwner);
      this.testCaseForm.get('executionType').setValue(this.testCase.executionType);
      this.testCaseForm.get('requirementReference').setValue(this.testCase.requirementReference);
      this.testCaseForm.get('requirementOwner').setValue(this.testCase.requirementOwner);
      this.testCaseForm.get('requirementPath').setValue(this.testCase.requirementPath);
      this.testCaseForm.get('preConditions').setValue(this.testCase.preConditions);
      this.testCaseForm.get('steps').setValue(this.testCase.steps);
      this.testCaseForm.get('verifications').setValue(this.testCase.verifications);

      // Disable fields
      this.disabledFormFields();
    } else {
      this.enableFormFields();
      this.clearForm();
    }
  }

  submitForm() {
    let treeToSave = this.createTreeToSave();
    this.testCaseService.createTestCase(treeToSave, 'node/multiple').subscribe(
      resp => {
        this.treeData = resp;
        this.childComponent.setTreeData(resp);
        this.toastr.success('Test case saved successfully');
      },
      error => {
        console.log(error);
      }
    );
  }

  clearForm() {
    this.testCaseForm.get('title').setValue(null);
    this.testCaseForm.get('type').setValue(null);
    this.testCaseForm.get('category').setValue(null);
    this.testCaseForm.get('priority').setValue(null);
    this.testCaseForm.get('complexity').setValue(null);
    this.testCaseForm.get('componentName').setValue(null);
    this.testCaseForm.get('componentOwner').setValue(null);
    this.testCaseForm.get('executionType').setValue(null);
    this.testCaseForm.get('requirementReference').setValue(null);
    this.testCaseForm.get('requirementOwner').setValue(null);
    this.testCaseForm.get('requirementPath').setValue(null);
    this.testCaseForm.get('preConditions').setValue(null);
    this.testCaseForm.get('steps').setValue(null);
    this.testCaseForm.get('verifications').setValue(null);
  }

  createTreeToSave() {
    let tree = [];
    this.treeData.forEach(node => {
      let n = new Node();
      n.id = node.id;
      if ((n.testCase || node.type !== 'folder') && this.selectedNode.id === node.id) {
        n.testCase = this.testCaseForm.value;
      } else if (node.testCase && this.selectedNode.id !== node.id) {
        n.testCase = node.testCase;
      }
      n.seq = node.seq;
      n.text = node.text;
      n.type = node.type;
      n.technicalID = node.technicalID;
      n.parent = node.parent;
      tree.push(n);
    });
    return tree;
  }


  disabledFormFields() {
    this.testCaseForm.disable();
  }

  enableFormFields() {
    this.testCaseForm.enable();
  }

  initTestCaseForm() {
    this.testCaseForm = this.fb.group({
      title: [{ value: '' }],
      type: [{ value: '' }],
      category: [{ value: '' }],
      priority: [{ value: '' }],
      complexity: [{ value: '' }],
      componentName: [{ value: '' }],
      componentOwner: [{ value: '' }],
      executionType: [{ value: '' }],
      requirementReference: [{ value: '' }],
      requirementOwner: [{ value: '' }],
      requirementPath: [{ value: '' }],
      preConditions: [{ value: '' }],
      steps: [{ value: '' }],
      verifications: [{ value: '' }]
    });
  }
}