import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  tokenPasswd: string = '';
  formularioRecuperacion = false;
  formularioReseteo = false;
  checkTokenPasswd = false;

  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.tokenPasswd = params['token'] || '';

      if (this.tokenPasswd) {
        this.formularioReseteo = true;
        this.checkPassToken(this.tokenPasswd);
      }
    });
  }

  forgotPassword(event: boolean) {
    this.formularioRecuperacion = event;
  }

  resetPass(event: boolean) {
    this.formularioReseteo = event;
  }

  async checkPassToken(tokenPasswd: string) {
    try {
      const data = await firstValueFrom(this.authService.checkPassToken(tokenPasswd));
      this.checkTokenPasswd = data.ok;
    } catch (error) {
      console.error('Error verificando el token:', error);
      this.checkTokenPasswd = false;
    }
  }
}
