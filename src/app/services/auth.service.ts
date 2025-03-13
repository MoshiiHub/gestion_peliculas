import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from 'src/environments/environment';
import { ApiResponse } from '../shared/interfaces/api-response';
import { CookieService} from 'ngx-cookie-service';
import { CommonService } from '../shared/common.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private commonService: CommonService
  ) {}

  doLogin(data: Record<string, any>) {
    return this.http.post<ApiResponse>(`${URL_API}/login.php`, JSON.stringify(data)).pipe(
      tap(response => {
        if (response?.ok) {
          console.log('Usuario:', response?.data?.usuario); // Depuración

          // Verifica que el token existe y se guarda correctamente
          if (response?.data?.token) {
            localStorage.setItem('authToken', response?.data?.token);
            localStorage.setItem('usuario', response?.data?.usuario);


            // Redirigir a 'peliculas-list' después del login
            this.router.navigate(['/layout']).then(() => {
              console.log('Redirigiendo a peliculas-list');
            });
          }
        }
      })
    );
  }

  async isAuthenticated(url: string): Promise<boolean> {
    const rutaSeleccionada = url.substring(1).split('/')[0];

    try {
      const response = await this.http
        .get<ApiResponse>(`${URL_API}/check_usuarios.php?ruta=${rutaSeleccionada}`, {
          headers: this.commonService.getHeaders()
        })
        .toPromise();
      return response?.ok ?? false;
    } catch (error) {
      return false;
    }
  }
  doLogout() {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      console.error('No hay usuario en el localStorage');
      return; // Salir sin intentar hacer logout si no hay usuario
    }

    const body = new FormData();
    body.append('user', usuario);
    this.cookieService.deleteAll();
    localStorage.clear();
    return this.http.post(`${URL_API}/logout.php`, body);
  }

  resetPassword(formularioCorreo: Record<string, any>) {
    return this.http.post<ApiResponse>(
      `${URL_API}/olvidar_pwd.php`,
      JSON.stringify(formularioCorreo),
      { headers: this.commonService.getHeaders() }
    );
  }

  checkPassToken(tokenPasswd: string) {
    return this.http.post<ApiResponse>(
      `${URL_API}/check_token_passwd.php`,
      JSON.stringify({ token: tokenPasswd })
    );
  }

  generateNewPass(data: Record<string, any>) {
    return this.http.put<ApiResponse>(
      `${URL_API}/reset_pass.php`,
      JSON.stringify(data)
    );
  }
}
