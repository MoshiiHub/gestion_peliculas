import { CanActivateFn, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = this.authService.currentUser;
    if (user && user.id_rol === 1) { // Asumiendo que id_rol = 1 es admin
      return true;
    } else {
      this.router.navigate(['/pagina-principal/inicio']);
      return false;
    }
  }
}
