import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Venta } from './../model/venta';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends GenericService<Venta> {

  constructor(http: HttpClient) {
    super(http, `${environment.HOST}/ventas`);
   }

  public registrarTransaccion (venta: Venta): Observable<Object> {
    return this.http.post(this.url, venta);
  }
}
