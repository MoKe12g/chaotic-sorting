import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Allocation } from '../../../relations/allocation';
import { AllocationService } from '../../../services/allocation-service';

@Component({
  selector: 'app-allocations-component',
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginator,
    MatProgressSpinner,
    NgClass,
    MatButton,
    MatIcon,
  ],
  templateUrl: './allocations-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './allocations-component.css',
})
export class AllocationsComponent implements OnInit {
  dataSource: Allocation[] = [];
  elementCount: number = -1;
  page: number = 0;
  entriesPerPage: number = 25;
  loaded: boolean = false;

  displayedColumns: string[] = ['id', 'description', 'date', 'can-be-outside', 'storage-box'];

  constructor(
    private allocationService: AllocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.updateTableContent();
  }

  updateTableContent() {
    this.loaded = false;
    this.allocationService
      .getAllocations(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        // TODO: Replace with return item, that also gives the entity count back
        this.allocationService
          .count()
          .pipe(take(1))
          .subscribe(
            (value) => {
              this.elementCount = value.count;
              this.loaded = true;
            },
            (error) => {
              console.error('Failed to load allocation count:', error);
            },
          );
      });
  }

  openAllocationEntry(allocation: Allocation) {
    this.router.navigateByUrl('/allocation/' + allocation.id);
  }
}
