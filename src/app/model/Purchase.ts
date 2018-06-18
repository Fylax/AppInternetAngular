import {Position} from './Position';

export class Purchase {
  private _purchaseId: string;
  private _timestamp: number;
  private _status: string;
  private _amount: number;
  private _countPosition: number;
  private _start: number;
  private _end: number;
  private _positions: Position[];

  get purchaseId(): string {
    return this._purchaseId;
  }

  set purchaseId(value: string) {
    this._purchaseId = value;
  }

  get positions(): Position[] {
    return this._positions;
  }

  set positions(value: Position[]) {
    this._positions = value;
  }

  get timestamp(): number {
    return this._timestamp * 1000;
  }

  get status(): string {
    return this._status;
  }

  get amount(): number {
    return this._amount;
  }

  get countPosition(): number {
    return this._countPosition;
  }

  get start(): number {
    return this._start * 1000;
  }

  get end(): number {
    return this._end * 1000;
  }

  set timestamp(value: number) {
    this._timestamp = value;
  }

  set status(value: string) {
    this._status = value;
  }

  set amount(value: number) {
    this._amount = value;
  }

  set countPosition(value: number) {
    this._countPosition = value;
  }

  set start(value: number) {
    this._start = value;
  }

  set end(value: number) {
    this._end = value;
  }
}
