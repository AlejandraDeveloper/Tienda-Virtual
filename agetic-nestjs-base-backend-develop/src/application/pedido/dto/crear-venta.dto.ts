import { IsNotEmpty, IsOptional } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearVentaDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  codigo: string

  @ApiProperty({ example: 'Cédula de identidad' })
  @IsNotEmpty()
  importe: number

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class RespuestaCrearVentaDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
