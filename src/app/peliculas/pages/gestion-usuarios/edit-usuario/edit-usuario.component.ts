import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService } from 'src/app/services/roles.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ApiResponse } from 'src/app/shared/interfaces/api-response';
import { Rol } from 'src/app/shared/interfaces/rol';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { CLOSE, INVALID_FORM } from 'src/app/shared/messages';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.scss']
})
export class EditUsuarioDialogComponent  {

  usuarioForm!: FormGroup;  // Non-null assertion here
  roles: Rol[] = [];
  isLoading = true;  // Flag for loading roles

  constructor(
    public dialogRef: MatDialogRef<EditUsuarioDialogComponent>,
    private fb: FormBuilder,
    private servicioRoles: RolesService,
    private servicioUsuario: UsuarioService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario
  ) { }

  ngOnInit() {

    this.usuarioForm = this.fb.group({
      id_usuario: [this.usuario.id_usuario, Validators.required],
      usuario: [this.usuario.usuario, [Validators.required, Validators.email]],
      nombre_publico: [this.usuario.nombre_publico],
      habilitado: [Number(this.usuario.habilitado) === 1],
      id_rol: [this.usuario.id_rol, Validators.required],  // Aquí aseguramos que se esté inicializando con el rol correcto
      observaciones: [this.usuario.observaciones]
    });
    console.log('Formulario inicializado:', this.usuarioForm.value);
    this.getRoles();
  }


  async getRoles() {
    try {
      const RESPONSE = await this.servicioRoles.getAllRoles().toPromise();
      if (RESPONSE && RESPONSE.ok) {
        this.roles = RESPONSE.data as Rol[];
      } else {
        console.error('Failed to fetch roles:', RESPONSE?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      this.snackBar.open('Failed to load roles', CLOSE, { duration: 5000 });
    }
  }


  async confirmAdd() {
    if (this.usuarioForm.valid) {
      const usuario = this.usuarioForm.value;

      // Verifica si el id_rol es correcto
      console.log('Usuario con rol seleccionado:', usuario);

      try {
        const RESP = await this.servicioUsuario.editUsuario(usuario).toPromise();

        if (RESP && RESP.ok) {
          this.snackBar.open(RESP.message ?? 'Success', CLOSE, { duration: 5000 });
          this.dialogRef.close({ ok: RESP.ok, data: RESP.data });
        } else {
          this.snackBar.open(RESP?.message || 'Error: Response undefined', CLOSE, { duration: 5000 });
        }
      } catch (error) {
        this.snackBar.open('An error occurred while processing the request.', CLOSE, { duration: 5000 });
        console.error(error);
      }
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
    }
  }


  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }
}
