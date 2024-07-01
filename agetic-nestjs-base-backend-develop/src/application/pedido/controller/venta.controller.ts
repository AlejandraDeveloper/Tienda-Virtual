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
import { VentaService } from '../service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base'
import { ParamIdDto } from '@/common/dto/params-id.dto'
import { Request } from 'express'
import { ActualizarVentaDto, CrearVentaDto } from '../dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Ventas')
@ApiBearerAuth()
@Controller('ventas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class VentaController extends BaseController {
  constructor(private ventaServicio: VentaService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de ventas' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.ventaServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un nuevo parámetro' })
  @ApiBody({
    type: CrearVentaDto,
    description:
      'Esta API permite crear un nuevo venta utilizando los datos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() ventaDto: CrearVentaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.ventaServicio.crear(ventaDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar una venta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarVentaDto,
    description:
      'Esta API permite actualizar una venta existente utilizando los atributos proporcionados en el cuerpo de la solicitud.',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() ventaDto: ActualizarVentaDto
  ) {
    const { id: idVenta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.ventaServicio.actualizarDatos(
      idVenta,
      ventaDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar una venta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idVenta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.ventaServicio.activar(idVenta, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar una venta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idVenta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.ventaServicio.inactivar(idVenta, usuarioAuditoria)
    return this.successUpdate(result)
  }
}
