import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Asegúrate de importar tu servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {


  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const user = this.authService.currentUser;

    // Verificar el rol y el usuario
    console.log('Usuario actual:', user); // Aquí verificamos el objeto user
    if (user && user.id_rol === 1) {  // Si el rol es 1 (admin)
      return true; // Permitir el acceso
    } else {
      console.error('Acceso denegado: El usuario no tiene rol de admin');
      this.router.navigate(['/home']); // Redirigir a otra página si no es admin
      return false;
    }
  }
}
