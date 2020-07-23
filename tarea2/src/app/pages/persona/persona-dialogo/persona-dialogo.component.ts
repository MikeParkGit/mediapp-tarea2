import { switchMap } from 'rxjs/operators';
import { PersonaService } from './../../../service/persona.service';
import { Persona } from './../../../model/persona';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-persona-dialogo',
  templateUrl: './persona-dialogo.component.html',
  styleUrls: ['./persona-dialogo.component.css']
})
export class PersonaDialogoComponent implements OnInit {

  persona: Persona;
  constructor(
    @Inject(MAT_DIALOG_DATA) private personaIn:Persona,
    private dialogRef:MatDialogRef<PersonaDialogoComponent>,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {
    this.persona = new Persona();
    this.persona.idPersona = this.personaIn.idPersona;
    this.persona.nombres = this.personaIn.nombres;
    this.persona.apellidos = this.personaIn.apellidos;
    console.log(`Persona: ${this.persona.nombres} | ${this.persona.apellidos}`);
  }

  public ejecutar():void {
    if (this.persona != null && this.persona.idPersona > 0) {    //Modificar
      this.personaService.modificar(this.persona).pipe(switchMap( () => {
        return this.personaService.listar();
      })).subscribe(data => {
        this.personaService.setPersonaCambioSubject(data);
        this.personaService.setMensajeCambioSubject('Se modificó');
      })

  } else {                                                      //Insertar
    this.personaService.registrar(this.persona).pipe(switchMap( () => {
      return this.personaService.listar();
    })).subscribe(data => {
      this.personaService.setPersonaCambioSubject(data);
      this.personaService.setMensajeCambioSubject('Se registró');
    })
  }
  this.cancelar();
  }

 public cancelar():void {
    this.dialogRef.close();
  }

}
