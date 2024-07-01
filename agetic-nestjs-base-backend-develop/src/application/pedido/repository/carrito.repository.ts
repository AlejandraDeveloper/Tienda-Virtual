import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarCarritoDto, CrearCarritoDto } from '../dto'
import { Carrito } from '../entity'
import { CarritoEstado } from '../constant'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class CarritoRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Carrito)
      .createQueryBuilder('carrito')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    parametroDto: ActualizarCarritoDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Carrito({
      ...parametroDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Carrito)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Carrito)
      .createQueryBuilder('carrito')
      .select(['carrito.id', 'carrito.codigo', 'carrito.estado'])
      .where('producto.estado = :estado', { estado: CarritoEstado.ACTIVO })
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('carrito.codigo', sentido)
        break
      case 'estado':
        query.addOrderBy('carrito.estado', sentido)
        break
      default:
        query.orderBy('carrito.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('carrito.codigo like :filtro', { filtro: `%${filtro}%` })
        })
      )
    }
    return await query.getManyAndCount()
  }

  buscarCodigo(codigo: string) {
    return this.dataSource
      .getRepository(Carrito)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(parametroDto: CrearCarritoDto, usuarioAuditoria: string) {
    const { codigo } = parametroDto

    const carrito = new Carrito()
    carrito.codigo = codigo
    carrito.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Carrito).save(carrito)
  }
}
