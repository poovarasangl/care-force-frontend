import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { StoreService } from "../store/store.service";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.sass']
})
export class PaginationComponent implements OnChanges {
  @Input() totalRecords: number = 0;
  @Input() recordsPerPage: number = 0;
  @Input() activepagenumber: number;

  @Output() onPageChange: EventEmitter<number> = new EventEmitter();

  public pages: number[] = [];
  activePage: number;

  ngOnChanges() {
    const pageCount = this.getPageCount();
    this.pages = this.getArrayOfPage(pageCount);
    this.activePage = this.activepagenumber == 1 ? 1 : (this.activepagenumber ? this.activepagenumber : 1);
    this.onPageChange.emit(this.activepagenumber == 1 ? 1 : (this.activepagenumber ? this.activepagenumber : 1));
  }

  private getPageCount(): number {

    let totalPage: number = 0;

    if (this.totalRecords > 0 && this.recordsPerPage > 0) {
      const pageCount = this.totalRecords / this.recordsPerPage;
      const roundedPageCount = Math.floor(pageCount);

      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }

    return totalPage;
  }

  private getArrayOfPage(pageCount: number): number[] {
    let pageArray: number[] = [];

    if (pageCount > 0) {
      for (var i = 1; i <= pageCount; i++) {
        pageArray.push(i);
      }
    }

    return pageArray;
  }

  onClickPage(pageNumber: number) {
    if (pageNumber < 1) return;
    if (pageNumber > this.pages.length) return;
    this.activePage = pageNumber;
    this.onPageChange.emit(this.activePage);
  }
} 
