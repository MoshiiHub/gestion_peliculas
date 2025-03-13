import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from 'src/environments/environment';
import { ApiResponse } from '../shared/interfaces/api-response';
import { CookieService } from 'ngx-cookie';
import { CommonService } from '../shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private commonService: CommonService
  ) {}

  doLogin(data: Record<string, any>) {
    return this.http.post<ApiResponse>(`${URL_API}/login.php`, JSON.stringify(data));
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
    const body = new FormData();
    body.append('user', localStorage.getItem('usuario') ?? '');

    this.cookieService.removeAll();
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
