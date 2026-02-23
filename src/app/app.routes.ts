import { Routes } from '@angular/router';
import { BrandsComponent } from './pages/brands/brands.component';
import { NewItemsComponent } from './pages/new-items/new-items.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { BrandDetailComponent } from './pages/brand-detail/brand-detail.component';
import { FavoriteDetailComponent } from './pages/favorite-detail/favorite-detail.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'brands/:id', component: BrandDetailComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'brands', pathMatch: 'full' },
      { path: 'brands', component: BrandsComponent },
      { path: 'new-items', component: NewItemsComponent },
      { path: 'favorites/:id', component: FavoriteDetailComponent },
      { path: 'favorites', component: FavoritesComponent },
    ],
  },
];
