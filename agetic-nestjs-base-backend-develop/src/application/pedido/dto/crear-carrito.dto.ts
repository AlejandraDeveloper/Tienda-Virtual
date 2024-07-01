import { IsNotEmpty, IsOptional } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearCarritoDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  codigo: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class RespuestaCrearCarritoDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
