import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/auth';

@Component({
  selector: 'kt-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  pwConfirmation = new FormControl({ value: '', disabled: true }, []);
  password = new FormControl('', []);
  firstName = new FormControl('', []);
  lastName = new FormControl('', []);
  hide = true;
  disableSubmit = false;
  connectedProfile;
  success = false;

  getErrorMessage(field: FormControl) {
    console.log(field.errors);
    return field.hasError('required') ? 'You must enter a value' :
      field.hasError('email') ? 'Not a valid email' :
        field.hasError('length') ? 'Value should be at least 6 characters ' :
          '';
  }

  constructor(private fb: FormBuilder,
    private auth: AuthService) { }

  ngOnInit() {
    this.auth.getConnectedUser().subscribe(
      (resp: any) => {
        this.initFormFields(resp);
        this.connectedProfile = resp;
      },
      error => {
        console.log(error);
      }
    )
  }

  onPasswordValueChange() {
    if (this.password.value) {
      this.password.setValidators([Validators.minLength(6)]);
      this.pwConfirmation.enable();
      this.pwConfirmation.setValidators([Validators.required, Validators.minLength(6)]);
      this.disableSubmit = true;
    } else {
      this.pwConfirmation.disable();
      this.pwConfirmation.setValidators([]);
      this.disableSubmit = false;
    }

    this.password.updateValueAndValidity(); //Need to call this to trigger a update
    this.pwConfirmation.updateValueAndValidity(); //Need to call this to trigger a update
  }

  onPwConfirmValueChange() {
    if (this.pwConfirmation.value !== this.password.value)
      this.disableSubmit = true;
    else
      this.disableSubmit = false;
  }

  initFormFields(user) {
    this.firstName.setValue(user.firstName);
    this.lastName.setValue(user.lastName);
  }

  submitForm(form) {
    let profile = {
      'userID': this.connectedProfile.id,
      'password': this.password.value,
      'firstName': this.firstName.value,
      'lastName': this.lastName.value
    }
    this.auth.updateProfile(profile).subscribe(
      (resp: any) => {
        this.success = true;
        console.log(resp);
      },
      error => {
        this.success = true;
        console.log(error);
      }
    )
  }

}
