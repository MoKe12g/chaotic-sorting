import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { Allocation } from '../../relations/allocation';
import { AllocationService } from '../../services/allocation-service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-allocations-component',
  imports: [RouterLink, MatTableModule],
  templateUrl: './allocations-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './allocations-component.css',
})
export class AllocationsComponent implements OnInit {
  dataSource: Allocation[] = [];
  elementCount: number = -1;
  table: string = 'no-table';
  page: number = 0;
  entriesPerPage: number = 64;
  protected readonly Math = Math;

  displayedColumns: string[] = [
    'id',
    'description',
    'date',
    'can-be-outside',
    'category',
    'storage-box',
  ];

  constructor(
    private allocationService: AllocationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.allocationService
      .getAllocations(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        console.log(value);
      });
    // TODO: Replace with return item, that also gives the entity count back
    this.allocationService
      .count()
      .pipe(take(1))
      .subscribe(
        (value) => {
          this.table = value.table;
          this.elementCount = value.count;
        },
        (error) => {
          console.error('Failed to load allocation count:', error);
        },
      );
  }
}
