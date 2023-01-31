import { CellCoordinates } from './CellCoordinates';

export abstract class Library {

  static getGoogleSheetCellOffsetCoordinates(): CellCoordinates {
    return new CellCoordinates(1, 1);
  }
}
