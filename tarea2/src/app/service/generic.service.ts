
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(
    protected http:HttpClient,
    @Inject(String) protected url:string
  ) { }

  public listar() {
    return this.http.get<T[]>(this.url);
  }

  public listarPorId(id:number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  public registrar(t:T) {
    return this.http.post(this.url, t);
  }

  public modificar(t:T) {
    return this.http.put(this.url, t);
  }

  public eliminar(id:number) {
    return this.http.delete(`${this.url}/${id}`);
  }

}
