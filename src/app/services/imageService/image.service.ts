import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SERVER_URI } from '../../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  constructor(private http: HttpClient) {}

  sendImageFileToServer(imageFile: File): Observable<any> {

    const formData = new FormData();

    formData.append('file', imageFile);

    return this.http.post(`${SERVER_URI}/api/images`, formData);

  }

  deleteImageFileFromServer(filename: string) {

    return this.http.delete(`${SERVER_URI}/api/images/${filename}`);

  }

}

