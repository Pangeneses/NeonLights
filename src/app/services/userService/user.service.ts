import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

import { SERVER_URI } from '../../../../environment';
import { ImageService } from '../imageService/image.service';

export interface User {
  UserID: string;
  UserName: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<FormGroup | null>(null);

  public currentUser$: Observable<FormGroup | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private imageService: ImageService
  ) {

    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {

      const data = JSON.parse(savedUser);

      const userForm = this.formBuilder();

      userForm.patchValue(data);

      this.currentUserSubject.next(userForm);
    }

  }

  formBuilder(): FormGroup {

    const fb = new FormBuilder();

    return fb.group({
      ID:           [''],
      Avatar:       [''],
      JournalDesc:  ['', {validators: [Validators.pattern('^$|^[a-zA-Z0-9-# ]+$')], updateOn: 'blur'}],
      UserName:     ['', {validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(8)], updateOn: 'blur'}],
      FirstName:    ['', {validators: [Validators.required, Validators.pattern('^[a-zA-Z-]+$')], updateOn: 'blur'}],
      LastName:     ['', {validators: [Validators.required, Validators.pattern('^[a-zA-Z-]+$')], updateOn: 'blur'}],
      AddressOne:   ['', {validators: [Validators.pattern('^$|^[a-zA-Z0-9- ]+$')], updateOn: 'blur'}],
      AddressTwo:   ['', {validators: [Validators.pattern('^$|^[a-zA-Z0-9- ]+$')], updateOn: 'blur'}],
      City:         ['', {validators: [Validators.pattern('^$|^[a-zA-Z- ]+$')], updateOn: 'blur'}],
      Region:       ['', {validators: [Validators.pattern('^$|^[a-zA-Z- ]+$')], updateOn: 'blur'}],
      Post:         ['', {validators: [Validators.pattern('^$|^[a-zA-Z0-9 ]+$')], updateOn: 'blur'}],
      Country:      ['', {validators: [Validators.pattern('^$|^[a-zA-Z ]+$')], updateOn: 'blur'}],
      EMail:        ['', {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
      Cellphone:    ['', {validators: [], updateOn: 'blur' }],
      DateOfBirth:  ['', {validators: [Validators.pattern('^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$')], updateOn: 'blur'}],
      Password:     ['', {validators: [Validators.required, Validators.pattern('^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})$')], updateOn: 'blur'}],
      ReEnter:      ['', {validators: [Validators.required, Validators.pattern('^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})$')], updateOn: 'blur'}],
    });

  }

  toForm(user: any): FormGroup {

    const fb = new FormBuilder();

    return fb.group({
      ID: [user.ID],
      Avatar: [user.Avatar],
      JournalDesc: [user.JournalDesc],
      UserName: [user.UserName],
      FirstName: [user.FirstName],
      LastName: [user.LastName],
      AddressOne: [user.AddressOne],
      AddressTwo: [user.AddressTwo],
      City: [user.City],
      Region: [user.Region],
      Post: [user.Post],
      Country: [user.Country],
      EMail: [user.EMail],
      Cellphone: [user.Cellphone],
      DateOfBirth: [user.DateOfBirth],
      Role: [user.Role],
    });

  }

  setCurrentUser(userForm: FormGroup) {

    localStorage.setItem('currentUser', JSON.stringify(userForm.getRawValue()));

    this.currentUserSubject.next(userForm);

  }

  clearCurrentUser() {

    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);

  }

  getCurrentUser(): FormGroup | null {

    return this.currentUserSubject.value;

  }

  createUser(form: FormGroup, avatarFile: File | null): Observable<any> | null {

    if (!this.isDirty(form)) return null;

    if (!this.isValid(form)) return null;

    if (!this.isValidAuth(form)) return null;

    const formData = form.getRawValue();

    delete formData.ID;

    this.http.post(`${SERVER_URI}/api/users`, formData);

    if (avatarFile) {

      const maxSize = 1048576;

      if (avatarFile.size > maxSize) {

        alert('Avatar file size is too large! Max size is 1MB.');

        return null;

      }

      return this.imageService.sendImageFileToServer(avatarFile).pipe(
        switchMap((res: any) => {

          const uploadedFilename = res.file.filename;

          form.get('Avatar')?.setValue(uploadedFilename);

          return this.http.post<any>(`${SERVER_URI}/api/users`, formData);

        }),
      );
    } else {

      return this.http.post<any>(`${SERVER_URI}/api/users`, formData);

    }

  }

  updateUser(form: FormGroup, avatarFile: File | null): Observable<any> | null {
    
    if (form.get('Password')?.value !== '') {
    
      if (!this.isValidAuth(form)) return null;
    
    }

    if (!this.isValid(form)) return null;

    if (avatarFile) {
    
      const maxSize = 1048576;

      if (avatarFile?.size > maxSize) {
    
        alert('Avatar file size is too large! Max size is 1MB.');

        return null;
    
      }

      return this.imageService.sendImageFileToServer(avatarFile).pipe(
        switchMap((res: any) => {
    
          const uploadedFilename = res.file.filename;

          form.get('Avatar')?.setValue(uploadedFilename);

          const formData = form.getRawValue();

          const { ID, ...payload } = formData;

          return this.http.put<any>(`${SERVER_URI}/api/users/` + ID, payload);
    
        }),
      );
    } else {
    
      const formData = form.getRawValue();

      const { ID, ...payload } = formData;

      return this.http.put<any>(`${SERVER_URI}/api/users/` + ID, payload);
    
    }
  
  }

  isDirty(validateThis: FormGroup): Boolean {
  
    if (!validateThis.dirty) {
  
      alert('Username, First Name, Last Name, EMail, and Password required.');

      return true;
  
    }

    if (!validateThis.get('UserName')?.dirty) {
  
      alert('Username, First Name, Last Name, EMail, and Password required.');

      return false;
  
    } else if (!validateThis.get('FirstName')?.dirty) {
  
      alert('Username, First Name, Last Name, EMail, and Password required.');

      return false;
  
    } else if (!validateThis.get('LastName')?.dirty) {
  
      alert('Username, First Name, Last Name, EMail, and Password required.');

      return false;
  
    } else if (!validateThis.get('EMail')?.dirty) {
  
      alert('Username, First Name, Last Name, EMail, and Password required.');

      return false;
  
    }

    return true;
  
  }

  isValid(validateThis: FormGroup): Boolean {
  
    if (!validateThis.get('UserName')?.valid) {
  
      alert('UserName is invalid.');

      return false;
  
    } else if (!validateThis.get('FirstName')?.valid) {
  
      alert('First Name is invalid.');

      return false;
  
    } else if (!validateThis.get('LastName')?.valid) {
  
      alert('Last Name is invalid.');

      return false;
  
    } else if (!validateThis.get('AddressOne')?.valid) {
  
      alert('Address One is invalid.');

      return false;
  
    } else if (!validateThis.get('AddressTwo')?.valid) {
  
      alert('AddressTwo is invalid.');

      return false;
  
    } else if (!validateThis.get('City')?.valid) {
  
      alert('City is invalid.');

      return false;
  
    } else if (!validateThis.get('Region')?.valid) {
  
      alert('Region is invalid.');

      return false;
  
    } else if (!validateThis.get('Post')?.valid) {
  
      alert('Post is invalid.');

      return false;
  
    } else if (!validateThis.get('Country')?.valid) {
  
      alert('Country is invalid.');

      return false;
  
    } else if (!validateThis.get('EMail')?.valid) {
  
      alert('EMail is invalid.');

      return false;
  
    } else if (!validateThis.get('Cellphone')?.valid) {
  
      alert('Cellphone is invalid.');

      return false;
  
    } else if (!validateThis.get('DateOfBirth')?.valid) {
  
      alert('Date Of Birth is invalid.');

      return false;
  
    } else if (!validateThis.get('JournalDesc')?.valid) {
  
      alert('You re-entered your password wrong.');

      return false;
  
    }

    return true;
 
  }

  isValidAuth(validateThis: FormGroup): Boolean {
 
    if (!validateThis.get('Password')?.dirty) {
 
      alert('Username, First Name, Last Name, EMail, and Password required.');

      return false;
 
    } else if (!validateThis.get('ReEnter')?.dirty) {
 
      alert('Username, First Name, Last Name, EMail, and Password required.');

      return false;
 
    }

    if (!validateThis.get('Password')?.valid) {
 
      alert('Password is invalid.');

      return false;
 
    } else if (!validateThis.get('ReEnter')?.valid) {
 
      alert('You re-entered your password wrong.');

      return false;
 
    }

    if (validateThis.get('ReEnter')?.getRawValue() !== validateThis.get('Password')?.getRawValue()) {
 
      alert('Passwords must match.');

      return false;
 
    }

    return true;
 
  }

}
