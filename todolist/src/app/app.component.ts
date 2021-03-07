import { Component, Inject } from '@angular/core';
import { DataService } from './data.service';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';

interface Todo {
  id?: number;
  nome?: string;
  descricao?: string;
  email?: string;
  status: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pendentes: Todo[];
  concluidos: Todo[] = [];
  senha: string;
  loading: boolean = false;

  constructor(private dataService: DataService, public dialog: MatDialog, private _snackBar: MatSnackBar) { 
  }

  ngOnInit() {
    this.senha = '';
    this.loading = false;
    this.dataService.getToDoListRequest().subscribe((data: Todo[])=>{
      this.pendentes = data.filter(p => p.status == 'PENDENTE');
      this.concluidos = data.filter(p => p.status == 'CONCLUIDO');
      //this.products = data;
    })  
    this.carregarLista();
  }

  openDialog(onOK: () => void): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '250px',
      data: { senha: this.senha, onOK }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.senha = result.senha;
      if (this.senha === "TrabalheNaSaipos") {
        onOK();
      } else {
        this._snackBar.open('Senha incorreta', 'Ok');
      }
    });
  }

  carregarLista() {
    this.pendentes = []
  }

  onClickNovo() {
    this.loading = true;
    this.dataService.getNewToDoListRequest().subscribe((data: any[])=>{
      const newData = data.map(p => (
        {
          nome: 'Eu',
          email: 'eu@me.com',
          descricao: p.text,
          status: 'PENDENTE'
        }
      ));
      this.dataService.gravarNewTarefa(newData).subscribe((data: Todo[]) => {
          this.pendentes = [...this.pendentes, ...data];
          this.loading= false;
        }, () => {
          this.loading = false;
        })
    }, (er) => {
      this.loading = false;
    })  
  }

  dropPendente(event: CdkDragDrop<Todo[]>) {
    this.senha = '';
    if (event.previousContainer !== event.container) {
      console.log(event.container.data);
      this.openDialog(() => {
        console.log(event.previousContainer.data[event.previousIndex]);
        const newPend = [...event.container.data, event.previousContainer.data[event.previousIndex]].map( t => ({ ...t, status: 'PENDENTE' }));
        console.log(newPend);
        this.dataService.gravarNewTarefa(newPend).subscribe(() => {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
        }, (err) => {
          this._snackBar.open('Quantidade de movimentação excedida.', 'Ok');
        });
      }); 
    }
  }

  dropConcluido(event: CdkDragDrop<Todo[]>) {
    if (event.previousContainer !== event.container) {
      console.log(event.previousContainer.data[event.previousIndex]);
        const newPend = [...event.container.data, event.previousContainer.data[event.previousIndex]].map( t => ({ ...t, status: 'CONCLUIDO' }));
        console.log(newPend);
        this.dataService.gravarNewTarefa(newPend).subscribe(() => {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
        }, (err) => {
          this._snackBar.open('Quantidade de movimentação excedida.', 'Ok');
        });
    }
  }

  title = 'todolist';
}


