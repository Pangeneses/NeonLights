import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FNewComponent } from './fnew.component';

describe('FNewComponent', () => {
  let component: FNewComponent;
  let fixture: ComponentFixture<FNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
