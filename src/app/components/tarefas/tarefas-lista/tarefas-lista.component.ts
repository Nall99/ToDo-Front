import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Tarefa } from '../../../models/tarefa';
import { TarefasDetalheComponent } from '../tarefas-detalhe/tarefas-detalhe.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarefas-lista',
  standalone: true,
  imports: [TarefasDetalheComponent, MdbModalModule],
  templateUrl: './tarefas-lista.component.html',
  styleUrl: './tarefas-lista.component.scss'
})
export class TarefasListaComponent {
  lista: Tarefa[] = [] 
  tarefaEdit: Tarefa = new Tarefa(0, '', '', new Date(), new Date(), '');

  modalService = inject(MdbModalService);
  @ViewChild('modalTarefaDetalhe') modalTarefaDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  
  constructor() { 
    this.lista = [
      new Tarefa(1, 'Tarefa 1', 'Descrição da tarefa 1', new Date(), new Date(), 'Pendente'),
      new Tarefa(2, 'Tarefa 2', 'Descrição da tarefa 2', new Date(), new Date(), 'Concluída'),
      new Tarefa(3, 'Tarefa 3', 'Descrição da tarefa 3', new Date(), new Date(), 'Pendente')
    ];
    let tarefaNova = history.state.tarefaNova;
    let tarefaEditada = history.state.tarefaEditada;

    if (tarefaNova) {
      this.lista.push(tarefaNova);
    }else if (tarefaEditada) {
      let index = this.lista.findIndex(t => t.id == tarefaEditada.id);
      if (index > 0) {
        this.lista[index] = tarefaEditada;
      }
    }
  }

  adicionarTarefa() {
    this.tarefaEdit = new Tarefa(0, '', '', new Date(), new Date(), '');
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
    if (index > 0) {
      this.lista[index] = tarefa;
    }
    else {
      tarefa.id = this.lista.length + 1;
      this.lista.push(tarefa);
    }
    this.modalRef.close();
  }
}
