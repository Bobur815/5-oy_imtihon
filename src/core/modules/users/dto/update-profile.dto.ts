import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsInt, Min, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'Bobur Mirzo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Short bio or “about me” section',
    example: 'Backend developer with 5 years of experience.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  about?: string;

  @ApiPropertyOptional({
    description: 'Current job title or position',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  job?: string;

  @ApiPropertyOptional({
    description: 'Total years of professional experience',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({
    description: 'Telegram profile URL',
    example: 'https://t.me/boburmirzo',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  telegram?: string;

  @ApiPropertyOptional({
    description: 'Instagram profile URL',
    example: 'https://instagram.com/boburmirzo',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/boburmirzo',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  linkedin?: string;

  @ApiPropertyOptional({
    description: 'Facebook profile URL',
    example: 'https://facebook.com/boburmirzo',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({
    description: 'GitHub profile URL',
    example: 'https://github.com/boburmirzo',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  github?: string;

  @ApiPropertyOptional({
    description: 'Personal website URL',
    example: 'https://boburmirzo.dev',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  website?: string;
}
