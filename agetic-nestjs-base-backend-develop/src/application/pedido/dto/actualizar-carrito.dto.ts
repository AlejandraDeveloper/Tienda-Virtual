import { IsNotEmpty } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ActualizarCarritoDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  @ApiProperty({ example: 'TD-2' })
  codigo: string

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
