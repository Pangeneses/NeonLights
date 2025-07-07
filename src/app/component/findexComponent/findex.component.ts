import { Component } from '@angular/core';
import { HeaderComponent } from '../headerComponent/header.component';
import { FooterComponent } from '../footerComponent/footer.component';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';

import { EnumSearchForumBy } from '../../services/forumService/forum.service';

@Component({
  selector: 'forum-component-findex',
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    MatNativeDateModule,
    MatCalendar,
    MatIcon],
  templateUrl: './findex.component.html',
  styleUrl: './findex.component.scss'
})
export class FIndexComponent {

  EnumSearchForumBy = EnumSearchForumBy;
  SearchForumBy = EnumSearchForumBy.Category;

  selectedDate = new Date();

  ngOnInit(): void {
  }

  onDropdownChange(nav: EnumSearchForumBy) {

    if (nav == EnumSearchForumBy.User) console.log("worked");

  }

}

