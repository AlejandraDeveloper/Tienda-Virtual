import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CrearVentaDto } from '../dto'
import { VentaRepository } from '../repository'
import { VentaService } from './venta.service'
import { TextService } from '@/common/lib/text.service'

const resVenta = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  importe: 'CODIGO 1',
}

describe('VentaService', () => {
  let service: VentaService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VentaService,
        {
          provide: VentaRepository,
          useValue: {
            listar: jest.fn(() => [[resVenta], 1]),
            listarPorGrupo: jest.fn(() => [resVenta]),
            crear: jest.fn(() => resVenta),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<VentaService>(VentaService)
  })

  it('[listar] Debería obtener la lista de ventas', async () => {
    const paginacion = new PaginacionQueryDto()
    const parametros = await service.listar(paginacion)

    expect(parametros).toBeInstanceOf(Array)
    expect(parametros.length).toEqual(2)
  })

  it('[crear] Debería crear un nueva venta', async () => {
    const venta = new CrearVentaDto()
    venta.codigo = resVenta.codigo
    venta.nombre = resVenta.importe
    venta.descripcion = 'descripcion'

    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(venta, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(venta.codigo)
  })
})
