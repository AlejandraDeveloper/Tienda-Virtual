import { Module } from '@nestjs/common'
import { ProductoController } from '@/application/inventario/controller/producto.controller'
import { ProductoService } from '@/application/inventario/service/producto.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductoRepository } from '@/application/inventario/repository/producto.repository'
import { Producto } from '@/application/inventario/entity/producto.entity'
import { CategoriaController } from './controller/categoria.controller'
import { CategoriaService } from '@/application/inventario/service/categoria.service'
import { CategoriaRepository } from '@/application/inventario/repository/categoria.repository'
import { Categoria } from '@/application/inventario/entity/categoria.entity'
import { ProductoCategoriaRepository } from './repository'
import { ProductoCategoria } from './entity'

@Module({
  providers: [
    ProductoService,
    ProductoRepository,
    CategoriaService,
    CategoriaRepository,
    ProductoCategoriaRepository,
  ],
  imports: [TypeOrmModule.forFeature([Producto, Categoria, ProductoCategoria])],
  controllers: [ProductoController, CategoriaController],
})
export class InventarioModule {}
