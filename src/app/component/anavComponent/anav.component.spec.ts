import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ANavComponent } from './anav.component';

describe('ANavComponent', () => {
  let component: ANavComponent;
  let fixture: ComponentFixture<ANavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ANavComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ANavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
