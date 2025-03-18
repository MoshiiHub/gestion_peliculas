import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RolesService } from 'src/app/services/roles.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Rol } from 'src/app/shared/interfaces/rol';
import { CLOSE, INVALID_FORM } from 'src/app/shared/messages';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss']
})
export class AddUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  roles: Rol[] = [];
  isLoading = true;

  constructor(public dialogRef: MatDialogRef<AddUsuarioComponent>,
    private fb: FormBuilder,
    private servicioRoles: RolesService,
    private servicioUsuario: UsuarioService,
    public snackBar: MatSnackBar,

  ) { }

  ngOnInit() {
    this.usuarioForm = new FormGroup({
      usuario: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      id_rol: new FormControl(null, [Validators.required]),
      habilitado: new FormControl(Number(1)),
      nombre_publico: new FormControl(null),
      observaciones: new FormControl(null)
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
      const usuario = this.usuarioForm.value as Usuario;
      try {
        const RESP = await lastValueFrom(this.servicioUsuario.addUsuario(usuario));

        if (RESP && RESP.ok) {
          this.snackBar.open(RESP.message ?? 'Usuario creado exitosamente', CLOSE, { duration: 5000 });
          this.dialogRef.close({ ok: true, data: RESP.data }); // Devuelve el usuario creado
        } else {
          this.snackBar.open(RESP?.message || 'Error en la respuesta del servidor', CLOSE, { duration: 5000 });
        }
      } catch (error) {
        this.snackBar.open('Ocurrió un error al crear el usuario.', CLOSE, { duration: 5000 });
        console.error(error);
      }
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ok: false});
  }

}
