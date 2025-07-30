import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreakerComponent } from '../breaker/breaker.component';
import { Bus } from '../../models/bus.model';

@Component({
  selector: 'app-bus',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule, BreakerComponent],
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.css']
})
export class BusComponent {
  @Input() bus!: Bus;
}