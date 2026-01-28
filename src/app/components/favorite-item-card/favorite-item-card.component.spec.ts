import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteItemCardComponent } from './favorite-item-card.component';

describe('FavoriteItemCardComponent', () => {
  let component: FavoriteItemCardComponent;
  let fixture: ComponentFixture<FavoriteItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteItemCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
