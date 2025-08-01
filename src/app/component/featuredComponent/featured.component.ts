import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgFor } from '@angular/common';
import { HeaderComponent } from '../../component/headerComponent/header.component';
import { FooterComponent } from '../../component/footerComponent/footer.component';

@Component({
  selector: 'shop-component-featured',
  imports: [NgFor, HeaderComponent, FooterComponent],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss',
})
export class FeaturedComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef;

  items = [
    {
      title: 'Welcome to the Red Dragons Society website.',
      image: '../../../../public/RedDragon.webp',
      description: 'A beautiful sunset over the hills.',
    },
    {
      title: 'Welcome to the Red Dragons Society website.',
      image: '../../../../public/RedDragon.webp',
      description: 'A beautiful sunset over the hills.',
    },
    {
      title: 'Welcome to the Red Dragons Society website.',
      image: '../../../../public/RedDragon.webp',
      description: 'A beautiful sunset over the hills.',
    },
    {
      title: 'Welcome to the Red Dragons Society website.',
      image: '../../../../public/RedDragon.webp',
      description: 'A beautiful sunset over the hills.',
    },
    {
      title: 'Welcome to the Red Dragons Society website.',
      image: '../../../../public/RedDragon.webp',
      description: 'A beautiful sunset over the hills.',
    },
    {
      title: 'Welcome to the Red Dragons Society website.',
      image: '../../../../public/RedDragon.webp',
      description: 'A beautiful sunset over the hills.',
    },
    {
      title: 'Welcome to the Red Dragons Society website.',
      image: '../../../../public/RedDragon.webp',
      description: 'A beautiful sunset over the hills.',
    },
    {
      title: 'Welcome to the Red Dragons Society website.',
      image: '../../../../public/RedDragon.webp',
      description: 'A beautiful sunset over the hills.',
    },
  ];

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
