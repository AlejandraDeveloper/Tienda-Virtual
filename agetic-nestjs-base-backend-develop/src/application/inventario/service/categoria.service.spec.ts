import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CrearCategoriaDto } from '../dto'
import { CategoriaRepository } from '../repository'
import { CategoriaService } from './categoria.service'
import { TextService } from '@/common/lib/text.service'

const resParametro = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  nombre: 'CODIGO 1',
  descripcion: 'COD',
}

describe('CategoriaService', () => {
  let service: CategoriaService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: CategoriaRepository,
          useValue: {
            listar: jest.fn(() => [ resParametro], 1]),
            crear: jest.fn(() => resParametro),
          },
        },
      ],
    }).compile()

    service = module.get<CategoriaService>(CategoriaService)
  })

  it('[listar] Debería obtener la lista de categorias', async () => {
    const paginacion = new PaginacionQueryDto()
    const categorias = await service.listar(paginacion)
    expect(categorias).toBeInstanceOf(Array)
    expect(categorias.length).toEqual(2)
  })

  it('[crear] Debería crear una nueva categoria', async () => {
    const categoria = new CrearCategoriaDto()
    categoria.nombre = resParametro.nombre
    categoria.descripcion = 'descripcion'

    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(categoria, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(categoria.codigo)
  })
})
