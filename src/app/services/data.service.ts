import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, switchMap, delay } from 'rxjs/operators';
import { Breaker } from '../models/breaker.model';
import { Bus } from '../models/bus.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    private readonly GITHUB_API = 'https://api.github.com';
  private readonly REPO = 'nurekowser01/NWPGCL_Drawing';
  private readonly TOKEN = environment.github.token; // Changed to use environment

  private readonly FILE_PATH = 'src/assets/data/drawings.json';
  private dataVersion = 0;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    if (!this.TOKEN) {
      console.error('GitHub token not configured');
      throw new Error('API authentication failed');
    }
    return {
      'Authorization': `Bearer ${this.TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }

  updateBreaker(busId: string, panelId: string, breakerId: string, updatedBreaker: Breaker): Observable<Breaker> {
    return this.getFileWithSha().pipe(
      switchMap(fileData => {
        if (!fileData) {
          return throwError(() => new Error('Failed to get file data'));
        }

        const currentData = JSON.parse(fileData.content);
        
        // Find and update the breaker
        const section = currentData.sections.find((s: any) => 
          s.buses.some((b: Bus) => b.id === busId));
        const bus = section?.buses.find((b: Bus) => b.id === busId);
        const panel = bus?.panels.find((p: any) => p.id === panelId);
        const breaker = panel?.breakers.find((b: Breaker) => b.id === breakerId);

        if (!breaker) {
          return throwError(() => new Error('Breaker not found'));
        }

        // Update the breaker
        breaker.manufacturerDrawing = updatedBreaker.manufacturerDrawing;
        breaker.asBuiltDrawing = updatedBreaker.asBuiltDrawing;

        return this.updateFileWithRetry(
          JSON.stringify(currentData, null, 2),
          fileData.sha,
          `Updated breaker ${breakerId} in panel ${panelId}`
        ).pipe(
          map(() => breaker)
        );
      }),
      retry(2),
      catchError(error => {
        console.error('Update failed:', this.sanitizeError(error));
        return throwError(() => new Error('Update failed. Please try again.'));
      })
    );
  }

  private getFileWithSha(): Observable<{content: string, sha: string}> {
    if (!this.validateToken()) {
      return throwError(() => new Error('Invalid GitHub token'));
    }

    const url = `${this.GITHUB_API}/repos/${this.REPO}/contents/${this.FILE_PATH}`;
    
    return this.http.get<{content: string, sha: string}>(url, {
      headers: this.getHeaders(),
      params: { ref: 'master', t: Date.now() }
    }).pipe(
      map(response => ({
        content: this.decodeContent(response.content),
        sha: response.sha
      })),
      catchError(error => {
        console.error('Fetch failed:', this.sanitizeError(error));
        return throwError(() => error);
      })
    );
  }

  private updateFileWithRetry(content: string, sha: string, message: string, attempt = 1): Observable<void> {
    return this.updateFile(content, sha, message).pipe(
      catchError(error => {
        if (this.isConflictError(error) && attempt < 3) {
          return this.getFileWithSha().pipe(
            delay(300),
            switchMap(fileData => {
              if (!fileData) {
                return throwError(() => new Error('Failed to get file data for retry'));
              }
              return this.updateFileWithRetry(content, fileData.sha, message, attempt + 1);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private updateFile(content: string, sha: string, message: string): Observable<void> {
    const url = `${this.GITHUB_API}/repos/${this.REPO}/contents/${this.FILE_PATH}`;
    return this.http.put<void>(url, {
      message,
      content: this.encodeContent(content),
      sha,
      branch: 'master'
    }, {
      headers: this.getHeaders()
    });
  }

  // Helper methods
  private validateToken(): boolean {
    return !!this.TOKEN && this.TOKEN !== '##GITHUB_TOKEN##';
  }

  

  private decodeContent(content: string): string {
    return atob(content.replace(/\s/g, ''));
  }

  private encodeContent(content: string): string {
    return btoa(unescape(encodeURIComponent(content)));
  }

  private isConflictError(error: any): boolean {
    return error?.status === 409;
  }

  private sanitizeError(error: any): any {
    const sanitized = {...error};
    if (sanitized.headers?.Authorization) {
      sanitized.headers.Authorization = '***REDACTED***';
    }
    return sanitized;
  }
}