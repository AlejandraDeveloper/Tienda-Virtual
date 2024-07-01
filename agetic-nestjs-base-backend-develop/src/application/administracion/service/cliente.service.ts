import { BaseService } from '@/common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ClienteRepository } from '../repository'
import { CrearClienteDto } from '../dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Messages } from '@/common/constants/response-messages'
import { ActualizarClienteDto } from '../dto'
import { ClienteEstado } from '../constant'

@Injectable()
export class ClienteService extends BaseService {
  constructor(
    @Inject(ClienteRepository)
    private clienteRepositorio: ClienteRepository
  ) {
    super()
  }

  async crear(clienteDto: CrearClienteDto, usuarioAuditoria: string) {
    const clienteRepetido = await this.clienteRepositorio.buscarCodigo(
      clienteDto.codigo
    )

    if (clienteRepetido) {
      throw new ConflictException(Messages.REPEATED_PARAMETER)
    }

    return await this.clienteRepositorio.crear(clienteDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.clienteRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    clienteDto: ActualizarClienteDto,
    usuarioAuditoria: string
  ) {
    const cliente = await this.clienteRepositorio.buscarPorId(id)
    if (!cliente) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.clienteRepositorio.actualizar(id, clienteDto, usuarioAuditoria)
    return { id }
  }

  async activar(idCliente: string, usuarioAuditoria: string) {
    const cliente = await this.clienteRepositorio.buscarPorId(idCliente)
    if (!cliente) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const clienteDto = new ActualizarClienteDto()
    clienteDto.estado = ClienteEstado.ACTIVO
    await this.clienteRepositorio.actualizar(
      idCliente,
      clienteDto,
      usuarioAuditoria
    )
    return {
      id: idCliente,
      estado: clienteDto.estado,
    }
  }

  async inactivar(idCliente: string, usuarioAuditoria: string) {
    const cliente = await this.clienteRepositorio.buscarPorId(idCliente)
    if (!cliente) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const clienteDto = new ActualizarClienteDto()
    clienteDto.estado = ClienteEstado.INACTIVO
    await this.clienteRepositorio.actualizar(
      idCliente,
      clienteDto,
      usuarioAuditoria
    )
    return {
      id: idCliente,
      estado: clienteDto.estado,
    }
  }
}
