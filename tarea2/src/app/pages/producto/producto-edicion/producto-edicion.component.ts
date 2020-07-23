import { switchMap } from 'rxjs/operators';
import { Producto } from './../../../model/producto';
import { ProductoService } from './../../../service/producto.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-producto-edicion',
  templateUrl: './producto-edicion.component.html',
  styleUrls: ['./producto-edicion.component.css']
})
export class ProductoEdicionComponent implements OnInit {

  forma:FormGroup;
  id:number;
  edicion:boolean = false;
  producto:Producto;

  constructor(
    private productoService:ProductoService,
    private ruta: ActivatedRoute,
    private ruteador:Router
  ) { }

  ngOnInit(): void {
    this.producto = new Producto();

    this.forma = new FormGroup ({
      'id':new FormControl(0),
      'nombre': new FormControl(''),
      'marca': new FormControl('')
    });

    this.ruta.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = (params['id'] != null);
      this.initForm();
    });
    
  }

  private initForm():void {
    if (this.edicion) {
      this.productoService.listarPorId(this.id).subscribe(data => {
        this.forma = new FormGroup({
          'id': new FormControl(data.idProducto),
          'nombre': new FormControl(data.nombre),
          'marca': new FormControl(data.marca)
        });
      });
    }
  }

  public ejecutar():void {
    this.producto = new Producto();
    this.producto.idProducto = this.forma.value['id'];
    this.producto.nombre = this.forma.value['nombre'];
    this.producto.marca = this.forma.value['marca']

    if (this.producto != null && this.producto.idProducto > 0) {  //Modificación
      /*
        this.productoService.modificar(this.producto).pipe(switchMap(() => {
        return this.productoService.listar();
      })).subscribe(data => {
        this.productoService.setProductoCambio(data);
        this.productoService.setMensajeCambio("Se modificó");
      }); */
      let obs1 = this.productoService.modificar(this.producto);
      let obs2 = this.productoService.listar();
      forkJoin(obs1, obs2).subscribe(data => {
        this.productoService.setProductoCambio(data[1]);
        this.productoService.setMensajeCambio(`Se modificó el producto: ${this.producto.nombre}` );
      })
    } else {                                                      // Nuevo
      this.productoService.registrar(this.producto).pipe(switchMap (() => {
        return this.productoService.listar();
      })).subscribe( data => {
        this.productoService.setProductoCambio(data);
        this.productoService.setMensajeCambio("Se agregó");
      })
    }

    this.ruteador.navigate(['producto']);
  }


}
