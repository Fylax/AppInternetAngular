export class Link {
  private _rel: string;
  private _href: string;

  get rel(): string {
    return this._rel;
  }

  set rel(value: string) {
    this._rel = value;
  }

  get href(): string {
    return this._href;
  }

  set href(value: string) {
    this._href = value;
  }
}