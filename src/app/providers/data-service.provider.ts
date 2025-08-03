// src/app/core/providers/data-service.provider.ts
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProdDataService } from '../services/prod-data.service';
import { DevDataService } from '../services/dev-data.service';
import { environment } from '../../environments/environment';
import { DataService } from '../services/data.service';
import { Environment } from '../../environments/environment.model';

export function provideDataService(): EnvironmentProviders {
  const env = environment as Environment;
  
  return makeEnvironmentProviders([
    {
      provide: DataService,
      useFactory: (http: HttpClient) => 
        env.enableUpdates && env.github
          ? new DevDataService(http) 
          : new DataService(http),
      deps: [HttpClient]
    }
  ]);
}