// src/app/core/providers/data-service.provider.ts
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProdDataService } from '../services/prod-data.service';
import { DevDataService } from '../services/dev-data.service';
import { environment } from '../../environments/environment';
import { DataService } from '../services/data.service';

export function provideDataService(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DataService,
      useFactory: (http: HttpClient) => 
        environment.enableUpdates
          ? new DevDataService(http)
          : new ProdDataService(http),
      deps: [HttpClient]
    }
  ]);
}