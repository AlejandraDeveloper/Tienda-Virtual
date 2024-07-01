import { BaseService } from '@/common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { VentaRepository } from '../repository'
import { CrearVentaDto } from '../dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Messages } from '@/common/constants/response-messages'
import { ActualizarVentaDto } from '../dto'
import { VentaEstado } from '../constant'

@Injectable()
export class VentaService extends BaseService {
  constructor(
    @Inject(VentaRepository)
    private ventaRepositorio: VentaRepository
  ) {
    super()
  }

  async crear(parametroDto: CrearVentaDto, usuarioAuditoria: string) {
    const parametroRepetido = await this.ventaRepositorio.buscarCodigo(
      parametroDto.codigo
    )

    if (parametroRepetido) {
      throw new ConflictException(Messages.REPEATED_PARAMETER)
    }

    return await this.ventaRepositorio.crear(parametroDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.ventaRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    parametroDto: ActualizarVentaDto,
    usuarioAuditoria: string
  ) {
    const parametro = await this.ventaRepositorio.buscarPorId(id)
    if (!parametro) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.ventaRepositorio.actualizar(id, parametroDto, usuarioAuditoria)
    return { id }
  }

  async activar(idVenta: string, usuarioAuditoria: string) {
    const parametro = await this.ventaRepositorio.buscarPorId(idVenta)
    if (!parametro) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const parametroDto = new ActualizarVentaDto()
    parametroDto.estado = VentaEstado.ACTIVO
    await this.ventaRepositorio.actualizar(
      idVenta,
      parametroDto,
      usuarioAuditoria
    )
    return {
      id: idVenta,
      estado: parametroDto.estado,
    }
  }

  async inactivar(idVenta: string, usuarioAuditoria: string) {
    const parametro = await this.ventaRepositorio.buscarPorId(idVenta)
    if (!parametro) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const parametroDto = new ActualizarVentaDto()
    parametroDto.estado = VentaEstado.INACTIVO
    await this.ventaRepositorio.actualizar(
      idVenta,
      parametroDto,
      usuarioAuditoria
    )
    return {
      id: idVenta,
      estado: parametroDto.estado,
    }
  }
}
