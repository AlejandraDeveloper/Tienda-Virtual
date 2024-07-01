import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CrearCarritoDto } from '../dto'
import { CarritoRepository } from '../repository'
import { CarritoService } from './carrito.service'
import { TextService } from '@/common/lib/text.service'

const resCarrito = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
}

describe('CarritoService', () => {
  let service: CarritoService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarritoService,
        {
          provide: CarritoRepository,
          useValue: {
            listar: jest.fn(() => [[resCarrito], 1]),
            listarPorGrupo: jest.fn(() => [resCarrito]),
            crear: jest.fn(() => resCarrito),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<CarritoService>(CarritoService)
  })

  it('[listar] Debería obtener la lista de parametros', async () => {
    const paginacion = new PaginacionQueryDto()
    const parametros = await service.listar(paginacion)

    expect(parametros).toBeInstanceOf(Array)
    expect(parametros.length).toEqual(2)
  })


  it('[crear] Debería crear un nuevo carrito', async () => {
    const carrito = new CrearCarritoDto()
    carrito.codigo = resCarrito.codigo

    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(carrito, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(carrito.codigo)
  })
})
