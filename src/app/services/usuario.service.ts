import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from 'src/environments/environment';
import { ApiResponse } from '../shared/interfaces/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private endpoint = `${URL_API}/usuarios.php`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.endpoint);
  }

  crearUsuario(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.endpoint, JSON.stringify(data));
  }

  actualizarUsuario(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.endpoint, JSON.stringify(data));
  }

  eliminarUsuario(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.endpoint}?id=${id}`);
  }
}
