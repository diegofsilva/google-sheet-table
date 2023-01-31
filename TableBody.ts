import { CellCoordinates } from './CellCoordinates';
import { Table } from './Table';
import { TableOperations } from './TableOperations';

export class TableBody {
  private _dbTable: Table;
  private _position: CellCoordinates;
  private static _MAX_ROW_READ = 100;
  private static _MAX_ROW_WRITE = 50;

  static get MAX_ROW_READ() {
    return TableBody._MAX_ROW_READ;
  }

  static get MAX_ROW_WRITE() {
    return TableBody._MAX_ROW_WRITE;
  }

  get position() {
    return this._position;
  }

  constructor(
    dbTable: Table,
    position: CellCoordinates,
  ) {
    this._dbTable = dbTable;
    this._position = position;
  }

  getRowCount(): number {
    const batchSize = TableBody.MAX_ROW_READ;
    let rows;
    let count = 0;
    let batch = 0;
    do {
      rows = this.getRows(batch++ * batchSize, batchSize);
      count += rows.length;
    } while (rows.length);
    return count;
  }

  getRows(fromRow: number = 0, rowCount: number = TableBody._MAX_ROW_READ): unknown[][] {
    if (rowCount <= 0) {
      return [];
    }
    if (rowCount > TableBody._MAX_ROW_READ) {
      throw new Error(`trying to read ${rowCount} rows but maximum is ${TableBody._MAX_ROW_READ} rows`);
    }
    const numberOfColumns = this._dbTable.headers.headerCount;
    const discardEmptyRows = (row: unknown[]) => {
      for (const cell of row) {
        if (cell !== '') {
          return true;
        }
      }
      return false;
    };
    return TableOperations.read(
      this._dbTable.gSheet,
      new CellCoordinates(fromRow, 0, this._position),
      rowCount,
      numberOfColumns
    ).filter(discardEmptyRows);
  }

  setRows(fromRow: number, rows: unknown[][]): void {
    let rowsToWrite: unknown[][] = [];
    let batchIndex = 0;
    for (let row = 0; row < rows.length; row++) {
      rowsToWrite.push(rows[row]);
      if (rowsToWrite.length === TableBody._MAX_ROW_WRITE) {
        TableOperations.write(
          this._dbTable.gSheet,
          new CellCoordinates(batchIndex++ * TableBody._MAX_ROW_WRITE + fromRow, 0, this._position),
          rowsToWrite
        );
      }
    }
    if (rowsToWrite.length) {
      TableOperations.write(
        this._dbTable.gSheet,
        new CellCoordinates(batchIndex * TableBody._MAX_ROW_WRITE + fromRow, 0, this._position),
        rowsToWrite
      );
    }
  }

  addRows(rows: unknown[][]): void {
    if (rows.length === 0) {
      return;
    }
    TableOperations.write(this._dbTable.gSheet, new CellCoordinates(this.getRowCount(), 0, this._position), rows);
  }

  removeRows(fromRow: number, rowCount: number): void {
    const batches = Math.floor(rowCount / TableBody._MAX_ROW_WRITE);
    const headerCount = this._dbTable.headers.headerCount;
    for (let batch = 0; batch < batches; batch++) {
      TableOperations.delete(
        this._dbTable.gSheet,
        new CellCoordinates(fromRow, 0, this._position),
        TableBody._MAX_ROW_WRITE,
        headerCount
      );
    }
    const rowsRemaining = rowCount % TableBody._MAX_ROW_WRITE;
    if (rowsRemaining) {
      TableOperations.delete(
        this._dbTable.gSheet,
        new CellCoordinates(fromRow, 0, this._position),
        rowsRemaining,
        headerCount
      );
    }
  }
}
