import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { CategoriaService } from '../service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base'
import { ParamIdDto } from '@/common/dto/params-id.dto'
import { Request } from 'express'
import { ActualizarCategoriaDto } from '../dto'
import { CrearCategoriaDto } from '../dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Categorias')
@ApiBearerAuth()
@Controller('categorias')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class CategoriaController extends BaseController {
  constructor(private categoriaServicio: CategoriaService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de categorias' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.categoriaServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un nueva categoria' })
  @ApiBody({
    type: CrearCategoriaDto,
    description:
      'Esta API permite crear una nueva categoria utilizando los datos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() parametroDto: CrearCategoriaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.categoriaServicio.crear(
      parametroDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar una categoria' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarCategoriaDto,
    description:
      'Esta API permite actualizar una categoria existente utilizando los atributos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() parametroDto: ActualizarCategoriaDto
  ) {
    const { id: idCategoria } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.categoriaServicio.actualizarDatos(
      idCategoria,
      parametroDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar una categoria' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idCategoria } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.categoriaServicio.activar(
      idCategoria,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar una categoria' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idCategoria } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.categoriaServicio.inactivar(
      idCategoria,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
