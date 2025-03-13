import { Component, signal, DestroyRef, inject } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gestion_peliculas';

  rutaRelativa = signal<string>('');
  isDisplayNavbar = signal<boolean>(false);
  private destroyRef = inject(DestroyRef); // Requerido para takeUntilDestroyed

  constructor(private authService: AuthService, private router: Router) {
    this.canDisplayNavbar();
  }

  private canDisplayNavbar() {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationStart => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationStart) => {
        this.rutaRelativa.set(event.url);

        this.authService.isAuthenticated(event.url)
          .then(isAuthenticated => {
            this.isDisplayNavbar.set(isAuthenticated);
          })
          .catch(error => {
            console.error('Error al verificar autenticación:', error);
            this.isDisplayNavbar.set(false);
          });
      });
  }
}
