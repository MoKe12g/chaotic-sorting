import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ItemType } from '../../relations/item-type';
import { ItemTypeService } from '../../services/item-type-service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-item-types-component',
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginator,
    MatProgressSpinner,
    NgClass,
    MatButton,
    MatIcon,
  ],
  templateUrl: './item-types-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './item-types-component.css',
})
export class ItemTypesComponent implements OnInit {
  dataSource: ItemType[] = [];
  elementCount: number = -1;
  page: number = 0;
  entriesPerPage: number = 25;
  loaded: boolean = false;

  displayedColumns: string[] = ['id', 'storage-property'];

  constructor(
    private itemTypeService: ItemTypeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.updateTableContent();
  }

  updateTableContent() {
    this.loaded = false;
    this.itemTypeService
      .getItemTypes(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        // TODO: Replace with return item, that also gives the entity count back
        this.itemTypeService
          .count()
          .pipe(take(1))
          .subscribe(
            (value) => {
              this.elementCount = value.count;
              this.loaded = true;
            },
            (error) => {
              console.error('Failed to load item-type count:', error);
            },
          );
      });
  }

  openItemTypeEntry(itemType: ItemType) {
    this.router.navigateByUrl('/item-type/' + itemType.id);
  }
}
