import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { URL_API } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/common.service';
import { ApiResponse } from '../shared/interfaces/api-response';


@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,  // Inyectamos HttpClient
    private commonService: CommonService  // Inyectamos CommonService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Si no hay token, redirige a la página de login
      this.router.navigate(['/home']);
      return false;
    }

    const rutaSeleccionada = state.url.substring(1).split('/')[0];
    try {
      const response = await this.auth.isAuthenticated(state.url);
      if (!response) {
        this.router.navigate(['/home']);  // Redirige si no está autenticado
      }
      return response;
    } catch (error) {
      console.error('Error de autenticación:', error);
      this.router.navigate(['/home']);  // Redirige si hay un error
      return false;
    }
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


