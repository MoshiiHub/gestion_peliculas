import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { URL_API } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/common.service';
import { ApiResponse } from '../shared/interfaces/api-response';

/***********************************************
 * Impide que usuarios
 * no autenticados accedan a /pagina-principal
 **********************************************/
@Injectable({
  providedIn: 'root'
})


export class AuthGuardPublic implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,  // Inyectamos HttpClient
    private commonService: CommonService  // Inyectamos CommonService
  ) { }

  canActivate(): boolean {
    // Verificar si el usuario tiene un token en localStorage
    const token = localStorage.getItem('authToken');

    // Si no hay token (el usuario NO está autenticado)
    if (!token) {
      console.log('Usuario no autenticado, redirigiendo a /home');
      // Redirige a la página de inicio (/home) si no está autenticado
      this.router.navigate(['/home']);
      // Bloquea el acceso a la ruta protegida
      return false;
    }
 // Si el token existe (usuario autenticado), permite el acceso
    return true;
  }


  // Método que se encarga de verificar si el usuario está autenticado
  async isAuthenticated(url: string): Promise<boolean> {
    const rutaSeleccionada = url.substring(1).split('/')[0];

    try {
      const response = await this.http
        .get<ApiResponse>(`${URL_API}/check_usuarios.php?ruta=${rutaSeleccionada}`, {
          headers: this.commonService.getHeaders()  // Utilizamos el método getHeaders de CommonService
        })
        .toPromise();

      return response?.ok ?? false;  // Si la respuesta tiene 'ok' y es true, retornamos true
    } catch (error) {
      console.error('Error de autenticación:', error);
      return false;  // Si hay un error, devolvemos false
    }
  }
}


