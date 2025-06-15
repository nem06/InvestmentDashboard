import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfViewComponent } from './mf-view.component';

describe('MfViewComponent', () => {
  let component: MfViewComponent;
  let fixture: ComponentFixture<MfViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
