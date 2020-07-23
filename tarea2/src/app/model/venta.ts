import { DetalleVenta } from './detalleVenta';
import { Persona } from './persona';

export class Venta {
    idVenta:number;
    fecha:string;
    importe:number;
    persona:Persona;
    detalleVenta: DetalleVenta[];
}