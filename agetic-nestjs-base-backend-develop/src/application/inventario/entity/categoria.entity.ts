import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ProductoCategoria } from './producto-categoria.entity'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { CategoriaEstado } from '../constant'
import { Tienda } from '@/application/administracion/entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(CategoriaEstado))
@Entity({ name: 'categorias', schema: process.env.DB_SCHEMA_INVENTARIOS })
export class Categoria extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Parámetro',
  })
  id: string

  @Column({
    name: 'id_tienda',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla de tienda',
  })
  idTienda: string

  @Column({ length: 50, type: 'varchar', comment: 'Nombre de parámetro' })
  nombre: string

  @Column({ length: 255, type: 'varchar', comment: 'Descripción de parámetro' })
  descripcion: string

  @OneToMany(
    () => ProductoCategoria,
    (productoCategoria) => productoCategoria.categoria
  )
  productoCategoria: ProductoCategoria[]

  @ManyToOne(() => Tienda, (tienda) => tienda.categoria)
  @JoinColumn({ name: 'id_tienda', referencedColumnName: 'id' })
  tienda: Tienda

  constructor(data?: Partial<Categoria>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || CategoriaEstado.ACTIVO
  }
}
