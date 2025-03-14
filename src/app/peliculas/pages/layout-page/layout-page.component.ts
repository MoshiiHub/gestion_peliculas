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
    { label: 'Inicio', url: '/pagina-principal', icon: 'home' },
    { label: 'Buscador de peliculas', url: '/search-peliculas', icon: 'movie' },
    { label: 'Favoritos', url: '/favoritos', icon: 'favorite' },
    { label: 'Listado de peliculas', url: '/peliculas-list', icon: 'list' }
  ];

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.doLogout();
  }
  get user(): User | undefined {
    return this.authService.currentUser;
  }


}
