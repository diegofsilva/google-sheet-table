import { NotValidLengthError } from './Errors';

export class CellCoordinates {
  private _row: number;
  private _column: number;
  private _parent: CellCoordinates | null = null;

  get row() {
    return this._row;
  }

  get column() {
    return this._column;
  }

  get parent() {
    return this._parent;
  }

  set parent(parent: CellCoordinates | null) {
    this._parent = parent;
  }

  constructor(row: number, column: number, parent: CellCoordinates | null = null) {
    if (row < 0) {
      throw new NotValidLengthError(row);
    }
    if (column < 0) {
      throw new NotValidLengthError(column);
    }
    this._row = row;
    this._column = column;
    this._parent = parent;
  }

  static create(row: number, column: number, parent: CellCoordinates | null = null) {
    return new CellCoordinates(row, column, parent);
  }

  getAbsoluteRow(): number {
    let absoluteRow = this._row;
    let parent = this._parent;
    while (parent !== null) {
      absoluteRow += parent.row;
      parent = parent.parent;
    }
    return absoluteRow;
  }

  getAbsoluteColumn(): number {
    let absoluteColumn = this._column;
    let parent = this._parent;
    while (parent !== null) {
      absoluteColumn += parent.column;
      parent = parent.parent;
    }
    return absoluteColumn;
  }

  getAbsoluteCoordinates(): CellCoordinates {
    let absoluteRow = this._row;
    let absoluteColumn = this._column;
    let parent = this._parent;
    while (parent !== null) {
      absoluteRow += parent.row;
      absoluteColumn += parent.column;
      parent = parent.parent;
    }
    return new CellCoordinates(absoluteRow, absoluteColumn);
  }

  clone() {
    return new CellCoordinates(this._row, this._column, this._parent);
  }
}
