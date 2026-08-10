import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { StorageBox } from '../../relations/storage-box';
import { StorageBoxService } from '../../services/storage-box-service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-storage-boxes-component',
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginator,
    MatProgressSpinner,
    NgClass,
    MatButton,
    MatIcon,
  ],
  templateUrl: './storage-boxes-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './storage-boxes-component.css',
})
export class StorageBoxesComponent implements OnInit {
  dataSource: StorageBox[] = [];
  elementCount: number = -1;
  page: number = 0;
  entriesPerPage: number = 25;
  loaded: boolean = false;

  displayedColumns: string[] = ['id', 'place'];

  constructor(
    private storageBoxService: StorageBoxService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.updateTableContent();
  }

  updateTableContent() {
    this.loaded = false;
    this.storageBoxService
      .getStorageBoxes(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        // TODO: Replace with return item, that also gives the entity count back
        this.storageBoxService
          .count()
          .pipe(take(1))
          .subscribe(
            (value) => {
              this.elementCount = value.count;
              this.loaded = true;
            },
            (error) => {
              console.error('Failed to load storage box count:', error);
            },
          );
      });
  }

  openStorageBoxEntry(storageBox: StorageBox) {
    this.router.navigateByUrl('/storage-box/' + storageBox.id);
  }
}
