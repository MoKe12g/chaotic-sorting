import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../relations/category';
import { take } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-categories-component',
  imports: [RouterLink, MatTableModule],
  templateUrl: './categories-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './categories-component.css',
})
export class CategoriesComponent implements OnInit {
  dataSource: Category[] = [];
  elementCount: number = -1;
  table: string = 'no-table';
  page: number = 0;
  entriesPerPage: number = 64;
  protected readonly Math = Math;

  displayedColumns: string[] = ['id', 'comment'];

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.categoryService
      .getCategories(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        console.log(value);
      });
    // TODO: Replace with return item, that also gives the entity count back
    this.categoryService
      .count()
      .pipe(take(1))
      .subscribe(
        (value) => {
          this.table = value.table;
          this.elementCount = value.count;
        },
        (error) => {
          console.error('Failed to load category count:', error);
        },
      );
  }
}
