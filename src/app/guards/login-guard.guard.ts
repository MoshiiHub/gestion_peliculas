import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/*************************************************
 * Impide que usuarios autenticados vayan a /home
 *************************************************/
export class LoginGuardService implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Obtiene el token de localStorage
    const token = localStorage.getItem('authToken');

      // Si el token existe (el usuario está autenticado)
    if (token) {
      console.log('Usuario autenticado, redirigiendo a /pagina-principal');
       // Redirigir al usuario a /pagina-principal si está autenticado
      this.router.navigate(['/pagina-principal']); // Evita el acceso a /home si ya está autenticado
      return false;
    }

    return true;
  }
}
