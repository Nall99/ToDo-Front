import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Login } from '../../../auth/login';
import { LoginService } from '../../../auth/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  login: Login = new Login();

  loginService = inject(LoginService);

  rota = inject(Router)

  constructor() {
    this.loginService.removerToken();
  }

  logar() {
    // Redirecionar para a página principal
    this.loginService.logar(this.login).subscribe({
      next: (token) => {
        if (token) {
          this.loginService.addToken(token);
          if (this.loginService.hasPermission("ADMIN")){
            this.rota.navigate(['/principal/tarefas']);
          }
      }else{
        alert('Usuário ou senha inválidos');
      }
    },
    error: (error) => {
      alert('Deu erro meu fi');
    }
  })
  }
}
