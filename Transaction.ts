import { CellCoordinates } from './CellCoordinates';
import { RowWithoutPositionTransactionError, UnknownOperationTransactionError } from './Errors';
import { Row } from './Row';
import { Table } from './Table';

export class Transaction {
  name: string;
  private _inserts: Row<null>[] = [];
  private _updates: Row<CellCoordinates>[] = [];
  private _deletes: Row<CellCoordinates>[] = [];
  private _executed: boolean = false;

  get executed() {
    return this._executed;
  }

  constructor(name: string = '') {
    this.name = name;
  }

  addRows(rows: Row<CellCoordinates | null>[]): void {
    for (const row of rows) {
      this.addRow(row);
    }
  }

  addRow(row: Row<CellCoordinates | null>): void {
    switch (row.operation) {
      case Table.OP_INSERT:
        this._inserts.push(row as Row<null>);
        break;
      case Table.OP_UPDATE:
        if (row.position === null) {
          throw new RowWithoutPositionTransactionError(this);
        }
        this._updates.push(row as Row<CellCoordinates>);
        break;
      case Table.OP_DELETE:
        if (row.position === null) {
          throw new RowWithoutPositionTransactionError(this);
        }
        this._deletes.push(row as Row<CellCoordinates>);
        break;
      default:
        throw new UnknownOperationTransactionError(this);
    }
  }

  getInserts() {
    return this._inserts;
  }

  getUpdates() {
    return this._updates;
  }

  getDeletes() {
    return this._deletes;
  }

  markExecuted() {
    this._executed = true;
  }
}
