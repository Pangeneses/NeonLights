import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ANewComponent } from './anew.component';

describe('ANewComponent', () => {
  let component: ANewComponent;
  let fixture: ComponentFixture<ANewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ANewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ANewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
