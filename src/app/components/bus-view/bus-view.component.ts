// bus-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DrawingService } from '../../services/drawing.service';
import { BreakerComponent } from '../breaker/breaker.component';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'app-bus-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule, BreakerComponent, PanelComponent],
  templateUrl: './bus-view.component.html',
  styleUrls: ['./bus-view.component.css']
})
export class BusViewComponent implements OnInit {
  section: any;
  busId: string = '';

  constructor(
    private route: ActivatedRoute,
    private drawingService: DrawingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.busId = params['id'];
      this.drawingService.getSection(this.busId).subscribe(section => {
        this.section = section;
      });
    });
  }
}