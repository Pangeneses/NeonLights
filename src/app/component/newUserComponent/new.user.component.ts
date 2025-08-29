import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/userService/user.service';

@Component({
  selector: 'app-component-new-user',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './new.user.component.html',
  styleUrl: './new.user.component.scss',
})
export class NewUserComponent implements OnInit {

  form: FormGroup;

  constructor(private userService: UserService) {
  
    this.form = this.userService.formBuilder();

    this.form.patchValue({
      Avatar: '',
      JournalDesc: '',
      UserName: '',
      FirstName: '',
      LastName: '',
      AddressOne: '',
      AddressTwo: '',
      City: '',
      Region: '',
      Post: '',
      Country: '',
      EMail: '',
      Cellphone: '',
      DateOfBirth: '',
      Password: '',
      ReEnter: '',
    });

  }

  ngOnInit(): void {}

  @Output() notify = new EventEmitter<void>();

  onSave() {
    
    const result = this.userService.createUser(this.form, this.avatarFile);

    if (result) {

      result.subscribe({

        next: (res) => console.log('User created:', res),

        error: (err) => console.error('Error creating user:', err),

      });

    } else return;

    this.notify.emit();

  }

  onDelete() {

    this.notify.emit();

  }

  avatarFile: File | null = null;
  avatarURL = './camera.webp';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onFileSelectTriggered(): void {

    this.fileInput.nativeElement.click();

  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.avatarFile = input.files[0];

      const reader = new FileReader();

      reader.onload = () => {

        this.avatarURL = reader.result as string;

      };

      reader.readAsDataURL(this.avatarFile);

    }

  }

  journalDescPlaceholder = 'Journal Description';

  getJournalDesc() {

    return this.form.get('JournalDesc');

  }

  onJournalDescBlur(): void {

    const control = this.getJournalDesc();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {

      control.patchValue('');

      this.journalDescPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

  userNamePlaceholder = 'UserName*';

  getUserName() {
    
    return this.form.get('UserName');
  
  }

  onUserNameBlur(): void {
  
    const control = this.getUserName();

    control?.markAsTouched();

    if (control?.errors?.['required']) {
  
      this.userNamePlaceholder = 'UserName is required';

      return;
  
    } else if (control?.errors?.['minlength']) {
  
      control.patchValue('');

      this.userNamePlaceholder = 'At least 8 characters';

      return;
  
    } else if (control?.errors?.['pattern']) {
  
      control.patchValue('');

      this.userNamePlaceholder = 'Must follow standard UserName pattern a-zA-Z0-9.';

      return;
  
    } else {
  
      return;
  
    }
  
  }

  firstNamePlaceholder = 'First Name*';

  getFirstName() {
  
    return this.form.get('FirstName');
  
  }

  onFirstNameBlur(): void {
  
    const control = this.getFirstName();

    control?.markAsTouched();

    if (control?.errors?.['required']) {
  
      this.firstNamePlaceholder = 'First Name is required';

      return;
  
    } else if (control?.errors?.['pattern']) {
  
      control.patchValue('');

      this.firstNamePlaceholder = 'Must follow standard pattern a-z A-Z.';

      return;
  
    } else {
  
      return;
  
    }
  
  }

  lastNamePlaceholder = 'Last Name*';

  getLastName() {
  
    return this.form.get('LastName');
  
  }

  onLastNameBlur(): void {
  
    const control = this.getLastName();

    control?.markAsTouched();

    if (control?.errors?.['required']) {
  
      this.lastNamePlaceholder = 'Last Name is required';

      return;
  
    } else if (control?.errors?.['pattern']) {
  
      control.patchValue('');

      this.lastNamePlaceholder = 'Must follow standard pattern a-z A-Z.';

      return;
  
    } else {
  
      return;
  
    }
  
  }

  addressOnePlaceholder = 'Address One';

  getAddressOne() {
  
    return this.form.get('AddressOne');
  
  }

  onAddressOneBlur(): void {
  
    const control = this.getAddressOne();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {
  
      control.patchValue('');

      this.addressOnePlaceholder = 'Must follow standard pattern.';

      return;
  
    } else {
  
      return;
  
    }
  
  }

  addressTwoPlaceholder = 'Address Two';

  getAddressTwo() {
  
    return this.form.get('AddressTwo');
  
  }

  onAddressTwoBlur(): void {
  
    const control = this.getAddressTwo();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {
      control.patchValue('');

      this.addressTwoPlaceholder = 'Must follow standard pattern.';

      return;
  
    } else {
  
      return;
  
    }
  
  }

  cityPlaceholder = 'City';

  getCity() {

    return this.form.get('City');

  }

  onCityBlur(): void {

    const control = this.getCity();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {

      control.patchValue('');

      this.cityPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

  regionPlaceholder = 'Region';

  getRegion() {

    return this.form.get('Region');

  }

  onRegionBlur(): void {

    const control = this.getRegion();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {

      control.patchValue('');

      this.regionPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

  postPlaceholder = 'Post';

  getPost() {

    return this.form.get('Post');

  }

  onPostBlur(): void {

    const control = this.getPost();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {

      control.patchValue('');

      this.postPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

  countryPlaceholder = 'Country';

  getCountry() {

    return this.form.get('Country');

  }

  onCountryBlur(): void {

    const control = this.getCountry();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {

      control.patchValue('');

      this.countryPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

  emailPlaceholder = 'EMail*';

  getEMail() {

    return this.form.get('EMail');

  }

  onEMailBlur(): void {

    const control = this.getEMail();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {
      control.patchValue('');

      this.emailPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

  cellphonePlaceholder = 'Cellphone';

  getCellphone() {

    return this.form.get('Cellphone');

  }

  onCellphoneBlur(): void {

    const control = this.getCellphone();

    control?.markAsTouched();

  }

  dateOfBirthPlaceholder = 'Date of Birth';

  getDateOfBirth() {

    return this.form.get('DateOfBirth');

  }

  onDateOfBirthBlur(): void {

    const control = this.getDateOfBirth();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {

      control.patchValue('');

      this.dateOfBirthPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

  passwordPlaceholder = 'Password*';

  getPassword() {

    return this.form.get('Password');

  }

  onPasswordBlur(): void {

    const control = this.getPassword();

    control?.markAsTouched();

    if (!control) alert('fail');

    if (control?.errors?.['pattern']) {

      control.patchValue('');

      this.passwordPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

  reenterPlaceholder = 'Re-Enter Password*';

  getReEnter() {

    return this.form.get('ReEnter');

  }

  onReEnterBlur(): void {

    const control = this.getReEnter();

    control?.markAsTouched();

    if (control?.errors?.['pattern']) {

      control.patchValue('');

      this.reenterPlaceholder = 'Must follow standard pattern.';

      return;

    } else {

      return;

    }

  }

}
