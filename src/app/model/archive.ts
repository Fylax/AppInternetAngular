export class Archive {
  private _archiveId: string;
  private _timestamp: number;
  private _userId: string;
  private _countSales: number;
  private _amount: number;

  get archiveId(): string {
    return this._archiveId;
  }

  set archiveId(value: string) {
    this._archiveId = value;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  set timestamp(value: number) {
    this._timestamp = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get countSales(): number {
    return this._countSales;
  }

  set countSales(value: number) {
    this._countSales = value;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
  }
}
