import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private readonly DATA_PATH = 'assets/data/drawings.json';
  private cachedData$: Observable<any>;

  constructor(private http: HttpClient) {
    this.cachedData$ = this.loadData().pipe(shareReplay(1));
  }

  private loadData(): Observable<any> {
    return this.http.get(this.DATA_PATH).pipe(
      catchError((error) => {
        console.error('Failed to load local data:', error);
        return of({ sections: [] }); // Return empty data structure if file fails to load
      })
    );
  }

  // Public methods
  getSections(): Observable<any[]> {
    return this.cachedData$.pipe(
      map(data => data?.sections || [])
    );
  }

  getSection(sectionId: string): Observable<any> {
    return this.cachedData$.pipe(
      map(data => data?.sections?.find((s: any) => s.id === sectionId))
    );
  }

  getBreaker(breakerId: string): Observable<any> {
    return this.cachedData$.pipe(
      map(data => {
        if (!data?.sections) return undefined;
        
        for (const section of data.sections) {
          for (const bus of section.buses || []) {
            for (const panel of bus.panels || []) {
              const breaker = panel.breakers?.find((b: any) => b.id === breakerId);
              if (breaker) return breaker;
            }
          }
        }
        return undefined;
      })
    );
  }

  refreshData(): void {
    this.cachedData$ = this.loadData().pipe(shareReplay(1));
  }
}