import { ProductoCategoria } from '../entity/producto-categoria.entity'
import { DataSource, EntityManager } from 'typeorm'
import { Categoria } from '../entity/categoria.entity'
import { Injectable } from '@nestjs/common'
import { Producto } from '../entity/producto.entity'
import { ProductoCategoriaEstado } from '../constant'

@Injectable()
export class ProductoCategoriaRepository {
  constructor(private dataSource: DataSource) {}

  async obtenerCategoriasPorProducto(
    idProducto: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(ProductoCategoria) ??
      this.dataSource.getRepository(ProductoCategoria)
    )
      .createQueryBuilder('productoCategoria')
      .leftJoinAndSelect('productoCategoria.categoria', 'categoria')
      .where('productoCategoria.id_producto = :idProducto', { idProducto })
      .getMany()
  }

  async activar(
    idProducto: string,
    categorias: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(ProductoCategoria) ??
      this.dataSource.getRepository(ProductoCategoria)
    )
      .createQueryBuilder()
      .update(ProductoCategoria)
      .set({
        estado: ProductoCategoriaEstado.ACTIVO,
        usuarioModificacion: usuarioAuditoria,
      })
      .where('id_producto = :idProducto', { idProducto })
      .andWhere('id_categoria IN(:...ids)', { ids: categorias })
      .execute()
  }

  async inactivar(
    idProducto: string,
    categorias: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(ProductoCategoria) ??
      this.dataSource.getRepository(ProductoCategoria)
    )
      .createQueryBuilder()
      .update(ProductoCategoria)
      .set({
        estado: ProductoCategoriaEstado.INACTIVO,
        usuarioModificacion: usuarioAuditoria,
      })
      .where('id_producto = :idProducto', { idProducto })
      .andWhere('id_categoria IN(:...ids)', { ids: categorias })
      .execute()
  }

  async crear(
    idProducto: string,
    categorias: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const productoCategorias = categorias.map((idCategoria) => {
      const producto = new Producto()
      producto.id = idProducto

      const categoria = new Categoria()
      categoria.id = idCategoria

      const productoCategoria = new ProductoCategoria()
      productoCategoria.producto = producto
      productoCategoria.categoria = categoria
      productoCategoria.usuarioCreacion = usuarioAuditoria

      return productoCategoria
    })

    return await (
      transaction?.getRepository(ProductoCategoria) ??
      this.dataSource.getRepository(ProductoCategoria)
    ).save(productoCategorias)
  }
}
