import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ProductoCategoria } from './producto-categoria.entity'
import { DetalleVenta } from '@/application/pedido/entity'
import { DetalleCarrito } from '@/application/pedido/entity'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { ProductoEstado } from '../constant'

dotenv.config()

@Check(UtilService.buildStatusCheck(ProductoEstado))
@Entity({ name: 'productos', schema: process.env.DB_SCHEMA_INVENTARIOS })
export class Producto extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla producto',
  })
  id: string

  @Column({
    length: 15,
    type: 'varchar',
    unique: true,
    comment: 'Código de producto',
  })
  codigo: string

  @Column({ length: 50, type: 'varchar', comment: 'Nombre de producto' })
  nombre: string

  @Column({ length: 255, type: 'varchar', comment: 'Descripción de producto' })
  descripcion: string

  @OneToMany(
    () => ProductoCategoria,
    (productoCategoria) => productoCategoria.producto
  )
  productoCategoria: ProductoCategoria[]

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.producto)
  detalleVenta: DetalleVenta[]

  @OneToMany(() => DetalleCarrito, (detalleCarrito) => detalleCarrito.producto)
  detalleCarrito: DetalleCarrito[]

  constructor(data?: Partial<Producto>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || ProductoEstado.ACTIVO
  }
}
