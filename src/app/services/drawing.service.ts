import { Injectable } from '@angular/core';
import drawingsData from '../../assets/data/drawings.json';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private data = drawingsData;

  getSections() {
    return this.data.sections;
  }

  getSection(sectionId: string) {
    return this.data.sections.find(s => s.id === sectionId);
  }

  getBreaker(breakerId: string) {
    for (const section of this.data.sections) {
      for (const bus of section.buses) {
        for (const panel of bus.panels) {
          const breaker = panel.breakers.find(b => b.id === breakerId);
          if (breaker) return breaker;
        }
      }
    }
    return undefined;
  }
}