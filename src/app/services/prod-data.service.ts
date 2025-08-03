// src/app/services/prod-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Breaker } from '../models/breaker.model';
import { DataService } from './data.service';

@Injectable()
export class ProdDataService extends DataService {


  override updateBreaker(): Observable<Breaker> {
    return throwError(() => new Error('Updates disabled in production'));
  }
}