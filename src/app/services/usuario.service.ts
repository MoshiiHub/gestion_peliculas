import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from 'src/environments/environment';
import { ApiResponse } from '../shared/interfaces/api-response';
import { Observable } from 'rxjs';
import { Usuario } from '../shared/interfaces/usuario';
import { CommonService } from '../shared/common.service';

const ENDPOINT = 'usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarios: Usuario[] = [];

  constructor(private http: HttpClient, private commonService: CommonService) {
  }

  getUsuarios() : Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${URL_API}/${ENDPOINT}.php`);
    }

  getAllUsuarios() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.getHeaders() });
  }

  addUsuario(usuario: Usuario) {
    const body = JSON.stringify(usuario);
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, {headers: this.commonService.getHeaders()});
  }

  editUsuario(usuario: Usuario, route?: string) {
    const body = JSON.stringify(usuario);

    if (route) {
      route = `?route=${route}`;
    } else {
      route = '';
    }

    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php${route}`, body, { headers: this.commonService.getHeaders() });
  }

  deleteUsuario(usuario: Usuario) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${usuario.id_usuario}`, { headers: this.commonService.getHeaders() });
  }

  removeUsuario(idUser: number) {
    this.usuarios = this.usuarios.filter(usuario => {
      return Number(usuario.id_usuario) !== Number(idUser);
    });
  }

  updateUsuario(usuario: Usuario) {
    let index = null;
    this.usuarios.filter((usuarioFilter, indexFilter) => {
      if (usuario.id_usuario === usuarioFilter.id_usuario) {
        index = indexFilter;
      }
    });

    if (index) {
      this.usuarios[index] = usuario;
    }
  }

}
