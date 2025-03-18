import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { ApiResponse } from '../../../shared/interfaces/api-response';
import { EditUsuarioDialogComponent } from './edit-usuario/edit-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';


@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent {
  usuarios: Usuario[] = [];
  usuarioLogueado: any;


  // 1 admin 2 usuario

  idGuardado = localStorage.getItem('id_rol');

  constructor(private usuarioService: UsuarioService
    , public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe(response => {
      console.log("Usuarios obtenidos:", response.data);
      this.usuarios = response.data;
    });
    this.usuarioService.getAllUsuarios().subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });
  }

  openEditDialog(usuario: Usuario) {
    const dialogRef = this.dialog.open(EditUsuarioDialogComponent, {
      width: '400px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.ok) {
        this.ngOnInit(); // Reload the users list if a user was edited successfully
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddUsuarioComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.ok) {
        this.ngOnInit(); // Recargar la lista de usuarios si se agrega uno nuevo
      }
    });
  }


  deleteUsuario(usuario: Usuario) {
    this.usuarioService.deleteUsuario(usuario).subscribe()
    this.ngOnInit();
  }


}
