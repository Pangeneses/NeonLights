import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AReaderComponent } from './areader.component';

describe('AReaderComponent', () => {
  let component: AReaderComponent;
  let fixture: ComponentFixture<AReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AReaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
