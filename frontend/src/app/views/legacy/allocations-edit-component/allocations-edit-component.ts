import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { Allocation } from '../../../relations/allocation';
import { AllocationService } from '../../../services/allocation-service';

@Component({
  selector: 'app-allocations-edit-component',
  imports: [FormsModule, MatInput, MatButton, MatCheckbox, MatFormField],
  templateUrl: './allocations-edit-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './allocations-edit-component.css',
})
export class AllocationsEditComponent implements OnInit {
  allocationId: number = -1;
  allocation: Allocation;

  constructor(
    private allocationService: AllocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.allocation = new (class implements Allocation {
      description: string = '';
      date_of_entry: Date = new Date();
      can_be_outside?: boolean = false;
      storage_box_id: number = -1;
      id = -1;
    })();
  }

  ngOnInit(): void {
    this.allocationId = this.route.snapshot.params['id'];
    if (this.allocationId != -1) {
      this.getAllocation(this.allocationId);
    }
    console.log('Allocation ID:', this.allocationId);
  }

  getAllocation(allocationId: number) {
    this.allocationService
      .getAllocation(allocationId)
      .pipe(take(1))
      .subscribe((response) => {
        this.allocation = response;
        console.log('replaced the allocation');
      });
  }

  logContent() {
    console.log(this.allocation.description);
  }

  postAllocation() {
    this.allocationService
      .postAllocation(this.allocation)
      .pipe(take(1))
      .subscribe({
        error: (e) => alert(e.message),
        next: (response) => {
          alert('HTTP Patch Request completed');
          this.allocation = response;
          this.router.navigate(['/allocation/' + response.id]).then((r) => {
            if (!r) {
              alert("Redirection to allocation page didn't work.");
            }
          });
        },
      });
  }

  patchAllocation() {
    this.allocationService
      .patchAllocation(this.allocation)
      .pipe(take(1))
      .subscribe({
        error: (e) => alert(e.message),
        next: (response) => {
          alert('HTTP Patch Request completed');
          this.allocation = response;
        },
      });
  }

  deleteAllocation() {
    this.allocationService
      .deleteAllocation(this.allocation.id)
      .pipe(take(1))
      .subscribe({
        error: (e) => alert(e.message),
        next: (response) => {
          alert('HTTP Patch Request completed');
          this.router.navigate(['/allocations']).then((r) => {
            if (!r) {
              alert("Redirection to allocations page didn't work.");
            }
          });
        },
      });
  }
}
