import { PersonaDialogoComponent } from './persona-dialogo/persona-dialogo.component';
import { PersonaService } from './../../service/persona.service';
import { Persona } from './../../model/persona';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  dataSource: MatTableDataSource<Persona>;
  displayedColumns: string[] = ['idPersona', 'nombres', 'apellidos', 'acciones'];
  
  @ViewChild(MatSort) ordenador:MatSort;

  constructor(
    private service: PersonaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {

    this.service.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordenador;
    })

    this.service.getPersonaCambioSubject().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordenador;
    })
    this.service.getMensajeCambioSubject().subscribe(data => {
      this.snackBar.open(data, 'Aviso', {duration:1500});
    })

  }

  public abrirDialogo(persona?:Persona):void {
    let personaAux = (persona != null)? persona: new Persona();
    this.dialog.open(PersonaDialogoComponent, {width:'250px', data:personaAux});
  }

  public eliminar (persona:Persona):void {
    this.service.eliminar(persona.idPersona).pipe(switchMap ( () => {
      return this.service.listar();
    })).subscribe( data => {
        this.service.setPersonaCambioSubject(data);
        this.service.setMensajeCambioSubject('Se eliminó el registro');
    })
      
  }
}
