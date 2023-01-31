import { CellCoordinates } from '../CellCoordinates';
import { Library } from '../Library';
import { Row } from '../Row';
import { Table } from '../Table';
import { Transaction } from '../Transaction';
import { Column } from './Column';
import { Test } from './Test';

export abstract class TestInsertion {

  static testOneRowOnEmptyTable(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testInsertion(
      table,
      0,
      [
        [Column.firstName.key, Column.lastName.key, Column.email.key]
      ]
    );
  }

  static testSeveralRowsOnEmptyTable(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testInsertion(
      table,
      0,
      [
        [Column.firstName.key],
        [Column.lastName.key],
        [Column.email.key],
        [Column.firstName.key, Column.lastName.key, Column.email.key],
      ]
    );
  }

  static testOneRow(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testInsertion(
      table,
      4,
      [
        [Column.firstName.key, Column.lastName.key, Column.email.key]
      ]
    );
  }

  static testSeveralRows(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testInsertion(
      table,
      4,
      [
        [Column.firstName.key],
        [Column.lastName.key],
        [Column.email.key],
        [Column.firstName.key, Column.lastName.key, Column.email.key],
      ]
    );
  }

  static testInsertion(
    table: Table,
    numberOfRowsInTable: number,
    headersOfRowsToInsert: string[][]
  ): void {
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
    const rowsToInsert: Row<null>[] = [];
    for (let rowHeadersIndex = 0; rowHeadersIndex < headersOfRowsToInsert.length; rowHeadersIndex++) {
      const row = new Row(
        Test.createTableCells(headersOfRowsToInsert[rowHeadersIndex], rowNumber + rowHeadersIndex),
        null
      );
      rowsToInsert.push(row.insert());
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
      rangeValues.push(rowValues);;
    }
    const { row: tableRowPos, column: tableColumnPos } = table.position.getAbsoluteCoordinates();
    table.gSheet.getRange(
      tableRowPos,
      tableColumnPos,
      tableRows.length + 1, // Number of rows, plus the header row.
      table.headers.headerCount
    ).setValues([table.headers.getHeaderNames(), ...rangeValues]);
    // Execute operations.
    const transaction = new Transaction('test insertion');
    transaction.addRows(rowsToInsert);
    table.execute(transaction);
    // Test results.
    let rowIndex = 0;
    for (const row of table.getRows()) {
      if (rowIndex < tableRows.length) {
        rowIndex++;
        continue;
      }
      let foundEqual = false;
      for (const rowToInsert of rowsToInsert) {
        if (TestInsertion._rowsAreEqual(row, rowToInsert)) {
          foundEqual = true;
          break;
        }
      }
      if (!foundEqual) {
        throw new Error(`test failed row was not inserted `);
      }
      rowIndex++;
    }
    const expectedRowCount = tableRows.length + rowsToInsert.length;
    if (expectedRowCount !== rowIndex) {
      throw new Error(`test failed expected ${expectedRowCount} rows and got ${rowIndex}`);
    }
  }

  private static _rowsAreEqual(rowA: Row<any>, rowB: Row<any>): boolean {
    for (const cellA of rowA.getCells()) {
      if (cellA.value !== (rowB.getCell(cellA.key)?.value ?? '')) {
        return false;
      }
    }
    return true;
  }
}
