import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIndexComponent } from './aindex.component';

describe('AIndexComponent', () => {
  let component: AIndexComponent;
  let fixture: ComponentFixture<AIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AIndexComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
