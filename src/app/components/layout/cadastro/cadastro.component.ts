import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  nome!: string;
  email!: string;
  senha!: string;
  confirmarSenha!: string;

  rota = inject(Router);

  cadastrar() {
    // Lógica para cadastrar o usuário
    console.log('Nome:', this.nome);
    console.log('Email:', this.email);
    console.log('Senha:', this.senha);
    console.log('Confirmar Senha:', this.confirmarSenha);
  }
  validarSenha() {
    if (this.senha !== this.confirmarSenha) {
      alert('As senhas não coincidem!');
    } else {
      alert('Cadastro realizado com sucesso!');
    }
  }
}
