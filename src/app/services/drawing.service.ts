import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { GITHUB_CONFIG } from '../github.config';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private readonly GITHUB_API = GITHUB_CONFIG.api;
  private readonly REPO = GITHUB_CONFIG.repo;
  private readonly TOKEN = GITHUB_CONFIG.token;
  private readonly FILE_PATH = 'src/assets/data/drawings.json';
  private cachedData$: Observable<any>;

  constructor(private http: HttpClient) {
    this.cachedData$ = this.loadData().pipe(shareReplay(1));
  }

  private loadData(): Observable<any> {
    if (!this.validateToken()) {
      console.warn('Using local fallback - no valid token');
      return this.getLocalFallback();
    }

    return this.http.get(`${this.GITHUB_API}/repos/${this.REPO}/contents/${this.FILE_PATH}`, {
      headers: this.getHeaders()
    }).pipe(
      map((response: any) => {
        try {
          return JSON.parse(this.decodeContent(response.content));
        } catch (e) {
          throw new Error('Failed to parse response');
        }
      }),
      catchError(error => {
        console.error('GitHub load failed:', this.sanitizeError(error));
        return this.getLocalFallback();
      })
    );
  }

  private getLocalFallback(): Observable<any> {
    return this.http.get('assets/data/drawings.json').pipe(
      catchError(() => of({ sections: [] }))
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

  // Helper methods
  private validateToken(): boolean {
    return !!this.TOKEN && this.TOKEN !== '##GITHUB_TOKEN##';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }

  private decodeContent(content: string): string {
    return atob(content.replace(/\s/g, ''));
  }

  private sanitizeError(error: any): any {
    const sanitized = {...error};
    if (sanitized.headers?.Authorization) {
      sanitized.headers.Authorization = '***REDACTED***';
    }
    return sanitized;
  }
}