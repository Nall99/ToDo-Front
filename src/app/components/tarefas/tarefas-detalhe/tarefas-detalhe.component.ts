import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Tarefa } from '../../../models/tarefa';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tarefas-detalhe',
  standalone: true,
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './tarefas-detalhe.component.html',
  styleUrl: './tarefas-detalhe.component.scss'
})
export class TarefasDetalheComponent {
  @Input() tarefa: Tarefa = new Tarefa(0, '', '', new Date(), null, '');
  @Output() retorno = new EventEmitter<any>();

  router = inject(ActivatedRoute);
  router2 = inject(Router)

  constructor() {
    let id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.buscarPorID(id);
    }
  }
  buscarPorID(id: number){
    let tarefaRetornada: Tarefa = new Tarefa(3, 'teste', 'testando o teste', new Date(), new Date(), ''); 
    this.tarefa = tarefaRetornada;
  }

  salvar() {
    if(this.tarefa.id > 0){
      Swal.fire({
        title: 'Sucesso!',
        text: 'A tarefa foi editada com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      let rota!: string;
      if (this.router2.url.includes('tarefas/a-fazer')) {
        rota = 'principal/tarefas/a-fazer';
      }else if (this.router2.url.includes('tarefas/fazendo')) {
        rota = 'principal/tarefas/fazendo';
      }else if (this.router2.url.includes('tarefas/concluido')) {
        rota = 'principal/tarefas/concluido';
      }
      this.router2.navigate([rota], {state: {tarefaEditada: this.tarefa}});
    }else{
      Swal.fire({
        title: 'Sucesso!',
        text: 'A tarefa foi criada com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      let rota!: string;
      if (this.router2.url.includes('tarefas/a-fazer')) {
        rota = 'principal/tarefas/a-fazer';
      }else if (this.router2.url.includes('tarefas/fazendo')) {
        rota = 'principal/tarefas/fazendo';
      }else if (this.router2.url.includes('tarefas/concluido')) {
        rota = 'principal/tarefas/concluido';
      }
      this.router2.navigate([rota], {state: {tarefaNova: this.tarefa}});
    }
    this.retorno.emit(this.tarefa)
  }

  formatarData(data: Date): string {
    if (data == null) {
      return '---';
    }
    return formatDate(data, 'dd/MM/yyyy HH:mm', 'en-US');
  }
}
