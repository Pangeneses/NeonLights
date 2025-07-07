import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ForumService {

}

export enum EnumSearchForumBy {
  Category = 'Category',
  User = 'User',
  Hashtag = 'Hashtag'
}