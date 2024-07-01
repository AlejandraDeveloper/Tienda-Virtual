import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarProductoDto, CrearProductoDto } from '../dto'
import { Producto } from '../entity'
import { ProductoEstado } from '../constant'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class ProductoRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Producto)
      .createQueryBuilder('producto')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    parametroDto: ActualizarProductoDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Producto({
      ...parametroDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Producto)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Producto)
      .createQueryBuilder('producto')
      .select([
        'producto.id',
        'producto.codigo',
        'producto.nombre',
        'producto.descripcion',
        'producto.estado',
      ])
      .where('producto.estado = :estado', { estado: ProductoEstado.ACTIVO })
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('producto.codigo', sentido)
        break
      case 'nombre':
        query.addOrderBy('producto.nombre', sentido)
        break
      case 'descripcion':
        query.addOrderBy('producto.descripcion', sentido)
        break
      case 'estado':
        query.addOrderBy('producto.estado', sentido)
        break
      default:
        query.orderBy('producto.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('producto.codigo like :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('producto.nombre ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('producto.descripcion ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  buscarCodigo(codigo: string) {
    return this.dataSource
      .getRepository(Producto)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(parametroDto: CrearProductoDto, usuarioAuditoria: string) {
    const { codigo, nombre, descripcion } = parametroDto

    const producto = new Producto()
    producto.codigo = codigo
    producto.nombre = nombre
    producto.descripcion = descripcion
    producto.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Producto).save(producto)
  }
}
