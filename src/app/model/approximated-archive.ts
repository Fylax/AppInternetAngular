import {Point} from './point';


export class ApproximatedArchive {
    private _archiveId: number;
    private _username: string;
    private _color: string;
    private _timestamps: Array<number>;
    private _positions: Array<Point>;
    private _countPositionArchive: number;
    private _purchased: boolean;
    private _amount: number;

  get archiveId(): number {
    return this._archiveId;
  }

  set archiveId(value: number) {
    this._archiveId = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get timestamps(): Array<number> {
    return this._timestamps;
  }

  set timestamps(value: Array<number>) {
    this._timestamps = value;
  }

  get positions(): Array<Point> {
    return this._positions;
  }

  set positions(value: Array<Point>) {
    this._positions = value;
  }

  get countPositionArchive(): number {
    return this._countPositionArchive;
  }

  set countPositionArchive(value: number) {
    this._countPositionArchive = value;
  }

  get purchased(): boolean {
    return this._purchased;
  }

  set purchased(value: boolean) {
    this._purchased = value;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
  }
}
