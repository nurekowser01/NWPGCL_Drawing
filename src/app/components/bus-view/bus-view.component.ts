import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DrawingService } from '../../services/drawing.service';
import { BreakerComponent } from '../breaker/breaker.component';
import { Panel  } from '../../models/panel.model'; // Make sure to import your interfaces
import { Section } from '../../models/section.model';
import { Bus,  } from '../../models/bus.model'; // Make sure to import your interfaces
import { Breaker  } from '../../models/breaker.model'; // Make sure to import your interfaces

@Component({
  selector: 'app-bus-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    BreakerComponent,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './bus-view.component.html',
  styleUrls: ['./bus-view.component.css']
})
export class BusViewComponent implements OnInit {
  section: Section | undefined;
  busId: string = '';
  searchControl = new FormControl('');
  filteredBuses: Bus[] = [];
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private drawingService: DrawingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.busId = params['id'];
      this.drawingService.getSection(this.busId).subscribe(section => {
        this.section = section;
        this.filteredBuses = section?.buses ? [...section.buses] : [];
      });
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term || '';
      this.filterBreakers();
    });
  }

  filterBreakers() {
    if (!this.section || !this.section.buses) {
      this.filteredBuses = [];
      return;
    }

    if (!this.searchTerm) {
      this.filteredBuses = [...this.section.buses];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredBuses = this.section.buses
      .map((bus: Bus) => {
        const filteredBus = { ...bus };
        filteredBus.panels = bus.panels
          ?.map((panel: Panel) => {
            const filteredPanel = { ...panel };
            filteredPanel.breakers = panel.breakers
              ?.filter((breaker: Breaker) => 
                breaker.id.toLowerCase().includes(searchTermLower) ||
                breaker.description.toLowerCase().includes(searchTermLower) ||
                (breaker.drawingNumber && breaker.drawingNumber.toLowerCase().includes(searchTermLower))
              ) || [];
            return filteredPanel;
          })
          .filter((panel: Panel) => panel.breakers?.length ?? 0 > 0) || [];
        return filteredBus;
      })
      .filter((bus: Bus) => bus.panels?.length ?? 0 > 0);
  }
}

