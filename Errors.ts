import { Cell } from './Cell';
import { Transaction } from './Transaction';

export class NotValidLengthError extends Error {
  constructor(lenght: number) {
    super(`${lenght} is not a valid length`);
  }
}

export class NonExistingCellError extends Error {
  constructor(cellKey: string) {
    super(`cell does not exists ${cellKey}`);
  }
}

export class DuplicateCellError extends Error {
  constructor(cellkey: string) {
    super(`cell already exists ${cellkey}`);
  }
}

export class NonExistingTableHeader extends Error {
  constructor(header: string) {
    super(`table header ${header} does not exist`);
  }
}

export class RowWithoutPositionTransactionError extends Error {
  constructor(transaction: Transaction) {
    super(`row position is missing in transaction ${transaction.name.length ? transaction.name : 'unknown'}`);
  }
}

export class UnknownOperationTransactionError extends Error {
  constructor(transaction: Transaction) {
    super(`unknown operation ${transaction.name.length ? transaction.name : 'unknown'}`);
  }
}
