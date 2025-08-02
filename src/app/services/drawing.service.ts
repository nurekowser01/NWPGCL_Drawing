import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import drawingsData from '../../assets/data/drawings.json';

// Import models (create these interfaces in src/models)
import { Bus } from '../models/bus.model';
import { Panel } from '../models/panel.model';
import { Section } from '../models/section.model';

import { Breaker } from '../models/breaker.model';


@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private cachedData$: Observable<{ sections: Section[] }>;

  constructor() {
    this.cachedData$ = of({ sections: drawingsData.sections }).pipe(
      shareReplay(1)
    );
  }

  getSection(sectionId: string): Observable<Section | undefined> {
    return this.cachedData$.pipe(
      map(data => data.sections.find(s => s.id === sectionId))
    );
  }

  getBus(busId: string): Observable<Bus | undefined> {
    return this.cachedData$.pipe(
      map(data => {
        for (const section of data.sections) {
          const foundBus = section.buses?.find(b => b.id === busId);
          if (foundBus) return foundBus;
        }
        return undefined;
      })
    );
  }

  getPanel(panelId: string): Observable<Panel | undefined> {
    return this.cachedData$.pipe(
      map(data => {
        for (const section of data.sections) {
          for (const bus of section.buses || []) {
            const foundPanel = bus.panels?.find(p => p.id === panelId);
            if (foundPanel) return foundPanel;
          }
        }
        return undefined;
      })
    );
  }

  getBreaker(breakerId: string): Observable<Breaker | undefined> {
    return this.cachedData$.pipe(
      map(data => {
        for (const section of data.sections) {
          for (const bus of section.buses || []) {
            for (const panel of bus.panels || []) {
              const foundBreaker = panel.breakers?.find(b => b.id === breakerId);
              if (foundBreaker) return foundBreaker;
            }
          }
        }
        return undefined;
      })
    );
  }
}