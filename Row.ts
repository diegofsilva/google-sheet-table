import { CellCoordinates } from './CellCoordinates';
import { Table } from './Table';
import { Cell } from './Cell';
import { DuplicateCellError, NonExistingCellError } from './Errors';

export class Row<POS extends Nullable<CellCoordinates>> {
  private _position: POS;
  private _cells = new Map<string, Cell>();
  private _operation: string | null = null;

  get position() {
    return this._position;
  }

  get operation() {
    return this._operation;
  }

  constructor(cells: Cell[], position: POS) {
    this._position = position;
    for (const cell of cells) {
      this._cells.set(cell.key, cell);
    }
  }

  getCellCount(): number {
    return this._cells.size;
  }

  getCell(key: string): Cell | null {
    return this._cells.get(key) ?? null;
  }

  getCells() {
    return this._cells.values();
  }

  addCell(cell: Cell): void {
    if (this._cells.has(cell.key)) {
      throw new DuplicateCellError(cell.key);
    }
    this._cells.set(cell.key, cell);
  }

  removeCell(key: string): Cell {
    const deletedCell = this.getCell(key);
    if (!deletedCell) {
      throw new NonExistingCellError(key);
    }
    this._cells.delete(key);
    return deletedCell;
  }

  cancel(): this {
    this._operation = null;
    return this;
  }

  update(): this {
    this._operation = Table.OP_UPDATE;
    return this;
  }

  insert(): this {
    this._operation = Table.OP_INSERT;
    return this;
  }

  delete(): this {
    this._operation = Table.OP_DELETE;
    return this;
  }

  clone(): Row<CellCoordinates | null> {
    const clonedCells: Cell[] = [];
    for (const cell of this._cells.values()) {
      clonedCells.push(new Cell(cell.key, cell.value))
    }
    if (this._position instanceof CellCoordinates) {
      return new Row<CellCoordinates>(clonedCells, this._position.clone());
    }
    return new Row<null>(clonedCells, null);
  }
}
