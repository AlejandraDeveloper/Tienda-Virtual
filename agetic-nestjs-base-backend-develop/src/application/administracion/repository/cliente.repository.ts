import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarClienteDto, CrearClienteDto } from '../dto'
import { Cliente } from '../entity'
import { ClienteEstado } from '../constant'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class ClienteRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Cliente)
      .createQueryBuilder('cliente')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    parametroDto: ActualizarClienteDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Cliente({
      ...parametroDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Cliente)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Cliente)
      .createQueryBuilder('cliente')
      .select(['cliente.id', 'cliente.codigo'])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('cliente.codigo', sentido)
        break
      case 'estado':
        query.addOrderBy('cliente.estado', sentido)
        break
      default:
        query.orderBy('cliente.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('cliente.codigo like :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('cliente.nombre ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  buscarCodigo(codigo: string) {
    return this.dataSource
      .getRepository(Cliente)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(parametroDto: CrearClienteDto, usuarioAuditoria: string) {
    const { codigo } = parametroDto

    const cliente = new Cliente()
    cliente.codigo = codigo

    return await this.dataSource.getRepository(Cliente).save(cliente)
  }
}
