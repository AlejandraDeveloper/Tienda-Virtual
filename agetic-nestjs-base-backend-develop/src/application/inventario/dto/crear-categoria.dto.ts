import { IsNotEmpty, IsOptional } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearCategoriaDto {
  @ApiProperty({ example: 'nombre categoria' })
  @IsNotEmpty()
  nombre: string

  @ApiProperty({ example: 'Descripcion Categoria' })
  @IsNotEmpty()
  descripcion: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class RespuestaCrearCategoriaDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
