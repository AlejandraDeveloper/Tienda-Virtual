import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarTiendaDto } from '../dto'
import { CrearTiendaDto } from '../dto'
import { Tienda } from '../entity'
import { TiendaEstado } from '../constant'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class TiendaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Tienda)
      .createQueryBuilder('tienda')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    parametroDto: ActualizarTiendaDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Tienda({
      ...parametroDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Tienda)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Tienda)
      .createQueryBuilder('tienda')
      .select(['tienda.id','tienda.direccion','tienda.descripcion','tienda.estado'])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'direccion':
        query.addOrderBy('tienda.direccion', sentido)
        break
      case 'descripcion':
        query.addOrderBy('tienda.descripcion', sentido)
        break
      case 'estado':
        query.addOrderBy('tienda.estado', sentido)
        break
      default:
        query.orderBy('tienda.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('tienda.nombre ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('tienda.descripcion ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('tienda.direccion ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async crear(parametroDto: CrearTiendaDto, usuarioAuditoria: string) {
    const { direccion, descripcion } = parametroDto

    const tienda = new Tienda()
    tienda.direccion = direccion
    tienda.descripcion = descripcion
    tienda.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Tienda).save(tienda)
  }
}
