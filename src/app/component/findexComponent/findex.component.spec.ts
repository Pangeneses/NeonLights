import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FIndexComponent } from './findex.component';

describe('FIndexComponent', () => {
  let component: FIndexComponent;
  let fixture: ComponentFixture<FIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FIndexComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
