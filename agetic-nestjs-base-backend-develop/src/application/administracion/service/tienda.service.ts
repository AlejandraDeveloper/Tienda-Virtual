import { BaseService } from '@/common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { TiendaRepository } from '../repository'
import { CrearTiendaDto } from '../dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Messages } from '@/common/constants/response-messages'
import { ActualizarTiendaDto } from '../dto'
import { TiendaEstado } from '../constant'

@Injectable()
export class TiendaService extends BaseService {
  constructor(
    @Inject(TiendaRepository)
    private parametroRepositorio: TiendaRepository
  ) {
    super()
  }

  async crear(tiendaDto: CrearTiendaDto, usuarioAuditoria: string) {
    return await this.parametroRepositorio.crear(tiendaDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.parametroRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    tiendaDto: ActualizarTiendaDto,
    usuarioAuditoria: string
  ) {
    const parametro = await this.parametroRepositorio.buscarPorId(id)
    if (!parametro) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.parametroRepositorio.actualizar(id, tiendaDto, usuarioAuditoria)
    return { id }
  }

  async activar(idParametro: string, usuarioAuditoria: string) {
    const parametro = await this.parametroRepositorio.buscarPorId(idParametro)
    if (!parametro) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const tiendaDto = new ActualizarTiendaDto()
    tiendaDto.estado = TiendaEstado.ACTIVO
    await this.parametroRepositorio.actualizar(
      idParametro,
      tiendaDto,
      usuarioAuditoria
    )
    return {
      id: idParametro,
      estado: tiendaDto.estado,
    }
  }

  async inactivar(idParametro: string, usuarioAuditoria: string) {
    const parametro = await this.parametroRepositorio.buscarPorId(idParametro)
    if (!parametro) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const tiendaDto = new ActualizarTiendaDto()
    tiendaDto.estado = TiendaEstado.INACTIVO
    await this.parametroRepositorio.actualizar(
      idParametro,
      tiendaDto,
      usuarioAuditoria
    )
    return {
      id: idParametro,
      estado: tiendaDto.estado,
    }
  }
}
