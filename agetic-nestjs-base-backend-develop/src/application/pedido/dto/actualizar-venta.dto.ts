import { IsNotEmpty } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ActualizarVentaDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  @ApiProperty({ example: 'TD-2' })
  codigo: string

  @ApiProperty({ example: 'Monto total de las ventas' })
  @IsNotEmpty()
  @ApiProperty({ example: 'Importe total de ventas en bolivianos' })
  importe: number

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
