import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { ProductoCategoriaEstado } from '../constant'
import { Producto } from './producto.entity'
import { Categoria } from './categoria.entity'
dotenv.config()

@Check(UtilService.buildStatusCheck(ProductoCategoriaEstado))
@Entity({
  name: 'productos_categorias',
  schema: process.env.DB_SCHEMA_INVENTARIOS,
})
export class ProductoCategoria extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla productocategoria',
  })
  id: string

  @Column({
    length: 255,
    type: 'varchar',
    name: 'descripcion',
    comment: 'Descripción de productocategoria',
  })
  descripcion: string

  @Column({
    name: 'id_producto',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla de producto',
  })
  idProducto: string

  @Column({
    name: 'id_categoria',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla categoria',
  })
  idCategoria: string

  @ManyToOne(() => Producto, (producto) => producto.productoCategoria)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto

  @ManyToOne(() => Categoria, (categoria) => categoria.productoCategoria)
  @JoinColumn({ name: 'id_categoria', referencedColumnName: 'id' })
  categoria: Categoria

  constructor(data?: Partial<ProductoCategoria>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || ProductoCategoriaEstado.ACTIVO
  }
}
