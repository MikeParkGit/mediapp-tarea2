import { Subject, Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { GenericService } from './generic.service';
import { Producto } from './../model/producto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto> {

  private productoCambio:Subject<Producto[]> = new Subject<Producto[]>();
  private mensajeCambio:Subject<string> = new Subject<string>();


  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/productos`);
   }

   public getProductoCambio(): Observable<Producto[]> {
     return this.productoCambio.asObservable();
   }

   public getMensajeCambio(): Observable<string> {
     return this.mensajeCambio.asObservable();
   }

   public setProductoCambio(productos: Producto[]):void {
     this.productoCambio.next(productos);
   }

   public setMensajeCambio(mensaje:string) {
    this.mensajeCambio.next(mensaje);
   }

}
