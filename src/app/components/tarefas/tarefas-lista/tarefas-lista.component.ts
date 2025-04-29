import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Tarefa } from '../../../models/tarefa';
import { TarefasDetalheComponent } from '../tarefas-detalhe/tarefas-detalhe.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { Router } from '@angular/router';

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
  onDrop(event: any, status: string) {
    this.atualDragTarefa.status = status
  }
  onDragOver(event: any) {
    event.preventDefault();
  }
  removerDaLista(status: string){
    const index = this.statusLista.findIndex(s => s === status)
    this.statusLista.splice(index, 1);
    console.log(this.statusLista);
  }
}
