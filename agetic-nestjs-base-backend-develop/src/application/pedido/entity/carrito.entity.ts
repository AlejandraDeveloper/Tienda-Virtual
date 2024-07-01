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
import { CarritoEstado } from '../constant'
import { DetalleCarrito } from './detalle-carrito.entity'
import { Cliente } from '@/application/administracion/entity'
import { Tienda } from '@/application/administracion/entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(CarritoEstado))
@Entity({ name: 'carritos', schema: process.env.DB_SCHEMA_PEDIDOS })
export class Carrito extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Carrito',
  })
  id: string

  @Column({
    length: 15,
    type: 'varchar',
    unique: true,
    comment: 'Código de carrito',
  })
  codigo: string

  @Column({
    name: 'id_cliente',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla cliente',
  })
  idCliente: string

  @Column({
    name: 'id_tienda',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla tienda',
  })
  idTienda: string

  @OneToMany(() => DetalleCarrito, (detalleCarrito) => detalleCarrito.carrito)
  detalleCarrito: DetalleCarrito[]

  @ManyToOne(() => Tienda, (tienda) => tienda.carrito)
  @JoinColumn({ name: 'id_tienda', referencedColumnName: 'id' })
  tienda: Tienda

  @ManyToOne(() => Cliente, (cliente) => cliente.carrito)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente: Cliente

  constructor(data?: Partial<Carrito>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || CarritoEstado.ACTIVO
  }
}
