import { Cell } from './Cell';
import { Row } from './Row';
import { CellCoordinates } from './CellCoordinates';
import { TableBody } from './TableBody';
import { TableHeaders } from './TableHeaders';
import { Transaction } from './Transaction';

export class Table {
  private static _OP_UPDATE = 'update';
  private static _OP_INSERT = 'insert';
  private static _OP_DELETE = 'delete';

  static get OP_UPDATE() {
    return Table._OP_UPDATE;
  }

  static get OP_INSERT() {
    return Table._OP_INSERT;
  }

  static get OP_DELETE() {
    return Table._OP_DELETE;
  }

  private _gSheet: GoogleAppsScript.Spreadsheet.Sheet;
  private _headers: TableHeaders;
  private _position: CellCoordinates;
  private _body: TableBody;

  get gSheet() {
    return this._gSheet;
  }

  get headers() {
    return this._headers;
  }

  get body() {
    return this._body;
  }

  get position() {
    return this._position;
  }

  constructor(
    gSheet: GoogleAppsScript.Spreadsheet.Sheet,
    position: CellCoordinates,
    headers: HeaderDescription[]
  ) {
    this._gSheet = gSheet;
    this._position = position;
    this._headers = new TableHeaders(this, new CellCoordinates(0, 0, position), headers);
    this._body = new TableBody(this, new CellCoordinates(1, 0, position));
  }

  *getRows(): Generator<Row<CellCoordinates>> {
    const headerNames = this._headers.getColumnHeaders();
    const batchSize = TableBody.MAX_ROW_READ;
    let batchIndex = 0;
    let rows = this._body.getRows(0, batchSize);
    while (rows.length === batchSize) {
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const cells: Cell[] = [];
        for (let cellIndex = 0; cellIndex < rows[rowIndex].length; cellIndex++) {
          cells.push(new Cell(this._headers.getHeaderByName(headerNames[cellIndex]).key, rows[rowIndex][cellIndex]));
        }
        yield new Row(cells, new CellCoordinates(batchIndex * batchSize + rowIndex, 0, this._body.position));
      }
      rows = this._body.getRows(++batchIndex * batchSize, batchSize);
    }
    if (rows.length !== 0) {
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const cells: Cell[] = [];
        for (let cellIndex = 0; cellIndex < rows[rowIndex].length; cellIndex++) {
          cells.push(new Cell(this._headers.getHeaderByName(headerNames[cellIndex]).key, rows[rowIndex][cellIndex]));
        }
        yield new Row(cells, new CellCoordinates(batchIndex * batchSize + rowIndex, 0, this._body.position));
      }
    }
  }

  execute(transaction: Transaction): void {
    const transactionName = transaction.name.length ? transaction.name : 'unknown';
    if (transaction.executed) {
      throw new Error(`cannot execute transaction ${transactionName} more than once`);
    }
    const headerNames = this._headers.getColumnHeaders();
    // Update operations.
    const updateRowGroups = this._groupRows(transaction.getUpdates());
    for (const rowGroup of updateRowGroups) {
      const updateValues = this._body.getRows((rowGroup[0].position as CellCoordinates).row, rowGroup.length);
      for (let row = 0; row < rowGroup.length; row++) {
        this._prepareRowValues(headerNames, updateValues[row], rowGroup[row]);
        if (!this._rowValuesHasContent(updateValues[row])) {
          throw new Error(`cannot update empty row on transaction ${transactionName}`);
        }
      }
      this._body.setRows((rowGroup[0].position as CellCoordinates).row, updateValues);
    }
    // Delete operations.
    const deleteRowGroups = this._groupRows(transaction.getDeletes());
    let rowsDeleted = 0;
    for (const rowGroup of deleteRowGroups) {
      this._body.removeRows((rowGroup[0].position as CellCoordinates).row - rowsDeleted, rowGroup.length);
      rowsDeleted += rowGroup.length;
    }
    // Insert operations.
    const inserts = transaction.getInserts();
    const rowValues: unknown[][] = [];
    for (const rowToInsert of inserts) {
      const insertValues = Array(headerNames.length).fill('');
      this._prepareRowValues(headerNames, insertValues, rowToInsert);
      if (!this._rowValuesHasContent(insertValues)) {
        throw new Error(`cannot insert empty row on transaction ${transactionName}`);
      }
      rowValues.push(insertValues);
    }
    this._body.addRows(rowValues);
  }

  private _prepareRowValues(headerNames: string[], values: unknown[], row: Row<any>): void {
    for (const { key, value } of row.getCells()) {
      const { name } = this._headers.getHeaderByKey(key);
      values[headerNames.indexOf(name)] = value;
    }
  }

  private _rowValuesHasContent(values: unknown[]): boolean {
    for (const value of values) {
      if (value !== null || value !== '') {
        return true;
      }
    }
    return false;
  }

  private _groupRows(rows: Row<CellCoordinates>[]): Row<CellCoordinates>[][] {
    const sortedRows = [...rows].sort((rowA, rowB) => rowA.position.row - rowB.position.row);
    const operationGroups: Row<CellCoordinates>[][] = [];
    for (const row of sortedRows) {
      if (row.operation === null) {
        throw new Error('missing row operation');
      }
      if (row.operation !== Table._OP_UPDATE && row.operation !== Table._OP_INSERT && row.operation !== Table._OP_DELETE) {
        throw new Error(`row operation ${row.operation} not valid`);
      }
      if (row.operation === Table._OP_UPDATE || row.operation === Table._OP_DELETE) {
        if (row.position === null) {
          throw new Error('missing row operation position');
        }
      }
      if (!operationGroups.length) {
        operationGroups.push([row]);
        continue;
      }
      if (row.operation === Table._OP_INSERT) {
        operationGroups[0].push(row);
      } else {
        const lastOperationGroup = operationGroups[operationGroups.length - 1];
        const lastRowInLastOperationGroup = lastOperationGroup[lastOperationGroup.length - 1];
        if (lastRowInLastOperationGroup.position.row === row.position.row - 1) {
          lastOperationGroup.push(row);
        } else {
          operationGroups.push([row]);
        }
      }
    }
    return operationGroups;
  }
}
