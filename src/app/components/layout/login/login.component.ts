import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username!: string;
  senha!: string;

  rota = inject(Router)

  logar() {
    // Redirecionar para a página principal
    console.log('Login:', this.username);
    console.log('Senha:', this.senha);
    if(this.username === 'admin' && this.senha === 'admin') {
      this.rota.navigate(['/principal/tarefas']); // Redirecionar para a página de tarefas
    }
  }
}
