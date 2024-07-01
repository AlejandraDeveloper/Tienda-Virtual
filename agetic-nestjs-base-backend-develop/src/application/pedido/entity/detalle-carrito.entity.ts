import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { DetalleCarritoEstado } from '../constant'
import { Carrito } from './carrito.entity'
import { Producto } from '@/application/inventario/entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(DetalleCarritoEstado))
@Entity({ name: 'detalles_carritos', schema: process.env.DB_SCHEMA_PEDIDOS })
export class DetalleCarrito extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla detalle carrito',
  })
  id: string
  @Column({
    type: 'bigint',
    name: 'codigo',
    comment: 'codigo detalle carrito',
  })
  codigo: string

  @Column({
    name: 'id_producto',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla de producto',
  })
  idProducto: string

  @Column({
    name: 'id_carrito',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla carrito',
  })
  idCarrito: string

  @ManyToOne(() => Producto, (producto) => producto.detalleCarrito)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto

  @ManyToOne(() => Carrito, (carrito) => carrito.detalleCarrito)
  @JoinColumn({ name: 'id_carrito', referencedColumnName: 'id' })
  carrito: Carrito

  constructor(data?: Partial<DetalleCarrito>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || DetalleCarritoEstado.ACTIVO
  }
}
