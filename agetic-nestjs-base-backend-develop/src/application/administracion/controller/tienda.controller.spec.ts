import { CanActivate } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { AuthZManagementService } from 'nest-authz'
import { CrearTiendaDto } from '../dto'
import { TiendaController } from '../controller'
import { TiendaService } from '../service'
import { Request } from 'express'
import { TextService } from '@/common/lib/text.service'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

const resParametro = {
  id: TextService.generateUuid(),
  direccion: 'Direccion de la Tienda',
  descripcion: 'Descripcion de la Tienda',
}

const mockRequest = {
  user: {
    id: TextService.generateUuid(),
  },
} as Request

const resListar = [1, resParametro]

describe('TiendaController', () => {
  let controller: TiendaController
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaController],
      providers: [
        {
          provide: TiendaService,
          useValue: {
            listar: jest.fn(() => resListar),
            crear: jest.fn(() => resParametro),
          },
        },
        {
          provide: AuthZManagementService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(CasbinGuard)
      .useValue(mock_ForceFailGuard)
      .compile()

    controller = module.get<TiendaController>(TiendaController)
  })

  it('[listar] Debería listar tienda', async () => {
    const pagination = new PaginacionQueryDto()
    const result = await controller.listar(pagination)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('total')
    expect(result.datos).toHaveProperty('filas')
  })

  it('[crear] Debería crear una nueva tienda', async () => {
    const parametro = {
      direccion: 'Direccion',
      descripcion: 'Descripcion',
    }
    const parametroDto = plainToClass(CrearTiendaDto, parametro)
    const result = await controller.crear(mockRequest, parametroDto)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('id')
  })
})
