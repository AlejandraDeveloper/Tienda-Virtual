import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarCategoriaDto } from '../dto'
import { CrearCategoriaDto } from '../dto'
import { Categoria } from '../entity'
import { CategoriaEstado } from '../constant'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class CategoriaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Categoria)
      .createQueryBuilder('categoria')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    parametroDto: ActualizarCategoriaDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Categoria({
      ...parametroDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Categoria)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Categoria)
      .createQueryBuilder('Categoria')
      .select(['Categoria.id', 'Categoria.nombre', 'Categoria.descripcion'])
      .where('producto.estado = :estado', { estado: CategoriaEstado.ACTIVO })
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'nombre':
        query.addOrderBy('Categoria.nombre', sentido)
        break
      case 'descripcion':
        query.addOrderBy('Categoria.descripcion', sentido)
        break
      case 'estado':
        query.addOrderBy('Categoria.estado', sentido)
        break
      default:
        query.orderBy('Categoria.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('Categoria.nombre ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('Categoria.descripcion ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async crear(parametroDto: CrearCategoriaDto, usuarioAuditoria: string) {
    const { nombre, descripcion } = parametroDto

    const categoria = new Categoria()
    categoria.nombre = nombre
    categoria.descripcion = descripcion
    categoria.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Categoria).save(Categoria)
  }
}
