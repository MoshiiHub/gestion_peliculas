import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');

    if (token) {
      console.log('Usuario autenticado, redirigiendo a /pagina-principal');
      this.router.navigate(['/pagina-principal']); // Evita el acceso a /home si ya está autenticado
      return false;
    }

    return true;
  }
}
