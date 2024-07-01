import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { VentaEstado } from '../constant'
import { DetalleVenta } from '@/application/pedido/entity'
import { Tienda, Cliente } from '@/application/administracion/entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(VentaEstado))
@Entity({ name: 'ventas', schema: process.env.DB_SCHEMA_PEDIDOS })
export class Venta extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Venta',
  })
  id: string

  @Column({
    type: 'bigint',
    unique: true,
    comment: 'Código de Venta',
  })
  codigo: string

  @Column({
    type: 'bigint',
    unique: true,
    comment: 'Importe total de la Venta',
  })
  importe: number

  @Column({
    name: 'id_tienda',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla usuarios',
  })
  idTienda: string

  @Column({
    name: 'id_cliente',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla usuarios',
  })
  idCliente: string

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta)
  detalleVenta: DetalleVenta[]

  @ManyToOne(() => Tienda, (tienda) => tienda.venta)
  @JoinColumn({ name: 'id_tienda', referencedColumnName: 'id' })
  tienda: Tienda

  @ManyToOne(() => Cliente, (cliente) => cliente.venta)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente: Cliente

  constructor(data?: Partial<Venta>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || VentaEstado.ACTIVO
  }
}
