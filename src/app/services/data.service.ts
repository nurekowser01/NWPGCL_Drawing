// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Breaker } from '../models/breaker.model';

@Injectable({
  providedIn: 'root'
})
export abstract class DataService {
  protected readonly FILE_PATH = 'assets/data/drawings.json';

  constructor(protected http: HttpClient) {}

  // Read methods (available in all environments)
  abstract getData(): Observable<any>;

  // Update methods (only available in dev)
  abstract updateBreaker(
    busId: string, 
    panelId: string, 
    breakerId: string, 
    updatedBreaker: Breaker
  ): Observable<Breaker>;
}