import {
  Component,
  ChangeDetectionStrategy,
  Input,
  numberAttribute,
  OnInit,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { AllocationService } from '../../services/allocation-service';
import { Allocation } from '../../relations/allocation';
import { first, firstValueFrom, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { StorageBox } from '../../relations/storage-box';
import { StorageBoxService } from '../../services/storage-box-service';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-allocation-overview-component',
  imports: [MatGridList, MatProgressSpinner, MatPaginator, MatGridTile],
  templateUrl: './allocation-overview-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './allocation-overview-component.css',
})
export class AllocationOverviewComponent implements OnInit, AfterViewInit {
  @Input({ required: true, transform: numberAttribute })
  allocationId!: number;

  allocations: Allocation[] = [];

  colCount: number = -1;
  itemsPerPage: number = 25;
  page: number = 0;

  loaded: boolean = false;

  // Hidden storage boxes
  _storageBoxes: StorageBox[] = [];
  // Shown storage boxes
  storageBoxes: StorageBox[] = [];

  get storageBoxCount() {
    return this._storageBoxes.length;
  }

  constructor(
    private allocationService: AllocationService,
    private route: ActivatedRoute,
    private router: Router,
    private storageBoxService: StorageBoxService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.allocationId = this.route.snapshot.params['id'] ?? 0;
    const allocation: Allocation = await firstValueFrom(
      this.allocationService.getAllocation(this.allocationId),
    );
    this.allocations = await firstValueFrom(
      this.allocationService.getAllocations(1024, 0, undefined, undefined, allocation.description),
    );

    // Ech schlechter Code vorraus, aber bestimmt lustig anzusehen
    this.allocations.forEach(async (allocation) => {
      this._storageBoxes.push(
        await firstValueFrom(this.storageBoxService.getStorageBox(allocation.storage_box_id)),
      );
      if (this.allocations.length == this._storageBoxes.length) {
        this.cleanUpStorageBoxes();
        await this.updateGridListContent();
        this.loaded = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.colCount = Math.round(window.innerWidth / 200);
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: any) {
    this.colCount = Math.round(window.innerWidth / 200);
    this.updateGridListContent();
  }

  async updateGridListContent() {
    this.storageBoxes = this._storageBoxes.slice(
      this.page * this.itemsPerPage,
      this.page + 1 * this.itemsPerPage,
    );
  }

  handlePageEvent(e: PageEvent) {
    this.itemsPerPage = e.pageSize;
    this.page = e.pageIndex;
    this.updateGridListContent();
  }

  onStorageBoxClick(storageBoxId: number) {
    this.router.navigateByUrl('/v2/storage_box/' + storageBoxId);
  }

  cleanUpStorageBoxes() {
    this._storageBoxes.sort((sb) => sb.id);
    for (let i = 1; i < this._storageBoxes.length; i++) {
      while (
        i < this._storageBoxes.length &&
        (this._storageBoxes[i].id = this._storageBoxes[i - 1].id)
      ) {
        this._storageBoxes.splice(i);
      }
    }
  }
}
