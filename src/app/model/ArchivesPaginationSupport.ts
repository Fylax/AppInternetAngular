import {Archive} from "./Archive";


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
