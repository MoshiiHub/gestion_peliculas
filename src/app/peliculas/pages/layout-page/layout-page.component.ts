import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent {

  userRole =localStorage.getItem('id_rol');
  userName=localStorage.getItem('nombre_publico');

  sidebarItems = [
    { label: 'Inicio', url: '/pagina-principal/inicio', icon: 'home' },
    { label: 'Buscador de peliculas', url: '/pagina-principal/search-peliculas', icon: 'movie' },
    { label: 'Favoritos', url: '/pagina-principal/favoritos', icon: 'favorite' },
    { label: 'Listado de peliculas', url: '/pagina-principal/peliculas-list', icon: 'list' }
  ];

  constructor(private authService: AuthService) {
    // Si el usuario es admin (id_rol = '1'), agregamos la opción de gestión de usuarios
    if (this.userRole === '1') {
      this.sidebarItems.push({ label: 'Gestión de usuarios', url: '/pagina-principal/gestion-usuarios', icon: 'person' });
    }
  }

  logout() {
    this.authService.doLogout();
  }
}
