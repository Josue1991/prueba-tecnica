import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/productos/components/productos-list/productos-list.component')
        .then(m => m.ProductosListComponent)
  }
];
