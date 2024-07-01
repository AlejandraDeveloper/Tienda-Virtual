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
import { ProductoService } from '../service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base'
import { ParamIdDto } from '@/common/dto/params-id.dto'
import { Request } from 'express'
import { CrearProductoDto } from '../dto/crear-producto.dto'
import { ActualizarProductoDto } from '../dto'

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Productos')
@ApiBearerAuth()
@Controller('productos')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ProductoController extends BaseController {
  constructor(private productoServicio: ProductoService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de productos' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.productoServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un nuevo producto' })
  @ApiBody({
    type: CrearProductoDto,
    description:
      'Esta API permite crear un nuevo producto utilizando los datos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() parametroDto: CrearProductoDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.productoServicio.crear(
      parametroDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un producto' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarProductoDto,
    description:
      'Esta API permite actualizar un producto existente utilizando los atributos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() parametroDto: ActualizarProductoDto
  ) {
    const { id: idProducto } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.productoServicio.actualizarDatos(
      idProducto,
      parametroDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un producto' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idProducto } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.productoServicio.activar(
      idProducto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un producto' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idProducto } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.productoServicio.inactivar(
      idProducto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
