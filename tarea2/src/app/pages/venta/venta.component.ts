import { VentaService } from './../../service/venta.service';
import { Venta } from './../../model/venta';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ProductoService } from './../../service/producto.service';
import { Producto } from './../../model/producto';
import { PersonaService } from './../../service/persona.service';
import { Observable, EMPTY } from 'rxjs';
import { DetalleVenta } from './../../model/detalleVenta';
import { Persona } from './../../model/persona';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {



  forma:FormGroup;
  personas:Persona[] = [];
  productos: Producto[] = [];
  detalleVentaArreglo : DetalleVenta[] = [];

  displayedColumns: string[] = ['producto', 'cantidad', 'acciones'];
  @ViewChild(MatTable) table: MatTable<any>;
  mensaje:string;
  productosFiltrados: Observable<Producto[]>;

  personaSeleccionada:Persona;
  productoSeleccionado:Producto;
  fechaSeleccionada: Date = new Date();
  importe:number;
  cantidad:number;

  maxFecha: Date = new Date();
  myCtrlProducto: FormControl = new FormControl();

  constructor(
    private personaService: PersonaService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.forma = new FormGroup ({
      'persona': new FormControl(),
      'fecha': new FormControl(new Date()),
      'importe': new FormControl(),
      'producto': this.myCtrlProducto,
      'cantidad': new FormControl()
    });

    this.consultarPersonas();
    this.consultarProductos();

    this.productosFiltrados = this.myCtrlProducto.valueChanges.pipe(map(valor => this.filtrarProductos(valor)));

 
  }

  public estadoBotonRegistrar(): boolean {
    return false;
  }

  public mostrarProducto(producto: Producto): string|Producto {
    return producto != null ? `${producto.nombre} ${producto.marca}` : producto;
   }

  public seleccionarProducto(e: any) {
    this.productoSeleccionado = e.option.value;
  }

  private consultarPersonas (): void{
    this.personaService.listar().subscribe (data => {
      this.personas = data;
    })
  }

  private consultarProductos():void {
    this.productoService.listar().subscribe( data => {
      this.productos = data;
    })
  }

  private filtrarProductos(productoBuscar: any){
    if (productoBuscar != null && productoBuscar.idProducto > 0) {
      return this.productos.filter( producto => 
        producto.nombre.toLowerCase().includes(productoBuscar.nombre.toLowerCase()) ||
        producto.marca.toLowerCase().includes(productoBuscar.marca.toLowerCase()));
    }
      return this.productos.filter(producto => 
        producto.nombre.toLowerCase().includes(productoBuscar?.toLowerCase()) ||
        producto.marca.toLowerCase().includes(productoBuscar?.toLowerCase()));
  }

  public agregarDetalle() {
    if (this.productoSeleccionado != null && (this.cantidad !== null || this.cantidad > 0) ) {
      let detalleVta = new DetalleVenta();
      detalleVta.producto = this.productoSeleccionado;
      detalleVta.cantidad = this.cantidad;
      this.detalleVentaArreglo.push(detalleVta);
      this.productoSeleccionado = null;
      this.myCtrlProducto.reset;
      this.productosFiltrados = null;
      this.cantidad = null;
      this.table.renderRows();
    } 
    else {
      this.mensaje = 'Debe agregar un detalle';
      this.snackBar.open(this.mensaje, "Aviso", {duration:1500});
    }
  }
  
  public eliminarDetalle (dv:DetalleVenta) {
    let index = this.detalleVentaArreglo.lastIndexOf(dv, 0);
    this.detalleVentaArreglo.splice(index, 1);
    this.table.renderRows();
  }

  public registrar():void {
    let venta: Venta = new Venta();
    venta.importe = this.importe; 
    venta.persona = this.personaSeleccionada;
    venta.fecha = moment(this.fechaSeleccionada).format("YYYY-MM-DDTHH:mm:ss");
    venta.detalleVenta = this.detalleVentaArreglo;

    this.ventaService.registrarTransaccion(venta).subscribe(data => {
      this.snackBar.open("Se registró", "Aviso", {duration:1500});
      this.limpiarControles();
    })
  }


  private limpiarControles() {
    this.importe = null;
    this.cantidad = null;
    this.mensaje = '';
    this.myCtrlProducto.reset;
    this.productoSeleccionado = null;
    this.personaSeleccionada = null;
    this.productosFiltrados = null;
    this.detalleVentaArreglo = [];
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
  }
}
