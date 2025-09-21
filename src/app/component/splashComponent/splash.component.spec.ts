import { TestBed } from '@angular/core/testing';
import { SplashComponent } from './splash.component';

describe('SplashComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplashComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SplashComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Your Site' title`, () => {
    const fixture = TestBed.createComponent(SplashComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Your Site');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(SplashComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, Your Site');
  });
});
