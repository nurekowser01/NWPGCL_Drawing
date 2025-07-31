// edit-breaker-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Breaker } from '../../models/breaker.model';

@Component({
  selector: 'app-edit-breaker-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Edit Breaker Drawings</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Manufacturer Drawing</mat-label>
        <input matInput [(ngModel)]="data.breaker.manufacturerDrawing">
      </mat-form-field>
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>As Built Drawing</mat-label>
        <input matInput [(ngModel)]="data.breaker.asBuiltDrawing">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSave()">Save</button>
    </div>
  `,
  styles: [`
    .w-full {
      width: 100%;
    }
  `]
})
export class EditBreakerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditBreakerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { breaker: Breaker }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data.breaker);
  }
}