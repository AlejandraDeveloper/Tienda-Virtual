import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CrearProductoDto } from '../dto'
import { ProductoRepository } from '../repository'
import { ProductoService } from './producto.service'
import { TextService } from '@/common/lib/text.service'

const resParametro = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  nombre: 'CODIGO 1',
  descripcion: 'COD',
}

describe('ProductoService', () => {
  let service: ProductoService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoService,
        {
          provide: ProductoRepository,
          useValue: {
            listar: jest.fn(() => [[resParametro], 1]),
            crear: jest.fn(() => resParametro),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<ProductoService>(ProductoService)
  })

  it('[listar] Debería obtener la lista de productos', async () => {
    const paginacion = new PaginacionQueryDto()
    const productos = await service.listar(paginacion)

    expect(productos).toBeInstanceOf(Array)
    expect(productos.length).toEqual(2)
  })

  it('[crear] Debería crear un nuevo producto', async () => {
    const producto = new CrearProductoDto()
    producto.codigo = resParametro.codigo
    producto.nombre = resParametro.nombre
    producto.descripcion = 'descripcion'

    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(producto, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(producto.codigo)
  })
})
