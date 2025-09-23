import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldStocksComponent } from './sold-stocks.component';

describe('SoldStocksComponent', () => {
  let component: SoldStocksComponent;
  let fixture: ComponentFixture<SoldStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldStocksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
