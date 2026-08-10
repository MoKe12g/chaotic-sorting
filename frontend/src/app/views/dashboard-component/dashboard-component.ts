import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EntriesCount } from '../../returns/entries-count';
import { take } from 'rxjs';
import { AllocationService } from '../../services/allocation-service';
import { StorageBoxService } from '../../services/storage-box-service';
import { TransactionService } from '../../services/transaction-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
  templateUrl: './dashboard-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  protected storageBoxCount: number = -1;
  protected transactionCount: number = -1;
  protected allocationCount: number = -1;

  constructor(
    private allocationService: AllocationService,
    private storageBoxService: StorageBoxService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    this.allocationService
      .count()
      .pipe(take(1))
      .subscribe((counter: EntriesCount) => {
        this.allocationCount = counter.count;
      });
    this.storageBoxService
      .count()
      .pipe(take(1))
      .subscribe((counter: EntriesCount) => {
        this.storageBoxCount = counter.count;
      });
    this.transactionService
      .count()
      .pipe(take(1))
      .subscribe((counter: EntriesCount) => {
        this.transactionCount = counter.count;
      });
  }
}
