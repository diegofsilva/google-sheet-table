import { Test } from './Test';
import { TestDeletion } from './TestDeletion';
import { TestInsertion } from './TestInsertion';
import { TestIteration } from './TestIteration';
import { TestUpdating } from './TestUpdating';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Tests')
    .addSubMenu(
      ui.createMenu('Row Iteration')
        .addItem('Run no rows test', 'runNoRowsIterationTestMenuAction_')
        .addItem('Run one row test', 'runOneRowsIterationTestMenuAction_')
        .addItem('Run several rows test', 'runSeveralRowsIterationTestMenuAction_')
        .addItem('Run single column test', 'runSingleColumnIterationTestMenuAction_')
        .addSeparator()
        .addItem('Run all tests', 'runAllIterationTestsMenuAction_')
    )
    .addSubMenu(
      ui.createMenu('Row Insertion')
        .addItem('Run row on empty table', 'runOneRowOnEmptyTableInsertionTestMenuAction_')
        .addItem('Run several rows on empty table', 'runSeveralRowsOnEmptyTableInsertionTestMenuAction_')
        .addItem('Run one row', 'runOneRowInsertionTestMenuAction_')
        .addItem('Run several rows', 'runSeveralRowsInsertionTestMenuAction_')
        .addSeparator()
        .addItem('Run all tests', 'runAllInsertionTestsMenuAction_')
    )
    .addSubMenu(
      ui.createMenu('Row Deletion')
        .addItem('Run one row at the beginning', 'runOneRowAtTheBeginningDeletionTestMenuAction_')
        .addItem('Run one row in the middle', 'runOneRowInTheMiddleDeletionTestMenuAction_')
        .addItem('Run one row at the end', 'runOneRowAtTheEndDeletionTestMenuAction_')
        .addItem('Run several rows at the beginning', 'runSeveralRowsAtTheBeginningDeletionTestMenuAction_')
        .addItem('Run several rows in the middle', 'runSeveralRowsInTheMiddleDeletionTestMenuAction_')
        .addItem('Run several rows at the end', 'runSeveralRowsAtTheEndDeletionTestMenuAction_')
        .addSeparator()
        .addItem('Run all tests', 'runAllDeletionTestsMenuAction_')
    )
    .addSubMenu(
      ui.createMenu('Row Updating')
        .addItem('Run update on same row', 'runOnSameRowUpdatingTestMenuAction_')
        .addItem('Run update on same column', 'runOnSameColumnUpdatingTestMenuAction_')
        .addItem('Run update on a row', 'runOnARowUpdatingTestMenuAction_')
        .addItem('Run update on a column', 'runOnAColumnUpdatingTestMenuAction_')
        .addItem('Run update on different rows and columns', 'runOnDifferentRowsAndColumnsUpdatingTestMenuAction_')
        .addSeparator()
        .addItem('Run all tests', 'runAllUpdatingTestsMenuAction_')
    )
    .addToUi();
}

// Iteration tests.

function runNoRowsIterationTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestIteration.testNoRows(Test.prepareSheet(spreadsheet), 0, 0);
  TestIteration.testNoRows(Test.prepareSheet(spreadsheet), 2, 0);
  TestIteration.testNoRows(Test.prepareSheet(spreadsheet), 0, 2);
  TestIteration.testNoRows(Test.prepareSheet(spreadsheet), 2, 2);
}

function runOneRowsIterationTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestIteration.testOneRow(Test.prepareSheet(spreadsheet), 0, 0);
  TestIteration.testOneRow(Test.prepareSheet(spreadsheet), 2, 0);
  TestIteration.testOneRow(Test.prepareSheet(spreadsheet), 0, 2);
  TestIteration.testOneRow(Test.prepareSheet(spreadsheet), 2, 2);
}

function runSeveralRowsIterationTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestIteration.testSeveralRows(Test.prepareSheet(spreadsheet), 0, 0);
  TestIteration.testSeveralRows(Test.prepareSheet(spreadsheet), 2, 0);
  TestIteration.testSeveralRows(Test.prepareSheet(spreadsheet), 0, 2);
  TestIteration.testSeveralRows(Test.prepareSheet(spreadsheet), 2, 2);
}

function runSingleColumnIterationTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestIteration.testOneColumn(Test.prepareSheet(spreadsheet), 0, 0);
  TestIteration.testOneColumn(Test.prepareSheet(spreadsheet), 2, 0);
  TestIteration.testOneColumn(Test.prepareSheet(spreadsheet), 0, 2);
  TestIteration.testOneColumn(Test.prepareSheet(spreadsheet), 2, 2);
}

