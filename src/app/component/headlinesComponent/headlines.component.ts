import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { HeaderComponent } from '../../component/headerComponent/header.component';
import { FooterComponent } from '../../component/footerComponent/footer.component';

import { ArticleExtended } from '../../services/articleService/article.service';

@Component({
  selector: 'home-component-headlines',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './headlines.component.html',
  styleUrl: './headlines.component.scss',
})
export class HeadlinesComponent implements OnInit {

  @ViewChild('carousel') carousel!: ElementRef;

  featuredArticles: ArticleExtended[] = [];

  trackHeadlineFN(index: number, article: ArticleExtended): string {
    return article.ArticleID;
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  ngOnInit(): void {
    /*
        for(let i = 0; i < this.items.length; i++){
      
          var request = new XMLHttpRequest();
      
          request.open("GET", this.items[i].image, true);
      
          request.send();
    
          if (request.status != 200) {
            //this.items[i].image="../../../../../public/RedDragon.webp"
          }
        }
          */
  }
}
