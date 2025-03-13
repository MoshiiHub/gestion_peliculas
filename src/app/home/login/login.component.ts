import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/shared/common.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @Output() valueChange = new EventEmitter<boolean>();

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  titulo = 'Acceso a la plataforma';
  alerta: string = '';
  showSpinner = false;
  error: string = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private snackBar = inject(MatSnackBar);
  private commonService = inject(CommonService);

  async acceder() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    try {
      const data = this.loginForm.value;
      const RESPONSE = await firstValueFrom(this.authService.doLogin(data));

      if (RESPONSE.ok && RESPONSE.data?.token) {
        // Almacena el token y otros datos en el localStorage
        localStorage.setItem('token', RESPONSE.data.token);
        localStorage.setItem('usuario', RESPONSE.data.usuario);
        localStorage.setItem('nombre_publico', RESPONSE.data.nombre_publico);
        localStorage.setItem('ultimaOpcion', RESPONSE.data.opcion);
        localStorage.setItem('ultimoGrupo', RESPONSE.data.grupo);

        // Establece el token para solicitudes futuras
        this.commonService.setAuthToken(RESPONSE.data.token);

        // Redirige al usuario a la página de películas
        // Si RESPONSE.data.accion ya está configurado correctamente, se puede usar ese valor, pero aquí forzamos la redirección a 'peliculas'
        this.router.navigate(['/peliculas']);  // Aquí rediriges directamente a las películas
      } else {
        this.manejarError(RESPONSE);
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      this.snackBar.open('Error al iniciar sesión. Intente de nuevo.', 'Cerrar', { duration: 5000 });
    }
  }

  manejarError(RESPONSE: any) {
    if (RESPONSE.data?.valido === 0) {
      this.snackBar.open('Usuario inhabilitado', 'Cerrar', { duration: 5000 });
    } else if (RESPONSE.data?.valido === 1) {
      this.snackBar.open('Usuario o contraseña incorrectos', 'Cerrar', { duration: 5000 });
    } else {
      this.snackBar.open('Error desconocido. Intente más tarde.', 'Cerrar', { duration: 5000 });
    }
  }

  forgotPassword() {
    this.valueChange.emit(true);
  }
}
