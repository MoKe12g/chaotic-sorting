import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../relations/category';
import { take } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-categories-component',
  imports: [RouterLink, MatTableModule, MatPaginator, MatProgressSpinner],
  templateUrl: './categories-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './categories-component.css',
})
export class CategoriesComponent implements OnInit {
  dataSource: Category[] = [];
  elementCount: number = -1;
  page: number = 0;
  entriesPerPage: number = 25;
  loaded: boolean = false;

  displayedColumns: string[] = ['id', 'comment'];

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.updateTableContent();
  }

  updateTableContent() {
    this.loaded = false;
    this.categoryService
      .getCategories(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        // TODO: Replace with return item, that also gives the entity count back
        this.categoryService
          .count()
          .pipe(take(1))
          .subscribe(
            (value) => {
              this.elementCount = value.count;
              this.loaded = true;
            },
            (error) => {
              console.error('Failed to load category count:', error);
            },
          );
      });
  }
}
