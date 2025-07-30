import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Breaker } from '../../models/breaker.model';

@Component({
  selector: 'app-breaker',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './breaker.component.html',
  styleUrls: ['./breaker.component.css']
})
export class BreakerComponent {
  @Input() breaker!: Breaker;
}