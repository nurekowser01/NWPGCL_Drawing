// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Breaker } from '../models/breaker.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  protected readonly FILE_PATH = 'src/assets/data/drawings.json';

  constructor(protected http: HttpClient) {}

  // Read methods (available in all environments)
  getData(): Observable<any> {
    return this.http.get(this.FILE_PATH);
  }
  // Update methods (only available in dev)
  updateBreaker(
      busId: string,
      panelId: string,
      breakerId: string,
      updatedBreaker: Breaker
    ): Observable<Breaker> {
      return throwError(() => new Error('Updates disabled in production'));
    }
}