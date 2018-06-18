import {Link} from './Link';

export class AdminPaginatorSupport {
  private _items: Link[];
  private _totalElements: number;


  get items(): Link[] {
    return this._items;
  }

  set items(value: Link[]) {
    this._items = value;
  }

  get totalElements(): number {
    return this._totalElements;
  }

  set totalElements(value: number) {
    this._totalElements = value;
  }
}