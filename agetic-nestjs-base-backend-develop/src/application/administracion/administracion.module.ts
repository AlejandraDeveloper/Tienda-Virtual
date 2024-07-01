import { Module } from '@nestjs/common'
import { ClienteController } from '@/application/administracion/controller/cliente.controller'
import { ClienteService } from '@/application/administracion/service/cliente.service'
import { ClienteRepository } from '@/application/administracion/repository/cliente.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cliente } from '@/application/administracion/entity/cliente.entity'
import { TiendaController } from '@/application/administracion/controller/tienda.controller'
import { TiendaService } from '@/application/administracion/service/tienda.service'
import { TiendaRepository } from '@/application/administracion/repository/tienda.repository'
import { Tienda } from '@/application/administracion/entity/tienda.entity'

@Module({
  providers: [
    ClienteService,
    ClienteRepository,
    TiendaService,
    TiendaRepository,
  ],
  imports: [TypeOrmModule.forFeature([Cliente, Tienda])],
  controllers: [ClienteController, TiendaController],
})
export class AdministracionModule {}
