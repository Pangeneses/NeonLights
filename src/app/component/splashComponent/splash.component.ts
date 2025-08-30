import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-component-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit, AfterViewInit {

  @Output() ended = new EventEmitter<void>();

  @Input() videoFile: string | null = null;

  videoSource: string | null = null;

  @ViewChild('splashVideo') splashVideo!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void {

    if (this.videoFile) {
      this.videoSource = this.videoFile;
      console.log("Video source set in ngOnInit.");
    }

  }

  ngAfterViewInit(): void {

    if (this.splashVideo && this.videoSource) {
      
      const videoElement = this.splashVideo.nativeElement;

      videoElement.currentTime = 0;

      videoElement.muted = true;

      videoElement.play().catch(error => {        
        console.error("Play request was interrupted: ", error);
        
        setTimeout(() => {
          videoElement.play().catch((err) => {
            console.error("Retry play failed: ", err);
          });
        }, 500);

      });

    }

  }

  onVideoEnd(): void {
    const videoElement = this.splashVideo.nativeElement;

    videoElement.currentTime = videoElement.duration;

    videoElement.pause();

    this.ended.emit();
  }

}
