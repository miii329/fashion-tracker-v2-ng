import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteItemInputModalComponent } from './favorite-item-input-modal.component';

describe('FavoriteItemInputModalComponent', () => {
  let component: FavoriteItemInputModalComponent;
  let fixture: ComponentFixture<FavoriteItemInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteItemInputModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteItemInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
