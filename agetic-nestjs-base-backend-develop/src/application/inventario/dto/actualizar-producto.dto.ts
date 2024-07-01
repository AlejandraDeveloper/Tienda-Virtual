import { IsNotEmpty } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ActualizarProductoDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  @ApiProperty({ example: 'TD-2' })
  codigo: string

  @ApiProperty({ example: 'Nombre de Producto' })
  @IsNotEmpty()
  @ApiProperty({ example: 'Producto Actualizado' })
  nombre: string

  @ApiProperty({ example: 'Descripcion Actualizado' })
  descripcion: string

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
