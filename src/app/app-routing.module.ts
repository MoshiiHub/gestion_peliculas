import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuardService } from './guards/auth.guard';
import { PeliculasListComponent } from './peliculas/pages/peliculas-list/peliculas-list.component';
import { SearchPeliculasComponent } from './peliculas/pages/search-peliculas/search-peliculas.component';



const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'peliculas-list',
    component: PeliculasListComponent,
  },
  {
    path: 'layout',
    loadChildren: () => import('./peliculas/peliculas.module').then(m => m.PeliculasModule),
  },

  {
    path: '404',
    component: Error404PageComponent
  },
  { path: 'search-peliculas', component: SearchPeliculasComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
