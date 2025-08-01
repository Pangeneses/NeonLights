import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToSComponent } from './tos.component';

describe('ToSComponent', () => {
  let component: ToSComponent;
  let fixture: ComponentFixture<ToSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToSComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
