import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.doLogout();
  }

  sidebarItems = [
    { label: 'Buscador de peliculas', url: '/search-peliculas', icon: 'movie' },
    { label: 'Favoritos', url: '/favoritos', icon: 'favorite' }
  ];
}
