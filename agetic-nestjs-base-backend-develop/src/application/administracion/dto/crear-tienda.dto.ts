import { IsNotEmpty, IsOptional } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearTiendaDto {
  @ApiProperty({ example: 'direccion de la tienda' })
  @IsNotEmpty()
  direccion: string

  @ApiProperty({ example: 'Descripcion de la tienda' })
  @IsNotEmpty()
  descripcion: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class RespuestaCrearTiendaDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
