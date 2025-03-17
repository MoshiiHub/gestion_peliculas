import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { ApiResponse } from '../../../shared/interfaces/api-response';


@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe(response => {
      console.log("Usuarios obtenidos:", response.data); // 🔥 Agregar console.log
      this.usuarios = response.data;
    });
  }

  editUsuario(usuario: Usuario) {
    this.usuarioService.editUsuario(usuario).subscribe(response => this.usuarios = response.data);
  }

  deleteUsuario(usuario: Usuario) {
    this.usuarioService.deleteUsuario(usuario).subscribe()
    this.ngOnInit();
  }


}
