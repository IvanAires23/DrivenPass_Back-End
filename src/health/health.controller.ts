import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller('health')
export class HealthController {

    constructor(private readonly healthService: HealthService) { }

    @Get()
    @ApiOperation({ summary: 'Checks api health' })
    @ApiResponse({ status: HttpStatus.OK, description: "Everthing is okay" })
    health(): string {
        return this.healthService.health()
    }

}
