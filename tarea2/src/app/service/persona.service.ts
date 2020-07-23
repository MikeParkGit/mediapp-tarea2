import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Persona } from './../model/persona';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends GenericService<Persona> {

  private personaCambio = new Subject <Persona[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/personas`)
  }

  public getPersonaCambioSubject(): Observable<Persona[]>{
    return this.personaCambio.asObservable();
  }

  public getMensajeCambioSubject(): Observable<string> {
    return this.mensajeCambio.asObservable();
  }

  public setPersonaCambioSubject(medico: Persona[]):void {
    this.personaCambio.next(medico);
  }
  
  public setMensajeCambioSubject(mensaje :string):void {
    this.mensajeCambio.next(mensaje);
  }

}
