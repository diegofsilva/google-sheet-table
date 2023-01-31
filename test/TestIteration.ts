import { CellCoordinates } from '../CellCoordinates';
import { Library } from '../Library';
import { Row } from '../Row';
import { Table } from '../Table';
import { Column } from './Column';
import { Test } from './Test';

export abstract class TestIteration {

  static testNoRows(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email, Column.telephone, Column.personId]
    );
    TestIteration.testIteration(table, 0);
  }

  static testOneRow(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email, Column.telephone, Column.personId]
    );
    TestIteration.testIteration(table, 1);
  }

  static testSeveralRows(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email, Column.telephone, Column.personId]
    );
    TestIteration.testIteration(table, 5);
  }

  static testOneColumn(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName]
    );
    TestIteration.testIteration(table, 5);
  }

  static testIteration(table: Table, numberOfRowsInTable: number): void {
    // Setup environment.
    const tableRows: Row<CellCoordinates>[] = [];
    let rowNumber;
    for (rowNumber = 0; rowNumber < numberOfRowsInTable; rowNumber++) {
      tableRows.push(
        new Row<CellCoordinates>(
          Test.createTableCells(table.headers.getHeaderKeys(), rowNumber),
          new CellCoordinates(rowNumber, 0, table.body.position)
        )
      );
    }
    table.gSheet.clear();
    const tableHeaderKeys = table.headers.getHeaderKeys();
    const rangeValues: unknown[][] = [];
    for (const tableRow of tableRows) {
      const rowValues: unknown[] = []
      for (const tableHeaderKey of tableHeaderKeys) {
        const tableCell = tableRow.getCell(tableHeaderKey);
        if (tableCell === null) {
          throw new Error(`test failed cannot find cell with header ${tableHeaderKey}`);
        }
        rowValues.push(tableCell.value);
      }
      rangeValues.push(rowValues);
    }
    const { row: tableRowPos, column: tableColumnPos } = table.position.getAbsoluteCoordinates();
    table.gSheet.getRange(
      tableRowPos,
      tableColumnPos,
      tableRows.length + 1, // Number of rows, plus the header row.
      table.headers.headerCount
    ).setValues([table.headers.getHeaderNames(), ...rangeValues]);
    // Execute operations and test results.
    let rowIndex = 0;
    const headerKeys = table.headers.getColumnHeadersAsKeys();
    for (const tableRow of table.getRows()) {
      if (!TestIteration._isSameRow(tableRow, rangeValues[rowIndex], headerKeys)) {
        throw new Error(`test failed row ${rowIndex} is not the expected`);
      }
      rowIndex++;
    }
  }

  private static _isSameRow(row: Row<any>, rowValues: unknown[], headerKeys: string[]): boolean {
    for (let i = 0; i < rowValues.length; i++) {
      const cell = row.getCell(headerKeys[i]);
      if (cell === null) {
        throw new Error(`cannot find cell ${headerKeys[i]}`);
      }
      if (cell.value !== rowValues[i]) {
        return false;
      }
    }
    return true;
  }
}
