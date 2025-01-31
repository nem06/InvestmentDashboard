import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTilesComponent } from './live-tiles.component';

describe('LiveTilesComponent', () => {
  let component: LiveTilesComponent;
  let fixture: ComponentFixture<LiveTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveTilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
