export class Cell {
  value: unknown;
  private _key: string;

  get key() {
    return this._key;
  }

  constructor(key: string, value: unknown) {
    this._key = key;
    this.value = value;
  }
}