function runAllIterationTestsMenuAction_() {
  runNoRowsIterationTestMenuAction_();
  runOneRowsIterationTestMenuAction_();
  runSeveralRowsIterationTestMenuAction_();
  runSingleColumnIterationTestMenuAction_();
}

// Insertion tests.

function runOneRowOnEmptyTableInsertionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestInsertion.testOneRowOnEmptyTable(Test.prepareSheet(spreadsheet), 0, 0);
  TestInsertion.testOneRowOnEmptyTable(Test.prepareSheet(spreadsheet), 2, 0);
  TestInsertion.testOneRowOnEmptyTable(Test.prepareSheet(spreadsheet), 0, 2);
  TestInsertion.testOneRowOnEmptyTable(Test.prepareSheet(spreadsheet), 2, 2);
}

function runSeveralRowsOnEmptyTableInsertionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestInsertion.testSeveralRowsOnEmptyTable(Test.prepareSheet(spreadsheet), 0, 0);
  TestInsertion.testSeveralRowsOnEmptyTable(Test.prepareSheet(spreadsheet), 2, 0);
  TestInsertion.testSeveralRowsOnEmptyTable(Test.prepareSheet(spreadsheet), 0, 2);
  TestInsertion.testSeveralRowsOnEmptyTable(Test.prepareSheet(spreadsheet), 2, 2);
}

function runOneRowInsertionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestInsertion.testOneRow(Test.prepareSheet(spreadsheet), 0, 0);
  TestInsertion.testOneRow(Test.prepareSheet(spreadsheet), 2, 0);
  TestInsertion.testOneRow(Test.prepareSheet(spreadsheet), 0, 2);
  TestInsertion.testOneRow(Test.prepareSheet(spreadsheet), 2, 2);
}

function runSeveralRowsInsertionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestInsertion.testSeveralRows(Test.prepareSheet(spreadsheet), 0, 0);
  TestInsertion.testSeveralRows(Test.prepareSheet(spreadsheet), 2, 0);
  TestInsertion.testSeveralRows(Test.prepareSheet(spreadsheet), 0, 2);
  TestInsertion.testSeveralRows(Test.prepareSheet(spreadsheet), 2, 2);
}

function runAllInsertionTestsMenuAction_() {
  runOneRowOnEmptyTableInsertionTestMenuAction_()
  runSeveralRowsOnEmptyTableInsertionTestMenuAction_()
  runOneRowInsertionTestMenuAction_()
  runSeveralRowsInsertionTestMenuAction_()
}

// Deletion tests.

function runOneRowAtTheBeginningDeletionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestDeletion.testOneRowAtTheBeggining(Test.prepareSheet(spreadsheet), 0, 0);
  TestDeletion.testOneRowAtTheBeggining(Test.prepareSheet(spreadsheet), 2, 0);
  TestDeletion.testOneRowAtTheBeggining(Test.prepareSheet(spreadsheet), 0, 2);
  TestDeletion.testOneRowAtTheBeggining(Test.prepareSheet(spreadsheet), 2, 2);
}

function runOneRowInTheMiddleDeletionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestDeletion.testOneRowInTheMiddle(Test.prepareSheet(spreadsheet), 0, 0);
  TestDeletion.testOneRowInTheMiddle(Test.prepareSheet(spreadsheet), 2, 0);
  TestDeletion.testOneRowInTheMiddle(Test.prepareSheet(spreadsheet), 0, 2);
  TestDeletion.testOneRowInTheMiddle(Test.prepareSheet(spreadsheet), 2, 2);
}

function runOneRowAtTheEndDeletionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestDeletion.testOneRowAtTheEnd(Test.prepareSheet(spreadsheet), 0, 0);
  TestDeletion.testOneRowAtTheEnd(Test.prepareSheet(spreadsheet), 2, 0);
  TestDeletion.testOneRowAtTheEnd(Test.prepareSheet(spreadsheet), 0, 2);
  TestDeletion.testOneRowAtTheEnd(Test.prepareSheet(spreadsheet), 2, 2);
}

function runSeveralRowsAtTheBeginningDeletionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestDeletion.testSeveralRowsAtTheBeggining(Test.prepareSheet(spreadsheet), 0, 0);
  TestDeletion.testSeveralRowsAtTheBeggining(Test.prepareSheet(spreadsheet), 2, 0);
  TestDeletion.testSeveralRowsAtTheBeggining(Test.prepareSheet(spreadsheet), 0, 2);
  TestDeletion.testSeveralRowsAtTheBeggining(Test.prepareSheet(spreadsheet), 2, 2);
}

function runSeveralRowsInTheMiddleDeletionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestDeletion.testSeveralRowsInTheMiddle(Test.prepareSheet(spreadsheet), 0, 0);
  TestDeletion.testSeveralRowsInTheMiddle(Test.prepareSheet(spreadsheet), 2, 0);
  TestDeletion.testSeveralRowsInTheMiddle(Test.prepareSheet(spreadsheet), 0, 2);
  TestDeletion.testSeveralRowsInTheMiddle(Test.prepareSheet(spreadsheet), 2, 2);
}

function runSeveralRowsAtTheEndDeletionTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestDeletion.testSeveralRowsAtTheEnd(Test.prepareSheet(spreadsheet), 0, 0)
  TestDeletion.testSeveralRowsAtTheEnd(Test.prepareSheet(spreadsheet), 2, 0)
  TestDeletion.testSeveralRowsAtTheEnd(Test.prepareSheet(spreadsheet), 0, 2)
  TestDeletion.testSeveralRowsAtTheEnd(Test.prepareSheet(spreadsheet), 2, 2)
}

function runAllDeletionTestsMenuAction_() {
  runOneRowAtTheBeginningDeletionTestMenuAction_()
  runOneRowInTheMiddleDeletionTestMenuAction_()
  runOneRowAtTheEndDeletionTestMenuAction_()
  runSeveralRowsAtTheBeginningDeletionTestMenuAction_()
  runSeveralRowsInTheMiddleDeletionTestMenuAction_()
  runSeveralRowsAtTheEndDeletionTestMenuAction_()
}

// Updating.

function runOnSameRowUpdatingTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestUpdating.testOnSameRow(Test.prepareSheet(spreadsheet), 0, 0);
  TestUpdating.testOnSameRow(Test.prepareSheet(spreadsheet), 2, 0);
  TestUpdating.testOnSameRow(Test.prepareSheet(spreadsheet), 0, 2);
  TestUpdating.testOnSameRow(Test.prepareSheet(spreadsheet), 2, 2);
}

function runOnSameColumnUpdatingTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestUpdating.testOnSameColumn(Test.prepareSheet(spreadsheet), 0, 0);
  TestUpdating.testOnSameColumn(Test.prepareSheet(spreadsheet), 2, 0);
  TestUpdating.testOnSameColumn(Test.prepareSheet(spreadsheet), 0, 2);
  TestUpdating.testOnSameColumn(Test.prepareSheet(spreadsheet), 2, 2);
}

function runOnARowUpdatingTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestUpdating.testOnARow(Test.prepareSheet(spreadsheet), 0, 0);
  TestUpdating.testOnARow(Test.prepareSheet(spreadsheet), 2, 0);
  TestUpdating.testOnARow(Test.prepareSheet(spreadsheet), 0, 2);
  TestUpdating.testOnARow(Test.prepareSheet(spreadsheet), 2, 2);
}

function runOnAColumnUpdatingTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestUpdating.TestOnAColumn(Test.prepareSheet(spreadsheet), 0, 0);
  TestUpdating.TestOnAColumn(Test.prepareSheet(spreadsheet), 2, 0);
  TestUpdating.TestOnAColumn(Test.prepareSheet(spreadsheet), 0, 2);
  TestUpdating.TestOnAColumn(Test.prepareSheet(spreadsheet), 2, 2);
}

function runOnDifferentRowsAndColumnsUpdatingTestMenuAction_() {
  const spreadsheet = SpreadsheetApp.getActive();
  TestUpdating.TestOnDifferentRowsAnColumns(Test.prepareSheet(spreadsheet), 0, 0);
  TestUpdating.TestOnDifferentRowsAnColumns(Test.prepareSheet(spreadsheet), 2, 0);
  TestUpdating.TestOnDifferentRowsAnColumns(Test.prepareSheet(spreadsheet), 0, 2);
  TestUpdating.TestOnDifferentRowsAnColumns(Test.prepareSheet(spreadsheet), 2, 2);
}

function runAllUpdatingTestsMenuAction_() {
  runOnSameRowUpdatingTestMenuAction_()
  runOnSameColumnUpdatingTestMenuAction_()
  runOnARowUpdatingTestMenuAction_()
  runOnAColumnUpdatingTestMenuAction_()
  runOnDifferentRowsAndColumnsUpdatingTestMenuAction_()
}
