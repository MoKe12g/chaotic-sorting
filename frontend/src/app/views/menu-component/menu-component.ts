import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-component',
  imports: [RouterLink],
  templateUrl: './menu-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './menu-component.css',
})
export class MenuComponent {}
