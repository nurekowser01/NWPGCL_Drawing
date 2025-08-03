// breaker.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Breaker } from '../../models/breaker.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditBreakerDialogComponent } from '../edit-breaker/edit-breaker-dialog.component';
import { DataService } from '../../services/data.service'; // Now using abstract class

@Component({
  selector: 'app-breaker',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './breaker.component.html',
  styleUrls: ['./breaker.component.css']
})
export class BreakerComponent {
  @Input() breaker!: Breaker;
  @Input() busId!: string;
  @Input() panelId!: string;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  editBreaker(): void {
  const dialogRef = this.dialog.open(EditBreakerDialogComponent, {
    width: '500px',
    data: { breaker: {...this.breaker} }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.dataService.updateBreaker(
        this.busId,
        this.panelId,
        this.breaker.id,
        result
      ).subscribe({
        next: (updatedBreaker) => {
          this.breaker = updatedBreaker;
        },
        error: (error) => {
          console.error('Update failed:', error);
          
        }
      });
    }
  });
}
}