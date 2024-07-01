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
import { ClienteEstado } from '../constant'
import { Tienda } from './tienda.entity'
import { Carrito, Venta } from '@/application/pedido/entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(ClienteEstado))
@Entity({ name: 'clientes', schema: process.env.DB_SCHEMA_ADMINISTRACION })
export class Cliente extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Cliente',
  })
  id: string

  @Column({
    length: 15,
    type: 'varchar',
    unique: true,
    comment: 'Código de cliente',
  })
  codigo: string

  @Column({
    type: 'bigint',
    name: 'id_tienda',
    comment: 'Clave foranea para Tienda',
  })
  idTienda: string

  @OneToMany(() => Carrito, (carrito) => carrito.cliente)
  carrito: Carrito

  @OneToMany(() => Venta, (venta) => venta.cliente)
  venta: Venta

  @ManyToOne(() => Tienda, (tienda) => tienda.cliente)
  @JoinColumn({
    name: 'id_tienda',
    referencedColumnName: 'id',
  })
  tienda: Tienda

  constructor(data?: Partial<Cliente>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || ClienteEstado.ACTIVO
  }
}
