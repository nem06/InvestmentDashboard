import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualfundComponent } from './mutualfund.component';

describe('DashboardComponent', () => {
  let component: MutualfundComponent;
  let fixture: ComponentFixture<MutualfundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MutualfundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutualfundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
