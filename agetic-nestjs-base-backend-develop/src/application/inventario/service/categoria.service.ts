import { BaseService } from '@/common/base/base-service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CategoriaRepository } from '../repository'
import { CrearCategoriaDto } from '../dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Messages } from '@/common/constants/response-messages'
import { ActualizarCategoriaDto } from '../dto'
import { CategoriaEstado } from '../constant'

@Injectable()
export class CategoriaService extends BaseService {
  constructor(
    @Inject(CategoriaRepository)
    private categoriaRepositorio: CategoriaRepository
  ) {
    super()
  }

  async crear(parametroDto: CrearCategoriaDto, usuarioAuditoria: string) {
    return await this.categoriaRepositorio.crear(parametroDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.categoriaRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    parametroDto: ActualizarCategoriaDto,
    usuarioAuditoria: string
  ) {
    const categoria = await this.categoriaRepositorio.buscarPorId(id)
    if (!categoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.categoriaRepositorio.actualizar(
      id,
      parametroDto,
      usuarioAuditoria
    )
    return { id }
  }

  async activar(idCategoria: string, usuarioAuditoria: string) {
    const categoria = await this.categoriaRepositorio.buscarPorId(idCategoria)
    if (!categoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const parametroDto = new ActualizarCategoriaDto()
    parametroDto.estado = CategoriaEstado.ACTIVO
    await this.categoriaRepositorio.actualizar(
      idCategoria,
      parametroDto,
      usuarioAuditoria
    )
    return {
      id: idCategoria,
      estado: parametroDto.estado,
    }
  }

  async inactivar(idCategoria: string, usuarioAuditoria: string) {
    const categoria = await this.categoriaRepositorio.buscarPorId(idCategoria)
    if (!categoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const parametroDto = new ActualizarCategoriaDto()
    parametroDto.estado = CategoriaEstado.INACTIVO
    await this.categoriaRepositorio.actualizar(
      idCategoria,
      parametroDto,
      usuarioAuditoria
    )
    return {
      id: idCategoria,
      estado: parametroDto.estado,
    }
  }
}
