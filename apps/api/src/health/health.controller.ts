import { type ApiObjectResponse } from '@cspad/types';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { APP_VERSION } from '../version.js';

export interface HealthStatus {
  status: 'ok';
  service: string;
  version: string;
  timestamp: string;
}

/**
 * Sonde de vie (liveness). Publique et sans donnée métier.
 * La sonde de disponibilité (base de données) arrive en Phase 2 avec Prisma.
 */
@ApiTags('Système')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Sonde de vie de l'API" })
  @ApiOkResponse({ description: "L'API répond." })
  check(): ApiObjectResponse<HealthStatus> {
    return {
      data: {
        status: 'ok',
        service: 'cspad-api',
        version: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
