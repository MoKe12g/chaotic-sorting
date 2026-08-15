import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AllocationService } from '../../services/allocation-service';
import { StorageBoxService } from '../../services/storage-box-service';
import { TransactionService } from '../../services/transaction-service';
import { MatButton } from '@angular/material/button';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Allocation } from '../../relations/allocation';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-component',
  imports: [MatButton, MatGridList, MatProgressSpinner, MatGridTile, MatInput, MatPaginator],
  templateUrl: './dashboard-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  protected storageBoxCount: number = -1;
  protected transactionCount: number = -1;
  protected allocationCount: number = -1;

  protected itemsPerPage: number = 50;
  protected page: number = 0;
  protected allocations: Allocation[] = [];

  protected colCount: number = -1;

  constructor(
    private allocationService: AllocationService,
    private storageBoxService: StorageBoxService,
    private transactionService: TransactionService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.colCount = Math.round(window.innerWidth / 200);
    console.log(this.colCount);
    console.log(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: any) {
    this.colCount = Math.round(window.innerWidth / 200);
    console.log(this.colCount);
    console.log(window.innerWidth);
  }

  async ngOnInit() {
    // TODO: only one item per description, because same description => same item
    this.updateGridListContent();

    this.storageBoxCount = (await firstValueFrom(this.storageBoxService.count())).count;
    this.transactionCount = (await firstValueFrom(this.transactionService.count())).count;
  }

  async updateGridListContent() {
    console.log('done it');
    this.allocations = await firstValueFrom(
      this.allocationService.getAllocations(this.itemsPerPage, this.page),
    );
    this.allocationCount = (await firstValueFrom(this.allocationService.count())).count;
  }

  handlePageEvent(e: PageEvent) {
    this.itemsPerPage = e.pageSize;
    this.page = e.pageIndex;
    this.updateGridListContent();
  }

  onAllocationClick(allocationId: number) {
    this.router.navigateByUrl('/v2/allocation/' + allocationId);
  }
}
