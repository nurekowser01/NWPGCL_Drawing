import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MatSidenavModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Define the sidebarOpen property

  sections = [
    { id: 'steam-turbine', name: 'Steam Turbine', icon: 'water_drop' },
        { id: 'gas-turbine', name: 'Gas Turbine', icon: 'gas_meter' },

    // Add more sections as needed
    { id: 'transformers', name: 'Transformers', icon: 'bolt' },
    { id: 'switchgear', name: 'Switchgear', icon: 'power' },
    { id: 'cables', name: 'Cables', icon: 'cable' }
  ];

  // Optional: Add toggle function

}