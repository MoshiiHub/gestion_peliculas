import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  @Input() tokenPasswd: string = '';
  @Output() valueChanges = new EventEmitter<boolean>();

  resetPasswordForm!: FormGroup;
  resetPass: boolean = false;
  checkTokenPasswd: boolean = false;
  showSpinner: boolean = false;
  iconoPass: string = 'visibility_off';
  hidePassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.resetPasswordForm = new FormGroup(
      {
        token_pwd: new FormControl(this.tokenPasswd, [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirm_password: new FormControl('', [Validators.required])
      },
      { validators: this.contrasenaMatchValidator }
    );
  }

  contrasenaMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm_password')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async generateNewPass() {
    if (this.resetPasswordForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 5000 });
      return;
    }

    this.showSpinner = true;
    try {
      const data = this.resetPasswordForm.value;
      const response = await firstValueFrom(this.authService.generateNewPass(data));

      if (response.ok) {
        this.snackBar.open('Se ha cambiado la contraseña con éxito', 'Cerrar', { duration: 5000 });
        this.valueChanges.emit(false);
      } else {
        this.snackBar.open('No se ha podido cambiar la contraseña', 'Cerrar', { duration: 5000 });
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      this.snackBar.open('Ocurrió un error. Inténtelo de nuevo.', 'Cerrar', { duration: 5000 });
    } finally {
      this.showSpinner = false;
    }
  }
}
