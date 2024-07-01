import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'
import { AdministracionModule } from './administracion/administracion.module'
import { InventarioModule } from './inventario/inventario.module'
import { PedidoModule } from './pedido/pedido.module'

@Module({
  imports: [
    AdministracionModule,
    InventarioModule,
    ParametroModule,
    PedidoModule,
  ],
})
export class ApplicationModule {}
