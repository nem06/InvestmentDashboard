import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentPatternComponent } from './investment-pattern.component';

describe('InvestmentPatternComponent', () => {
  let component: InvestmentPatternComponent;
  let fixture: ComponentFixture<InvestmentPatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentPatternComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
