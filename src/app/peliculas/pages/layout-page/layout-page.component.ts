import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/interfaces/peliculas';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent {
  sidebarItems = [
    { label: 'Inicio', url: '/pagina-principal/inicio', icon: 'home' },
    { label: 'Buscador de peliculas', url: '/pagina-principal/search-peliculas', icon: 'movie' },
    { label: 'Favoritos', url: '/pagina-principal/favoritos', icon: 'favorite' },
    { label: 'Listado de peliculas', url: '/pagina-principal/peliculas-list', icon: 'list' },
    { label: 'Gestion de usuarios', url: '/pagina-principal/gestion-usuarios', icon: 'person' }
  ];

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.doLogout();
  }
}
