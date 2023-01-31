import { Cell } from '../Cell';
import { Row } from '../Row';

export abstract class Test {
  static sheetName = 'test_sheet';

  static prepareSheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): GoogleAppsScript.Spreadsheet.Sheet {
    const testSheet = spreadsheet.getSheetByName(Test.sheetName);
    if (testSheet === null) {
      return spreadsheet.insertSheet(Test.sheetName);
    }
    return spreadsheet.setActiveSheet(testSheet.clear());
  }

  static createTableCells(headerKeys: string[], row: number): Cell[] {
    const cells: Cell[] = [];
    for (const headerKey of headerKeys) {
      cells.push(new Cell(headerKey, `${headerKey}-${row}`));
    }
    return cells;
  }
}
