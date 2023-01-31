import { CellCoordinates } from '../CellCoordinates';
import { Library } from '../Library';
import { Row } from '../Row';
import { Table } from '../Table';
import { Transaction } from '../Transaction';
import { Column } from './Column';
import { Test } from './Test';

export abstract class TestDeletion {

  static testOneRowAtTheBeggining(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testDeletion(table, 5, [0]);
  }

  static testOneRowInTheMiddle(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testDeletion(table, 5, [2]);
  }

  static testOneRowAtTheEnd(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testDeletion(table, 5, [4]);
  }

  static testSeveralRowsAtTheBeggining(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testDeletion(table, 5, [0, 1, 2]);
  }

  static testSeveralRowsInTheMiddle(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testDeletion(table, 5, [1, 2, 3]);
  }

  static testSeveralRowsAtTheEnd(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    this.testDeletion(table, 5, [2, 3, 4]);
  }

  static testDeletion(
    table: Table,
    numberOfRowsInTable: number,
    rowNumbersToDelete: number[]
  ): void {
    // Setup environment.
    const tableRows: Row<CellCoordinates>[] = [];
    let rowNumber;
    for (rowNumber = 0; rowNumber < numberOfRowsInTable; rowNumber++) {
      tableRows.push(
        new Row(
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
          throw new Error(`test failed cannot find cell ${tableHeaderKey}`);
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
    const rowsToDelete = tableRows.filter((tableRow) => {
      if (rowNumbersToDelete.includes(tableRow.position.row)) {
        tableRow.delete();
        return true;
      }
      return false;
    });
    // Execute operations.
    const transaction = new Transaction('test insertion');
    transaction.addRows(rowsToDelete);
    table.execute(transaction);
    // Test results.
    let rowCount = 0;
    for (const tableRow of table.getRows()) {
      for (const deletedRow of rowsToDelete) {
        if (TestDeletion._rowsAreEqual(tableRow, deletedRow)) {
          throw new Error(`test failed row ${deletedRow.position.row} was not deteled`);
        }
      }
      rowCount++;
    }
    const expectedNumberRows = tableRows.length - rowsToDelete.length;
    if (rowCount !== expectedNumberRows) {
      throw new Error(
        `test failed expected ${expectedNumberRows} rows remaining and got ${rowCount}`
      );
    }
  }

  private static _rowsAreEqual(rowA: Row<any>, rowB: Row<any>): boolean {
    if (rowA.getCellCount() !== rowB.getCellCount()) {
      return false;
    }
    for (const cellA of rowA.getCells()) {
      const cellB = rowB.getCell(cellA.key);
      if (cellB === null) {
        return false;
      }
      if (cellA.value !== cellB.value) {
        return false;
      }
    }
    return true;
  }
}
