import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Bus } from '../models/bus.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data/drawings.json';

  constructor(private http: HttpClient) { }

  getBuses(): Observable<{ buses: Bus[] }> {
    return this.http.get<{ buses: Bus[] }>(this.dataUrl);
  }

  getBus(busId: string): Observable<Bus | undefined> {
    return this.http.get<{ buses: Bus[] }>(this.dataUrl).pipe(
      map(data => data.buses.find(bus => bus.id === busId))
    );
  }
}