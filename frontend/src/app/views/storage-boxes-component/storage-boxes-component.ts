import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { StorageBox } from '../../relations/storage-box';
import { StorageBoxService } from '../../services/storage-box-service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-storage-boxes-component',
  imports: [RouterLink, MatTableModule],
  templateUrl: './storage-boxes-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './storage-boxes-component.css',
})
export class StorageBoxesComponent implements OnInit {
  dataSource: StorageBox[] = [];
  elementCount: number = -1;
  table: string = 'no-table';
  page: number = 0;
  entriesPerPage: number = 64;
  protected readonly Math = Math;

  displayedColumns: string[] = ['id', 'place', 'item-type'];

  constructor(
    private storageBoxService: StorageBoxService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.storageBoxService
      .getStorageBoxes(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        console.log(value);
      });
    // TODO: Replace with return item, that also gives the entity count back
    this.storageBoxService
      .count()
      .pipe(take(1))
      .subscribe(
        (value) => {
          this.table = value.table;
          this.elementCount = value.count;
        },
        (error) => {
          console.error('Failed to load storage box count:', error);
        },
      );
  }
}
