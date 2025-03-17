import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from 'src/environments/environment';
import { ApiResponse } from '../shared/interfaces/api-response';
import { CookieService} from 'ngx-cookie-service';
import { CommonService } from '../shared/common.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../shared/interfaces/peliculas';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private user?: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private commonService: CommonService
  ) {}

  get currentUser(): User | undefined {
    return this.user ? structuredClone(this.user) : undefined;
  }


  doLogin(data: Record<string, any>) {
    return this.http.post<ApiResponse>(`${URL_API}/login.php`, JSON.stringify(data)).pipe(
      tap(response => {
        if (response?.ok && response?.data?.token) {
          localStorage.setItem('authToken', response?.data?.token);
          localStorage.setItem('usuario', response?.data?.usuario);

          const destino = '/pagina-principal/inicio';
          console.log(`✅ Redirigiendo a: ${destino}`);

          this.router.navigate([destino]);

        } else {
          console.error('❌ Error en el login: Respuesta no válida');
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
      console.warn('No hay usuario en localStorage, pero igual limpiamos sesión.');
      this.cookieService.deleteAll();
      localStorage.clear();
      this.router.navigate(['/home']);
      return;
    }

    this.http.post(`${URL_API}/logout.php`, { user: usuario }).subscribe(
      () => {
        this.cookieService.deleteAll();
        localStorage.clear();
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error al cerrar sesión:', error);
        this.router.navigate(['/home']);
      }
    );
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
