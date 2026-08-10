import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ItemType } from '../../relations/item-type';
import { ItemTypeService } from '../../services/item-type-service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-item-types-component',
  imports: [RouterLink, MatTableModule],
  templateUrl: './item-types-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './item-types-component.css',
})
export class ItemTypesComponent implements OnInit {
  dataSource: ItemType[] = [];
  elementCount: number = -1;
  table: string = 'no-table';
  page: number = 0;
  entriesPerPage: number = 64;
  protected readonly Math = Math;

  displayedColumns: string[] = ['id', 'storage-property'];

  constructor(
    private itemTypeService: ItemTypeService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.itemTypeService
      .getItemTypes(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        console.log(value);
      });
    // TODO: Replace with return item, that also gives the entity count back
    this.itemTypeService
      .count()
      .pipe(take(1))
      .subscribe(
        (value) => {
          this.table = value.table;
          this.elementCount = value.count;
        },
        (error) => {
          console.error('Failed to load item-type count:', error);
        },
      );
  }
}
