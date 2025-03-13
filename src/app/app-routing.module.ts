import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuardService } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
 },
 {
  path: '',
  redirectTo: '/home', // Redirigir a "home" como ruta predeterminada
  pathMatch: 'full'  // Asegura que la URL vacía redirige correctamente
},
{
  path: 'peliculas',
  loadChildren: () => import('./peliculas/peliculas.module').then(m => m.PeliculasModule),
  canActivate:[AuthGuardService]
},
  {
    path:'404',
    component: Error404PageComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
