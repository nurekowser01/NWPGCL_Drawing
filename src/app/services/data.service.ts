import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, switchMap, delay } from 'rxjs/operators';
import { Breaker } from '../models/breaker.model';
import { Bus } from '../models/bus.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
private readonly GITHUB_API = (window as any).GITHUB_API || 'https://api.github.com';
  private readonly REPO = (window as any).GITHUB_REPO || 'nurekowser01/NWPGCL_Drawing';
  private readonly TOKEN = (window as any).GITHUB_TOKEN || '';
  private readonly FILE_PATH = 'src/assets/data/drawings.json';
  private dataVersion = 0;


  constructor(private http: HttpClient) { }

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

        // Prepare the update with retry logic
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
        console.error('Failed to update breaker:', error);
        return throwError(() => new Error('Could not update breaker. Please refresh and try again.'));
      })
    );
  }

  private getFileWithSha(): Observable<{content: string, sha: string}> {
    const url = `${this.GITHUB_API}/repos/${this.REPO}/contents/${this.FILE_PATH}?ref=master&t=${Date.now()}`;
    
    return this.http.get<{content: string, sha: string}>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        content: atob(response.content.replace(/\s/g, '')),
        sha: response.sha
      })),
      catchError(error => {
        console.error('Failed to get file with SHA:', error);
        return throwError(() => error);
      })
    );
  }

  private updateFileWithRetry(content: string, originalSha: string, message: string, attempt = 1): Observable<void> {
    return this.updateFile(content, originalSha, message).pipe(
      catchError(error => {
        if (this.isConflictError(error) && attempt < 3) {
          // SHA mismatch - get fresh version and retry
          return this.getFileWithSha().pipe(
            delay(300), // Small delay between retries
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
      content: btoa(unescape(encodeURIComponent(content))),
      sha,
      branch: 'master'
    }, {
      headers: this.getHeaders()
    });
  }

  private isConflictError(error: any): boolean {
    return error && error.status === 409;
  }

  private getHeaders() {

    // console.log('Using tokens:', environment.github.token ? '***' + environment.github.token.slice(-4) : 'No token');

    console.log('Using tokens1:', environment.github.token );

    return {
      'Authorization': `token ${this.TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }
}