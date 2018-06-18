import {Purchase} from './Purchase';

/*
  add this class to support the pagination: in particular it's important to retrieve the total elements
   on the db (this allows an easy way to work with mat paginator). At the moment discard the links next
   and prev incoming from server because are useless in this use case.
 */
export class PurchasesPaginationSupport {
  private _items: Purchase[];
  private _totalElements: number;

  get items(): Purchase[] {
    return this._items;
  }

  set items(value: Purchase[]) {
    this._items = value;
  }

  get totalElements(): number {
    return this._totalElements;
  }

  set totalElements(value: number) {
    this._totalElements = value;
  }
}