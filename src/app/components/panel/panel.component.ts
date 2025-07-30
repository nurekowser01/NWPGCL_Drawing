import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakerComponent } from '../breaker/breaker.component';
import { Panel } from '../../models/panel.model';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, BreakerComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {
  @Input() panel!: Panel;
}