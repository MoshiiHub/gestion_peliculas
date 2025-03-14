import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeliculasListComponent } from './pages/peliculas-list/peliculas-list.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SearchPeliculasComponent } from './pages/search-peliculas/search-peliculas.component';
import { AuthGuardPublic } from '../guards/auth.guard';
// Asegúrate de importar el componente

const routes: Routes = [
  {path:'',
    component:LayoutPageComponent,
    children: [
  { path: 'peliculas-list', component: PeliculasListComponent },
  {path: 'search-peliculas', component:SearchPeliculasComponent},
  {path: '**', redirectTo: 'peliculas-list'}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeliculasRoutingModule { }
