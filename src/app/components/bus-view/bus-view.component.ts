import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DrawingService } from '../../services/drawing.service';
import { BreakerComponent } from '../breaker/breaker.component';

@Component({
  selector: 'app-bus-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule, BreakerComponent],
  templateUrl: './bus-view.component.html',
  styleUrls: ['./bus-view.component.css']
})
export class BusViewComponent implements OnInit {
  section: any;

  constructor(
    private route: ActivatedRoute,
    private drawingService: DrawingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.section = this.drawingService.getSection(params['id']);
    });
  }
}