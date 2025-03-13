import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {


  cambiarPasswordForm!: FormGroup;
  alerta: string = '';
  showSpinner: boolean = false;
  error: string = '';
  @Output() valueChange = new EventEmitter<boolean>();

  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.cambiarPasswordForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]) // Mejor validación si es un email
    });
  }

  async recuperarPass() {
    if (this.cambiarPasswordForm.invalid) {
      this.snackBar.open('Por favor, ingrese un correo válido', 'Cerrar', { duration: 5000 });
      return;
    }

    this.showSpinner = true;
    try {
      const response = await firstValueFrom(this.authService.resetPassword(this.cambiarPasswordForm.value));
      if (response.ok) {
        this.snackBar.open('Se ha enviado un correo de recuperación de contraseña', 'Cerrar', { duration: 5000 });
        this.valueChange.emit(false);
      } else if (response.message === 'usuario inexistente') {
        this.snackBar.open('El usuario introducido no existe en nuestro sistema', 'Cerrar', { duration: 5000 });
      }
    } catch (error) {
      this.snackBar.open('Ocurrió un error al procesar la solicitud', 'Cerrar', { duration: 5000 });
      console.error(error);
    } finally {
      this.showSpinner = false;
    }
  }

  goBack() {
    this.valueChange.emit(false);
  }
}
