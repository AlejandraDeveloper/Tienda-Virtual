import { IsNotEmpty } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ActualizarCategoriaDto {
  @ApiProperty({ example: 'Nombre de la categoria' })
  @IsNotEmpty()
  @ApiProperty({ example: 'Nombre de la categoria' })
  nombre: string

  @ApiProperty({ example: 'Descripciòn de la categorìa' })
  descripcion: string

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
