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
import { CarritoService } from '../service/carrito.service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base'
import { ParamIdDto } from '@/common/dto/params-id.dto'
import { Request } from 'express'
import { ActualizarCarritoDto, CrearCarritoDto } from '../dto'
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
export class CarritoController extends BaseController {
  constructor(private carritoServicio: CarritoService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de parámetros' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.carritoServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un nuevo parámetro' })
  @ApiBody({
    type: CrearCarritoDto,
    description:
      'Esta API permite crear un nuevo carrito utilizando los datos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() parametroDto: CrearCarritoDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.carritoServicio.crear(
      parametroDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un carrito' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarCarritoDto,
    description:
      'Esta API permite actualizar un parámetro existente utilizando los atributos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() parametroDto: ActualizarCarritoDto
  ) {
    const { id: idCarrito } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.carritoServicio.actualizarDatos(
      idCarrito,
      parametroDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un carrito' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idCarrito } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.carritoServicio.activar(
      idCarrito,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un carrito' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idCarrito } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.carritoServicio.inactivar(
      idCarrito,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
