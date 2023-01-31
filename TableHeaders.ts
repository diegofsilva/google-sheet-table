import { CellCoordinates } from './CellCoordinates';
import { NonExistingTableHeader } from './Errors';
import { Table } from './Table';
import { TableOperations } from './TableOperations';

export class TableHeaders {
  private _table: Table;
  private _position: CellCoordinates;
  private _headerKeys = new Map<string, HeaderDescription>();
  private _headerNames = new Map<string, HeaderDescription>();

  get headerCount() {
    return this._headerKeys.size
  }

  get position() {
    return this._position;
  }

  constructor(
    table: Table,
    position: CellCoordinates,
    headerDescriptions: HeaderDescription[]
  ) {
    this._table = table;
    this._position = position;
    for (const headerDescription of headerDescriptions) {
      this._headerKeys.set(headerDescription.key, headerDescription);
      this._headerNames.set(headerDescription.name, headerDescription);
    }
  }

  getHeaderByKey(key: string): HeaderDescription {
    const header = this._headerKeys.get(key);
    if (!header) {
      throw new NonExistingTableHeader(key);
    }
    return header;
  }

  getHeaderByName(name: string): HeaderDescription {
    const header = this._headerNames.get(name);
    if (!header) {
      throw new NonExistingTableHeader(name);
    }
    return header;
  }

  getHeaderNames(): string[] {
    return Array.from(this._headerNames.keys());
  }

  getHeaderKeys() {
    return Array.from(this._headerKeys.keys());
  }

  getColumnHeaders() {
    const headers = TableOperations.read(this._table.gSheet, this._position, 1, this.headerCount);
    if (!headers.length) {
      throw new Error('could not find header row');
    }
    return headers[0] as string[];
  }

  getColumnHeadersAsKeys(): string[] {
    const headerNames = this.getColumnHeaders();
    const headerKeys: string[] = [];
    for (const headerName of headerNames) {
      headerKeys.push(this.getHeaderByName(headerName).key)
    }
    return headerKeys;
  }
}
