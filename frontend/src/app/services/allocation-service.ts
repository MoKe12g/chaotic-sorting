import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntriesCount } from '../returns/entries-count';
import { Allocation } from '../relations/allocation';

@Injectable({
  providedIn: 'root',
})
export class AllocationService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // get
  getAllocation(id: number): Observable<Allocation> {
    return this.http.get<Allocation>(this.apiUrl + '/allocations/' + id);
  }

  // filtered and paginated
  getAllocations(
    limit: number,
    page: number,
    storage_box_id?: number,
    can_be_outside?: boolean,
    description?: string,
  ): Observable<Allocation[]> {
    let parameters: string = '';
    if (storage_box_id) parameters += '&storage_box_id=' + storage_box_id;
    if (can_be_outside) parameters += '&can_be_outside=' + can_be_outside;
    if (description) parameters += '&description=' + description;
    console.log(this.apiUrl + '/allocations?limit=' + limit + '&page=' + page + '' + parameters);
    return this.http.get<Allocation[]>(
      this.apiUrl + '/allocations?limit=' + limit + '&page=' + page + '' + parameters,
    );
  }

  /* not possible because I cannot add a Array of numbers to the sqlx query
  multiGetAllocations(ids: number[]): Observable<Allocation[]> {
    const query: MultiQuery = { ids };
    return this.http.post<Allocation[]>(this.apiUrl + '/allocations-multi', query);
  }
  */

  // post or insert
  postAllocation(Allocation: Allocation): Observable<Allocation> {
    return this.http.post<Allocation>(this.apiUrl + '/allocations/', Allocation);
  }

  // patch or update
  patchAllocation(Allocation: Allocation): Observable<Allocation> {
    return this.http.patch<Allocation>(this.apiUrl + '/allocations/' + Allocation.id, Allocation);
  }

  deleteAllocation(id: number): Observable<Allocation> {
    return this.http.delete<Allocation>(this.apiUrl + '/allocations/' + id);
  }

  count(): Observable<EntriesCount> {
    return this.http.get<EntriesCount>(this.apiUrl + '/count/allocations');
  }
}
