import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export default class AppController {
  @Get()
  @ApiExcludeEndpoint()
  welcome(): string {
    return 'Welcome to the API';
  }
}
