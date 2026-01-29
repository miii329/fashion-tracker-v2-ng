import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandInputModalComponent } from './brand-input-modal.component';

describe('BrandInputModalComponent', () => {
  let component: BrandInputModalComponent;
  let fixture: ComponentFixture<BrandInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandInputModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
