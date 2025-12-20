import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateShortUrlDto {
  @ApiProperty({
    example: 'https://example.com/very/long/url',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
