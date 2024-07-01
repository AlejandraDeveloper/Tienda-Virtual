import { CanActivate } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { AuthZManagementService } from 'nest-authz'
import { CrearProductoDto } from '../dto'
import { ProductoController } from '.'
import { ProductoService } from '../service'
import { Request } from 'express'
import { TextService } from '@/common/lib/text.service'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

const resParametro = {
  id: TextService.generateUuid(),
  codigo: 'TD-CI',
  nombre: 'Cedula de identidad',
  descripcion: 'Descripciòn del producto',
}

const mockRequest = {
  user: {
    id: TextService.generateUuid(),
  },
} as Request

const resListar = [1, resParametro]

describe('ProductoController', () => {
  let controller: ProductoController
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        {
          provide: ProductoService,
          useValue: {
            listar: jest.fn(() => resListar),
            listarPorGrupo: jest.fn(() => [resParametro]),
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

    controller = module.get<ProductoController>(ProductoController)
  })

  it('[listar] Debería listar productos', async () => {
    const pagination = new PaginacionQueryDto()
    const result = await controller.listar(pagination)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('total')
    expect(result.datos).toHaveProperty('filas')
  })

  it('[crear] Debería crear un nuevo producto', async () => {
    const parametro = {
      codigo: 'TD-2',
      nombre: 'Pasaporte',
      descripcion: 'Pasaporte',
    }
    const parametroDto = plainToClass(CrearProductoDto, parametro)
    const result = await controller.crear(mockRequest, parametroDto)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('id')
  })
})
