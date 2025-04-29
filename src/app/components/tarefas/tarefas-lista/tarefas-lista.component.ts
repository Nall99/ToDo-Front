import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Tarefa } from '../../../models/tarefa';
import { TarefasDetalheComponent } from '../tarefas-detalhe/tarefas-detalhe.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tarefas-lista',
  standalone: true,
  imports: [TarefasDetalheComponent, MdbModalModule, MdbDropdownModule],
  templateUrl: './tarefas-lista.component.html',
  styleUrl: './tarefas-lista.component.scss'
})
export class TarefasListaComponent {
  lista: Tarefa[] = [] 
  statusLista: string[] = ['A fazer', 'Fazendo', 'Concluído'];
  tarefaEdit: Tarefa = new Tarefa(0, '', '', new Date(), new Date(), '');

  atualDragTarefa!: Tarefa;
  statusPag!: string; 

  // Variáveis para drag and drop
  atualStatus: string | null = null;
  posicaoSombra: number | null = null;

  routter = inject(Router);
  modalService = inject(MdbModalService);
  @ViewChild('modalTarefaDetalhe') modalTarefaDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  
  constructor(public router: Router) { 
    
    let tarefaNova = history.state.tarefaNova;
    let tarefaEditada = history.state.tarefaEditada;


    if (tarefaNova != null) {
      this.lista.push(tarefaNova);
    }
    if (tarefaEditada != null) {
      let index = this.lista.findIndex(t => t.id == tarefaEditada.id);
      if (index > 0) {
        this.lista[index] = tarefaEditada;
      }
    }

    this.lista = [
      new Tarefa(1, 'Tarefa 1', 'Descrição da tarefa 1', new Date(), null, 'A fazer'),
      new Tarefa(2, 'Tarefa 2', 'Descrição da tarefa 2', new Date(), null, 'Fazendo'),
      new Tarefa(3, 'Tarefa 3', 'Descrição da tarefa 3', new Date(), null, 'Concluído')
    ];

    if (router.url.includes('tarefas/a-fazer')) {
      this.statusPag = 'A fazer';
    }
    else if (router.url.includes('tarefas/fazendo')) {
      this.statusPag = 'Fazendo';
    }
    else if (router.url.includes('tarefas/concluido')) {
      this.statusPag = 'Concluído';
    }else {
      this.statusPag = 'tarefas';
    }
  }

  adicionarTarefa(status: string) {
    this.tarefaEdit = new Tarefa(0, '', '', new Date(), null, status);
    this.modalRef = this.modalService.open(this.modalTarefaDetalhe);
  }
  editar(tarefa: Tarefa) {
    this.tarefaEdit = Object.assign({}, tarefa);
    this.modalRef = this.modalService.open(this.modalTarefaDetalhe);
  }
  excluir(tarefa: Tarefa) {
    Swal.fire({
      title: 'Você tem certeza?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.lista.findIndex(t => t.id === tarefa.id);
        if (index !== -1) {
          this.lista.splice(index, 1);
          Swal.fire({
            title: 'Excluído!',
            text: 'A tarefa foi excluída com sucesso.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  }
  retornoDetalhe(tarefa: Tarefa) {
    let index = this.lista.findIndex(t => t.id == tarefa.id);
    console.log(index);
    if (index >= 0) {
      tarefa.atualizadoEm = new Date();
      this.lista[index] = tarefa;
    }
    else {
      tarefa.id = this.lista.length + 1;
      this.lista.push(tarefa);
    }
    this.modalRef.close();
  }
  onDragStart(tarefa: Tarefa) {
    this.atualDragTarefa = tarefa;
  }
  onDragOver(event: DragEvent, status: string) {
    event.preventDefault();
    this.atualStatus = status;
    this.posicaoSombra = null;
  }
  onDragLeave(status: string) {
      if (this.atualStatus === status) {
          this.atualStatus = null;
          this.posicaoSombra = null;
      }
  }
  onDrop(event: DragEvent, status: string) {
      event.preventDefault();
      this.atualStatus = null;
      this.posicaoSombra = null;
      const index = this.lista.findIndex(t => t.id === this.atualDragTarefa.id);
      if (index !== -1) {
          this.lista[index].status = status;
          this.atualDragTarefa.status = status;
          const tarefa = this.lista.splice(index, 1)[0];
          this.lista.push(tarefa);
      }
  }
  formatarData(data: Date): string {
      if (data == null) {
        return '---';
      }
      return formatDate(data, 'dd/MM/yyyy HH:mm', 'en-US');
    }
}
