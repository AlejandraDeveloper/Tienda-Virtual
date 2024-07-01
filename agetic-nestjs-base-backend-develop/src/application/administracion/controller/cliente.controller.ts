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
import { ClienteService } from '../service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base'
import { ParamIdDto } from '@/common/dto/params-id.dto'
import { Request } from 'express'
import { ActualizarClienteDto } from '../dto'
import { CrearClienteDto } from '../dto'

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Parámetros')
@ApiBearerAuth()
@Controller('parametros')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ClienteController extends BaseController {
  constructor(private clienteServicio: ClienteService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de parámetros' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.clienteServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un nuevo parámetro' })
  @ApiBody({
    type: CrearClienteDto,
    description:
      'Esta API permite crear un nuevo parámetro utilizando los datos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() parametroDto: CrearClienteDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.clienteServicio.crear(
      parametroDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarClienteDto,
    description:
      'Esta API permite actualizar un parámetro existente utilizando los atributos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() parametroDto: ActualizarClienteDto
  ) {
    const { id: idCliente } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.clienteServicio.actualizarDatos(
      idCliente,
      parametroDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idCliente } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.clienteServicio.activar(
      idCliente,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un cliente' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idCliente } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.clienteServicio.inactivar(
      idCliente,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
