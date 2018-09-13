import {Archive} from "./archive";

/**
 *this class supports the pagination: in particular it's important for retrieving the total elements
 * on the db (this allows an easy way to work with mat paginator). At the moment discard the links next
 * and prev incoming from server because are useless in this use case.
 */
export class ArchivesPaginationSupport {
    private _items: Archive[];
    private _totalElements: number;

    get items(): Archive[] {
        return this._items;
    }

    set items(value: Archive[]) {
        this._items = value;
    }

    get totalElements(): number {
        return this._totalElements;
    }

    set totalElements(value: number) {
        this._totalElements = value;
    }
}
