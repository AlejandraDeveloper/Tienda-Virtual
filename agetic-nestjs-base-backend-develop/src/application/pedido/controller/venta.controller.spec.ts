import { CanActivate } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { AuthZManagementService } from 'nest-authz'
import { CrearVentaDto } from '../dto'
import { VentaController } from './venta.controller'
import { Request } from 'express'
import { TextService } from '@/common/lib/text.service'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { VentaService } from '../service/venta.service'

const resVenta = {
  id: TextService.generateUuid(),
  codigo: 'TD-CI',
}

const mockRequest = {
  user: {
    id: TextService.generateUuid(),
  },
} as Request

const resListar = [1, resVenta]

describe('VentaController', () => {
  let controller: VentaController
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentaController],
      providers: [
        {
          provide: VentaService,
          useValue: {
            listar: jest.fn(() => resListar),
            crear: jest.fn(() => resVenta),
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

    controller = module.get<VentaController>(VentaController)
  })

  it('[listar] Debería listar ventas', async () => {
    const pagination = new PaginacionQueryDto()
    const result = await controller.listar(pagination)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('total')
    expect(result.datos).toHaveProperty('filas')
  })

  it('[crear] Debería crear un nuevo parámetro', async () => {
    const parametro = {
      codigo: 'TD-2',
    }
    const parametroDto = plainToClass(CrearVentaDto, parametro)
    const result = await controller.crear(mockRequest, parametroDto)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('id')
  })
})
