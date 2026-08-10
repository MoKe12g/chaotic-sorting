import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { Transaction } from '../../relations/transaction';
import { TransactionService } from '../../services/transaction-service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-transactions-component',
  imports: [RouterLink, MatTableModule, MatPaginator, MatProgressSpinner],
  templateUrl: './transactions-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './transactions-component.css',
})
export class TransactionsComponent implements OnInit {
  dataSource: Transaction[] = [];
  elementCount: number = -1;
  page: number = 0;
  entriesPerPage: number = 25;
  loaded: boolean = false;

  displayedColumns: string[] = ['id', 'allocation', 'item-delta', 'date'];

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.updateTableContent();
  }

  updateTableContent() {
    this.loaded = false;
    this.transactionService
      .getTransactions(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        // TODO: Replace with return item, that also gives the entity count back
        this.transactionService
          .count()
          .pipe(take(1))
          .subscribe(
            (value) => {
              this.elementCount = value.count;
              this.loaded = true;
            },
            (error) => {
              console.error('Failed to load transaction count:', error);
            },
          );
      });
  }
}
