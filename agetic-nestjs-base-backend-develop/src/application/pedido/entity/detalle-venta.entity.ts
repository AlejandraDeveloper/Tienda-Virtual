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
import { DetalleVentaEstado } from '../constant'
import { Producto } from '@/application/inventario/entity'
import { Venta } from './venta.entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(DetalleVentaEstado))
@Entity({ name: 'detalleventas', schema: process.env.DB_SCHEMA_PEDIDOS })
export class DetalleVenta extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla detalle venta',
  })
  id: string

  @Column({
    name: 'codigo',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla de producto',
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
    name: 'id_venta',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla venta',
  })
  idVenta: string

  @ManyToOne(() => Producto, (producto) => producto.detalleVenta)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto

  @ManyToOne(() => Venta, (venta) => venta.detalleVenta)
  @JoinColumn({ name: 'id_venta', referencedColumnName: 'id' })
  venta: Venta

  constructor(data?: Partial<DetalleVenta>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || DetalleVentaEstado.ACTIVO
  }
}
