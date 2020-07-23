import { switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from './../../model/producto';
import { ProductoService } from './../../service/producto.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  dataSource: MatTableDataSource<Producto>;
  displayedColumns: string[] = ['id', 'nombre', 'marca', 'acciones'];
  @ViewChild(MatSort) ordena: MatSort;

  constructor(
    public ruta:ActivatedRoute,
    private productoService:ProductoService,
    private snackBar:MatSnackBar
  ) { }

  ngOnInit(): void {

      this.productoService.listar().subscribe( data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.ordena;
      });

      this.productoService.getProductoCambio().subscribe( data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.ordena;
      })

      this.productoService.getMensajeCambio().subscribe(data => {
        this.snackBar.open(data, 'Aviso', {duration:1500});
      })

  }

  public eliminar(producto: Producto) {
      this.productoService.eliminar(producto.idProducto).pipe(switchMap( () => {
      return this.productoService.listar();
    })).subscribe( data => {
      this.productoService.setProductoCambio(data);
      this.productoService.setMensajeCambio(`Se elimino producto: ${producto.nombre}`);
    });
   }
}
