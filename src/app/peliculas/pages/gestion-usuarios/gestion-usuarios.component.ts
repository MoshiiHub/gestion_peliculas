import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { ApiResponse } from '../../../shared/interfaces/api-response';
import { EditUsuarioDialogComponent } from './edit-usuario/edit-usuario.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent {
  usuarios: Usuario[] = [];


  constructor(private usuarioService: UsuarioService
    , public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe(response => {
      console.log("Usuarios obtenidos:", response.data);
      this.usuarios = response.data;
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


  deleteUsuario(usuario: Usuario) {
    this.usuarioService.deleteUsuario(usuario).subscribe()
    this.ngOnInit();
  }


}
