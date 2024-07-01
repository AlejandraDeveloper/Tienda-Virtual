import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarVentaDto, CrearVentaDto } from '../dto'
import { Venta } from '../entity'
import { VentaEstado } from '../constant'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class VentaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Venta)
      .createQueryBuilder('venta')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    parametroDto: ActualizarVentaDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Venta({
      ...parametroDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Venta)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Venta)
      .createQueryBuilder('venta')
      .select(['venta.id', 'venta.codigo', 'venta.importe', 'venta.estado'])

      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('parametro.codigo', sentido)
        break
      case 'importe':
        query.addOrderBy('venta.importe', sentido)
        break
      case 'estado':
        query.addOrderBy('venta.estado', sentido)
        break
      default:
        query.orderBy('venta.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('codigo.codigo like :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('venta.importe ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  buscarCodigo(codigo: string) {
    return this.dataSource
      .getRepository(Venta)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(parametroDto: CrearVentaDto, usuarioAuditoria: string) {
    const { importe } = parametroDto

    const venta = new Venta()
    venta.importe = importe

    return await this.dataSource.getRepository(Venta).save(venta)
  }
}
