import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PeliculasRoutingModule } from './peliculas-routing.module';
import { MaterialModule } from '../material/material.module'; // Import MaterialModule here

import { CardComponent } from './components/card/card.component';
import { PeliculasListComponent } from './pages/peliculas-list/peliculas-list.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SearchPeliculasComponent } from './pages/search-peliculas/search-peliculas.component';
import { FavoritoPeliculaComponent } from './pages/favorito-pelicula/favorito-pelicula.component';
import { DetallesPeliculasComponent } from './pages/detalles-peliculas/detalles-peliculas.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { EditUsuarioDialogComponent } from './pages/gestion-usuarios/edit-usuario/edit-usuario.component';

@NgModule({
  declarations: [
    CardComponent,
    PeliculasListComponent,
    LayoutPageComponent,
    SearchPeliculasComponent,
    FavoritoPeliculaComponent,
    DetallesPeliculasComponent,
    GestionUsuariosComponent,
    EditUsuarioDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PeliculasRoutingModule,
    MaterialModule, // Use the MaterialModule here
  ],
  exports: [
    CardComponent,
    PeliculasListComponent,
    LayoutPageComponent,
    SearchPeliculasComponent,
    FavoritoPeliculaComponent,
    DetallesPeliculasComponent,
    GestionUsuariosComponent,
    EditUsuarioDialogComponent,
  ],
})
export class PeliculasModule {}
