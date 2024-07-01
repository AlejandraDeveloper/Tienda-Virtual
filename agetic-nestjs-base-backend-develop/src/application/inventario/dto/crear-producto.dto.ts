import { IsNotEmpty, IsOptional } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearProductoDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  codigo: string

  @ApiProperty({ example: 'Nombre del Producto' })
  @IsNotEmpty()
  nombre: string

  @ApiProperty({ example: 'Descripcion del Producto' })
  @IsNotEmpty()
  descripcion: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}
