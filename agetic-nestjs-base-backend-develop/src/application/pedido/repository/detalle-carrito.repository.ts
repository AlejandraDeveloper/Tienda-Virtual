import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import { Carrito, DetalleCarrito } from '../entity'
import { DetalleCarritoEstado } from '../constant'
import { Producto } from '@/application/inventario/entity'

@Injectable()
export class DetalleCarritoRepository {
  constructor(private dataSource: DataSource) {}

  async obtenerDetallePorCarrito(
    idProducto: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(DetalleCarrito) ??
      this.dataSource.getRepository(DetalleCarrito)
    )
      .createQueryBuilder('detalleCarrito')
      .leftJoinAndSelect('detalleCarrito.carrito', 'carrito')
      .where('detalleCarrito.id_producto = :idProducto', { idProducto })
      .getMany()
  }

  async activar(
    idProducto: string,
    carritos: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(DetalleCarrito) ??
      this.dataSource.getRepository(DetalleCarrito)
    )
      .createQueryBuilder()
      .update(DetalleCarrito)
      .set({
        estado: DetalleCarritoEstado.ACTIVO,
        usuarioModificacion: usuarioAuditoria,
      })
      .where('id_producto = :idProducto', { idProducto })
      .andWhere('id_carrito IN(:...ids)', { ids: carritos })
      .execute()
  }

  async inactivar(
    idProducto: string,
    carritos: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(DetalleCarrito) ??
      this.dataSource.getRepository(DetalleCarrito)
    )
      .createQueryBuilder()
      .update(DetalleCarrito)
      .set({
        estado: DetalleCarritoEstado.INACTIVO,
        usuarioModificacion: usuarioAuditoria,
      })
      .where('id_producto = :idProducto', { idProducto })
      .andWhere('id_carrito IN(:...ids)', { ids: carritos })
      .execute()
  }

  async crear(
    idProducto: string,
    carritos: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const detalleCarritos = carritos.map((idCarrito) => {
      const producto = new Producto()
      producto.id = idProducto

      const carrito = new Carrito()
      carrito.id = idCarrito

      const detalleCarrito = new DetalleCarrito()
      detalleCarrito.producto = producto
      detalleCarrito.carrito = carrito
      detalleCarrito.usuarioCreacion = usuarioAuditoria

      return detalleCarrito
    })

    return await (
      transaction?.getRepository(DetalleCarrito) ??
      this.dataSource.getRepository(DetalleCarrito)
    ).save(detalleCarritos)
  }
}
