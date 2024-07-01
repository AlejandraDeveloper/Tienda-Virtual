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
import { TiendaService } from '../service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base'
import { ParamIdDto } from '@/common/dto/params-id.dto'
import { Request } from 'express'
import { CrearTiendaDto } from '../dto/crear-tienda.dto'
import { ActualizarTiendaDto } from '../dto/actualizar-tienda.dto'

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Tiendas')
@ApiBearerAuth()
@Controller('tiendas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class TiendaController extends BaseController {
  constructor(private tiendaServicio: TiendaService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de productos' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.tiendaServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un nuevo producto' })
  @ApiBody({
    type: CrearTiendaDto,
    description:
      'Esta API permite crear un nuevo producto utilizando los datos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() parametroDto: CrearTiendaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.tiendaServicio.crear(
      parametroDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar una tienda' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarTiendaDto,
    description:
      'Esta API permite actualizar una tienda existente utilizando los atributos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() parametroDto: ActualizarTiendaDto
  ) {
    const { id: idTienda } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.tiendaServicio.actualizarDatos(
      idTienda,
      parametroDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar una tienda' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idTienda } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.tiendaServicio.activar(idTienda, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar una tienda' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idTienda } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.tiendaServicio.inactivar(
      idTienda,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
