export class Purchase {
  private _timestamp: number;
  private _status: string;
  private _amount: number;
  private _countPosition: number;
  private _start: number;
  private _end: number;

  get timestamp(): number {
    return this._timestamp;
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
    return this._start;
  }

  get end(): number {
    return this._end;
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
