import { ApiProperty } from '@nestjs/swagger'

export class ActualizarTiendaDto {
  @ApiProperty({ example: 'Cédula de identidad' })
  direccion: string

  @ApiProperty({ example: 'Cédula de identidad' })
  descripcion: string

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
