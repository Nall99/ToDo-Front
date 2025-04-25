export class Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    criadoEm: Date;
    atualizadoEm: Date;
    status: string;
    
    constructor(id: number, titulo: string, descricao: string, criadoEm: Date, atualizadoEm: Date, status: string) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        this.status = status;
    }
}

