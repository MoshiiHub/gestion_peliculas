import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeliculasListComponent } from './pages/peliculas-list/peliculas-list.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SearchPeliculasComponent } from './pages/search-peliculas/search-peliculas.component';
import { FavoritoPeliculaComponent } from './pages/favorito-pelicula/favorito-pelicula.component';
import { AuthGuardPublic } from '../guards/auth.guard';

import { InicioComponent } from './pages/inicio/inicio.component';
import { DetallesPeliculasComponent } from './pages/detalles-peliculas/detalles-peliculas.component';

// Asegúrate de importar el componente

const routes: Routes = [
  {path:'',
    component:LayoutPageComponent,
    children: [
  { path: 'peliculas-list', component: PeliculasListComponent,canActivate:[AuthGuardPublic] },
  {path: 'search-peliculas', component:SearchPeliculasComponent,canActivate:[AuthGuardPublic]},
  {path: 'favoritos', component: FavoritoPeliculaComponent,canActivate:[AuthGuardPublic]},
  { path: 'peliculas/:id', component: DetallesPeliculasComponent,canActivate:[AuthGuardPublic] },
  {path: 'inicio', component: InicioComponent,canActivate:[AuthGuardPublic]},
  {path: '**', redirectTo: '404'}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeliculasRoutingModule { }
