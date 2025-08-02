import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {

 private readonly GITHUB_API = (window as any).GITHUB_API || 'https://api.github.com';
  private readonly REPO = (window as any).GITHUB_REPO || 'nurekowser01/NWPGCL_Drawing';
  private readonly FILE_PATH = 'src/assets/data/drawings.json';
    private readonly TOKEN = (window as any).GITHUB_TOKEN || '';

  private dataVersion = 0;

  private cachedData$!: Observable<any>; // Definite assignment assertion

  constructor(private http: HttpClient) {
    this.cachedData$ = this.loadData(); // Initialize in constructor
  }

  private loadData(): Observable<any> {
    return this.http.get(`${this.GITHUB_API}/repos/${this.REPO}/contents/${this.FILE_PATH}`, {
      headers: this.getHeaders()
    }).pipe(
      map((response: any) => {
        const content = atob(response.content.replace(/\s/g, ''));
        return JSON.parse(content);
      }),
      shareReplay(1), // Cache the latest data
      catchError(error => {
        console.error('Failed to load from GitHub, using fallback:', error);
        return this.getLocalFallback();
      })
    );
  }

  private getLocalFallback(): Observable<any> {
    return this.http.get('assets/data/drawings.json').pipe(
      catchError(() => of({ sections: [] })) // Empty fallback
    );
  }

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
    this.cachedData$ = this.loadData();
  }

  private getHeaders() {
    console.log('Using tokens1:', this.TOKEN );

    return {
      'Authorization': `token ${this.TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }
}