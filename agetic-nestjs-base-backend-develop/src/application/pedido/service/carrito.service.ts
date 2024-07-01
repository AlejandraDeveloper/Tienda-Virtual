import { BaseService } from '@/common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CarritoRepository } from '../repository'
import { CrearCarritoDto } from '../dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Messages } from '@/common/constants/response-messages'
import { ActualizarCarritoDto } from '../dto'
import { CarritoEstado } from '../constant'

@Injectable()
export class CarritoService extends BaseService {
  constructor(
    @Inject(CarritoRepository)
    private carritoRepositorio: CarritoRepository
  ) {
    super()
  }

  async crear(carritoDto: CrearCarritoDto, usuarioAuditoria: string) {
    const parametroRepetido = await this.carritoRepositorio.buscarCodigo(
      carritoDto.codigo
    )

    if (parametroRepetido) {
      throw new ConflictException(Messages.REPEATED_PARAMETER)
    }

    return await this.carritoRepositorio.crear(carritoDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.carritoRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    carritoDto: ActualizarCarritoDto,
    usuarioAuditoria: string
  ) {
    const carrito = await this.carritoRepositorio.buscarPorId(id)
    if (!carrito) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.carritoRepositorio.actualizar(id, carritoDto, usuarioAuditoria)
    return { id }
  }

  async activar(idCarrito: string, usuarioAuditoria: string) {
    const carrito = await this.carritoRepositorio.buscarPorId(idCarrito)
    if (!carrito) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const carritoDto = new ActualizarCarritoDto()
    carritoDto.estado = CarritoEstado.ACTIVO
    await this.carritoRepositorio.actualizar(
      idCarrito,
      carritoDto,
      usuarioAuditoria
    )
    return {
      id: idCarrito,
      estado: carritoDto.estado,
    }
  }

  async inactivar(idCarrito: string, usuarioAuditoria: string) {
    const carrito = await this.carritoRepositorio.buscarPorId(idCarrito)
    if (!carrito) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const carritoDto = new ActualizarCarritoDto()
    carritoDto.estado = CarritoEstado.INACTIVO
    await this.carritoRepositorio.actualizar(
      idCarrito,
      carritoDto,
      usuarioAuditoria
    )
    return {
      id: idCarrito,
      estado: carritoDto.estado,
    }
  }
}
