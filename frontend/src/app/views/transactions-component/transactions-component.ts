import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { Transaction } from '../../relations/transaction';
import { TransactionService } from '../../services/transaction-service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-transactions-component',
  imports: [RouterLink, MatTableModule],
  templateUrl: './transactions-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './transactions-component.css',
})
export class TransactionsComponent implements OnInit {
  dataSource: Transaction[] = [];
  elementCount: number = -1;
  table: string = 'no-table';
  page: number = 0;
  entriesPerPage: number = 64;
  protected readonly Math = Math;

  displayedColumns: string[] = ['id', 'allocation', 'item-delta', 'date'];

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.params['page'] ?? 0;

    this.transactionService
      .getTransactions(this.entriesPerPage, this.page)
      .pipe(take(1))
      .subscribe((value) => {
        this.dataSource = value;
        console.log(value);
      });
    // TODO: Replace with return item, that also gives the entity count back
    this.transactionService
      .count()
      .pipe(take(1))
      .subscribe(
        (value) => {
          this.table = value.table;
          this.elementCount = value.count;
        },
        (error) => {
          console.error('Failed to load transaction count:', error);
        },
      );
  }
}
