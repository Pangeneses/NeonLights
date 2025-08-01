import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FReaderComponent } from './freader.component';

describe('FReaderComponent', () => {
  let component: FReaderComponent;
  let fixture: ComponentFixture<FReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FReaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
