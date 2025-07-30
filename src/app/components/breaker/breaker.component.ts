import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Breaker } from '../../models/breaker.model';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-breaker',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,MatIconModule],
  templateUrl: './breaker.component.html',
  styleUrls: ['./breaker.component.css']
})
export class BreakerComponent {
  @Input() breaker!: Breaker;
}