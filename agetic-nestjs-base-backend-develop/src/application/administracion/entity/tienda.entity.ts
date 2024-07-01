import { Cliente } from './cliente.entity'
import { Categoria } from '../../inventario/entity/'
import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { TiendaEstado } from '../constant'
import { Carrito, Venta } from '@/application/pedido/entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(TiendaEstado))
@Entity({ name: 'tiendas', schema: process.env.DB_SCHEMA_ADMINISTRACION })
export class Tienda extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Tienda',
  })
  id: string

  @Column({ length: 50, type: 'varchar', comment: 'Nombre de tienda' })
  direccion: string

  @Column({ length: 255, type: 'varchar', comment: 'Descripción de tienda' })
  descripcion: string

  @OneToMany(() => Cliente, (cliente) => cliente.tienda)
  cliente: Cliente

  @OneToMany(() => Categoria, (categoria) => categoria.tienda)
  categoria: Categoria

  @OneToMany(() => Carrito, (carrito) => carrito.tienda)
  carrito: Carrito

  @OneToMany(() => Venta, (venta) => venta.tienda)
  venta: Venta

  constructor(data?: Partial<Tienda>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || TiendaEstado.ACTIVO
  }
}
