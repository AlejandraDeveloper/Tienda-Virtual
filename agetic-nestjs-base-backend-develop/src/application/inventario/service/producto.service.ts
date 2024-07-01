import { BaseService } from '@/common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ProductoRepository } from '../repository'
import { CrearProductoDto } from '../dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Messages } from '@/common/constants/response-messages'
import { ActualizarProductoDto } from '../dto'
import { ProductoEstado } from '../constant'

@Injectable()
export class ProductoService extends BaseService {
  constructor(
    @Inject(ProductoRepository)
    private productoRepositorio: ProductoRepository
  ) {
    super()
  }

  async crear(productoDto: CrearProductoDto, usuarioAuditoria: string) {
    const productoRepetido = await this.productoRepositorio.buscarCodigo(
      productoDto.codigo
    )

    if (productoRepetido) {
      throw new ConflictException(Messages.REPEATED_PARAMETER)
    }

    return await this.productoRepositorio.crear(productoDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.productoRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    productoDto: ActualizarProductoDto,
    usuarioAuditoria: string
  ) {
    const producto = await this.productoRepositorio.buscarPorId(id)
    if (!producto) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.productoRepositorio.actualizar(id, productoDto, usuarioAuditoria)
    return { id }
  }

  async activar(idProducto: string, usuarioAuditoria: string) {
    const producto = await this.productoRepositorio.buscarPorId(idProducto)
    if (!producto) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const productoDto = new ActualizarProductoDto()
    productoDto.estado = ProductoEstado.ACTIVO
    await this.productoRepositorio.actualizar(
      idProducto,
      productoDto,
      usuarioAuditoria
    )
    return {
      id: idProducto,
      estado: productoDto.estado,
    }
  }

  async inactivar(idProducto: string, usuarioAuditoria: string) {
    const producto = await this.productoRepositorio.buscarPorId(idProducto)
    if (!producto) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const productoDto = new ActualizarProductoDto()
    productoDto.estado = ProductoEstado.INACTIVO
    await this.productoRepositorio.actualizar(
      idProducto,
      productoDto,
      usuarioAuditoria
    )
    return {
      id: idProducto,
      estado: productoDto.estado,
    }
  }
}
