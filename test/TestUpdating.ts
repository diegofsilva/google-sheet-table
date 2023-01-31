import { Cell } from '../Cell';
import { CellCoordinates } from '../CellCoordinates';
import { Library } from '../Library';
import { Row } from '../Row';
import { Table } from '../Table';
import { Transaction } from '../Transaction';
import { Column } from './Column';
import { Test } from './Test';

export abstract class TestUpdating {

  static testOnSameRow(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email, Column.telephone, Column.personId]
    );
    TestUpdating.testUpdating(
      table,
      5,
      [
        new Row(
          [new Cell(Column.lastName.key, 'cell0'), new Cell(Column.telephone.key, 'cell1')],
          new CellCoordinates(0, 0, table.body.position)
        ),
        new Row(
          [new Cell(Column.email.key, 'cell2'), new Cell(Column.personId.key, 'cell3')],
          new CellCoordinates(2, 0, table.body.position)
        ),
      ]
    );
  }

  static testOnSameColumn(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email, Column.telephone, Column.personId]
    );
    TestUpdating.testUpdating(
      table,
      5,
      [
        new Row(
          [new Cell(Column.email.key, 'cell0')],
          new CellCoordinates(0, 0, table.body.position)
        ),
        new Row(
          [new Cell(Column.email.key, 'cell1')],
          new CellCoordinates(2, 0, table.body.position)
        ),
        new Row(
          [new Cell(Column.email.key, 'cell2')],
          new CellCoordinates(3, 0, table.body.position)
        ),
      ]
    );
  }

  static testOnARow(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email]
    );
    TestUpdating.testUpdating(
      table,
      5,
      [
        new Row(
          [
            new Cell(Column.firstName.key, 'cell0'),
            new Cell(Column.lastName.key, 'cell1'),
            new Cell(Column.email.key, 'cell2'),
          ],
          new CellCoordinates(0, 0, table.body.position)
        ),
      ]
    );
  }

  static TestOnAColumn(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email, Column.telephone, Column.personId]
    );
    TestUpdating.testUpdating(
      table,
      3,
      [
        new Row(
          [new Cell(Column.email.key, 'cell0')],
          new CellCoordinates(0, 0, table.body.position)
        ),
        new Row(
          [new Cell(Column.email.key, 'cell1')],
          new CellCoordinates(1, 0, table.body.position)
        ),
        new Row(
          [new Cell(Column.email.key, 'cell2')],
          new CellCoordinates(2, 0, table.body.position)
        ),
      ]
    );
  }

  static TestOnDifferentRowsAnColumns(sheet: GSheet, rowOffset: number = 0, columnOffset: number = 0): void {
    const table = new Table(
      sheet,
      new CellCoordinates(rowOffset, columnOffset, Library.getGoogleSheetCellOffsetCoordinates()),
      [Column.firstName, Column.lastName, Column.email, Column.telephone, Column.personId]
    );
    TestUpdating.testUpdating(
      table,
      5,
      [
        new Row(
          [new Cell(Column.email.key, 'cell0'), new Cell(Column.personId.key, 'cell1')],
          new CellCoordinates(0, 0, table.body.position)
        ),
        new Row(
          [
            new Cell(Column.firstName.key, 'cell2'),
            new Cell(Column.lastName.key, 'cell3'),
            new Cell(Column.personId.key, 'cell4')
          ],
          new CellCoordinates(1, 0, table.body.position)
        ),
        new Row(
          [new Cell(Column.telephone.key, 'cell5')],
          new CellCoordinates(4, 0, table.body.position)
        ),
      ]
    );
  }

  static testUpdating(
    table: Table,
    numberOfRowsInTable: number,
    rowsToUpdate: Row<CellCoordinates>[]
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
    const rowsToCheck = new Map<number, { original?: Row<any>, updates: Row<any> }>();
    for (const rowToUpdate of rowsToUpdate) {
      rowToUpdate.update();
      rowsToCheck.set(rowToUpdate.position.row, { updates: rowToUpdate });
    }
    for (const tableRow of table.getRows()) {
      const rowToCheck = rowsToCheck.get(tableRow.position.row);
      if (rowToCheck) {
        rowToCheck.original = tableRow.clone();
      }
    }
    // Execute operations.
    const transaction = new Transaction('test insertion');
    transaction.addRows(rowsToUpdate);
    table.execute(transaction);
    // Test results.
    for (const tableRow of table.getRows()) {
      const rowToCheck = rowsToCheck.get(tableRow.position.row);
      if (rowToCheck) {
        if (!rowToCheck.original) {
          throw new Error(`test failed could not find original row ${tableRow.position.row}`);
        }
        if (!TestUpdating.rowIsUpdated(tableRow, rowToCheck.original, rowToCheck.updates)) {
          throw new Error(`test failed row ${tableRow.position.row} is not updated`);
        }
      }
    }
  }

  static rowIsUpdated(rowUpdated: Row<any>, originalRow: Row<any>, rowUpdates: Row<any>): boolean {
    for (const cell of rowUpdated.getCells()) {
      const expectedCell = rowUpdates.getCell(cell.key) ?? originalRow.getCell(cell.key);
      if (expectedCell === null) {
        throw new Error(`cannot find cell ${cell.key}`);
      }
      if (cell.value !== expectedCell.value) {
        return false;
      }
    }
    return true;
  }
}
