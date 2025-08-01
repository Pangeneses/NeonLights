import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FNavComponent } from './fnav.component';

describe('FNavComponent', () => {
  let component: FNavComponent;
  let fixture: ComponentFixture<FNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
