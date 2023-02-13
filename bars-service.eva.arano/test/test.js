const request = require("supertest");

const { readCSV, readTXT } = require(`../src/fileReader`);

test("Read Invalid CSV Request With Invalid Billing Cycle", () => {
  readCSV("billing-cycle-not-on-range-csv.csv", function (e, request = {}) {
    expect(request).toEqual("ERROR: Billing Cycle not on range at row 4");
    expect(e).toEqual(undefined);
  });
});

test("Read Invalid CSV Request With Invalid Start Date Format", () => {
  readCSV("invalid-start-date-csv.csv", function (e, request = {}) {
    expect(request).toEqual("ERROR: Invalid start date at row 1");
    expect(e).toEqual(undefined);
  });
});

test("Read Invalid CSV Request With Invalid End Date Format", () => {
  readCSV("invalid-end-date-csv.csv", function (e, request = {}) {
    expect(request).toEqual("ERROR: Invalid end date at row 7");
    expect(e).toEqual(undefined);
  });
});

test("Read Invalid TXT Request With Invalid Billing Cycle", () => {
  readCSV("billing-cycle-not-on-range-txt.txt", function (e, request = {}) {
    expect(request).toEqual("ERROR: Billing Cycle not on range at row 3");
    expect(e).toEqual(undefined);
  });
});

test("Read Invalid TXT Request With Invalid Start Date Format", () => {
  readCSV("invalid-start-date-txt.txt", function (e, request = {}) {
    expect(request).toEqual("ERROR: Invalid start date at row 3");
    expect(e).toEqual(undefined);
  });
});

test("Read Invalid TXT Request With Invalid End Date Format", () => {
  readCSV("invalid-end-date-txt.txt", function (e, request = {}) {
    expect(request).toEqual("ERROR: Invalid end date at row 1");
    expect(e).toEqual(undefined);
  });
});

test("Read Invalid CSV Request With Invalid Billing Cycle", () => {
  readCSV("billing-cycle-not-on-range-csv.csv", function (e, request = {}) {
    expect(request).toEqual("ERROR: Billing Cycle not on range at row 4");
    expect(e).toEqual(undefined);
  });
});

test("Read Invalid CSV Request With Invalid Start Date Format", () => {
  readCSV("invalid-start-date-csv.csv", function (e, request = {}) {
    expect(request).toEqual("ERROR: Invalid start date at row 1");
    expect(e).toEqual(undefined);
  });
});

test("Read an empty CSV File", () => {
  readCSV("empty-csv.csv", function (e, request = {}) {
    expect(request).toEqual(`No request(s) to read from the input file.`);
    expect(e).toEqual(undefined);
  });
});

test("Read an empty TXT File", () => {
  readCSV("empty-txt.txt", function (e, request = {}) {
    expect(request).toEqual(`No request(s) to read from the input file.`);
    expect(e).toEqual(undefined);
  });
});
