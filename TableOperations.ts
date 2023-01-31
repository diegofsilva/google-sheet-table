import { CellCoordinates } from './CellCoordinates';
import { NotValidLengthError } from './Errors';

export abstract class TableOperations {
  static read(
    gSheet: GoogleAppsScript.Spreadsheet.Sheet,
    position: CellCoordinates,
    rows: number,
    columns: number
  ): unknown[][] {
    if (rows < 0) {
      throw new NotValidLengthError(rows);
    }
    if (columns < 0) {
      throw new NotValidLengthError(columns);
    }
    const { row: absRow, column: absCol } = CellCoordinates.create(0, 0, position).getAbsoluteCoordinates();
    return gSheet.getRange(absRow, absCol, rows, columns).getValues();
  }

  static delete(
    gSheet: GoogleAppsScript.Spreadsheet.Sheet,
    position: CellCoordinates,
    rows: number,
    columns: number
  ) {
    if (rows < 0) {
      throw new NotValidLengthError(rows);
    }
    if (columns < 0) {
      throw new NotValidLengthError(columns);
    }
    const { row, column } = position.getAbsoluteCoordinates();
    gSheet.getRange(row, column, rows, columns).deleteCells(SpreadsheetApp.Dimension.ROWS);
  }

  static clear(
    gSheet: GoogleAppsScript.Spreadsheet.Sheet,
    position: CellCoordinates,
    rows: number,
    columns: number
  ) {
    if (rows < 0) {
      throw new NotValidLengthError(rows);
    }
    if (columns < 0) {
      throw new NotValidLengthError(columns);
    }
    const { row, column } = position.getAbsoluteCoordinates();
    gSheet.getRange(row, column, rows, columns).clearContent();
  }

  static write(
    gSheet: GoogleAppsScript.Spreadsheet.Sheet,
    position: CellCoordinates,
    values: unknown[][]
  ): void {
    if (values.length === 0 && values[0].length === 0) {
      return;
    }
    const { row, column } = position.getAbsoluteCoordinates();
    gSheet.getRange(row, column, values.length, values[0].length).setValues(values);
  }
}
