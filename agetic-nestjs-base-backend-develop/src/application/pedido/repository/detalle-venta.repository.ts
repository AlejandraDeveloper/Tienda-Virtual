import { DataSource, EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { DetalleVenta, Venta } from '../entity'
import { DetalleVentaEstado } from '../constant'
import { Producto } from '@/application/inventario/entity'

@Injectable()
export class DetalleVentaRepository {
  constructor(private dataSource: DataSource) {}

  async obtenerProductosPorVenta(
    idProducto: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(DetalleVenta) ??
      this.dataSource.getRepository(DetalleVenta)
    )
      .createQueryBuilder('detalleVenta')
      .leftJoinAndSelect('detalleVenta.venta', 'venta')
      .where('detalleVenta.id_producto = :idProducto', { idProducto })
      .getMany()
  }

  async activar(
    idProducto: string,
    ventas: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(DetalleVenta) ??
      this.dataSource.getRepository(DetalleVenta)
    )
      .createQueryBuilder()
      .update(DetalleVenta)
      .set({
        estado: DetalleVentaEstado.ACTIVO,
        usuarioModificacion: usuarioAuditoria,
      })
      .where('id_producto = :idProducto', { idProducto })
      .andWhere('id_venta IN(:...ids)', { ids: ventas })
      .execute()
  }

  async inactivar(
    idProducto: string,
    ventas: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(DetalleVenta) ??
      this.dataSource.getRepository(DetalleVenta)
    )
      .createQueryBuilder()
      .update(DetalleVenta)
      .set({
        estado: DetalleVentaEstado.INACTIVO,
        usuarioModificacion: usuarioAuditoria,
      })
      .where('id_producto = :idProducto', { idProducto })
      .andWhere('id_venta IN(:...ids)', { ids: ventas })
      .execute()
  }

  async crear(
    idProducto: string,
    ventas: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const detalleVentas = ventas.map((idVenta) => {
      const producto = new Producto()
      producto.id = idProducto

      const venta = new Venta()
      venta.id = idVenta

      const detalleVenta = new DetalleVenta()
      detalleVenta.producto = producto
      detalleVenta.venta = venta
      detalleVenta.usuarioCreacion = usuarioAuditoria

      return detalleVenta
    })

    return await (
      transaction?.getRepository(DetalleVenta) ??
      this.dataSource.getRepository(DetalleVenta)
    ).save(detalleVentas)
  }
}
