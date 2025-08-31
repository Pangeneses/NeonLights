import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  constructor(private http: HttpClient) { }

  sendImageFileToServer(imageFile: File): Observable<any> {

    const formData = new FormData();

    formData.append('file', imageFile);

    return this.http.post(`${environment.IMAGE_REPO}`, formData);

  }

  deleteImageFileFromServer(filename: string) {

    return this.http.delete(`${environment.IMAGE_REPO}/${filename}`);

  }

}

