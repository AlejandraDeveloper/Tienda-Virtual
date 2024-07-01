import { Module } from '@nestjs/common'
import { VentaController } from '@/application/pedido/controller/venta.controller'
import { VentaService } from '@/application/pedido/service/venta.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VentaRepository } from '@/application/pedido/repository/venta.repository'
import { Venta } from '@/application/pedido/entity/venta.entity'
import { CarritoController } from '@/application/pedido/controller/carrito.controller'
import { CarritoService } from '@/application/pedido/service/carrito.service'
import { CarritoRepository } from '@/application/pedido/repository/carrito.repository'
import { DetalleVentaRepository } from '@/application/pedido/repository/detalle-venta.repository'
import { Carrito } from '@/application/pedido/entity/carrito.entity'
import { DetalleVenta } from './entity'

@Module({
  controllers: [VentaController, CarritoController],
  providers: [
    VentaService,
    VentaRepository,
    CarritoService,
    CarritoRepository,
    DetalleVentaRepository,
  ],
  imports: [TypeOrmModule.forFeature([Venta, Carrito, DetalleVenta])],
})
export class PedidoModule {}
