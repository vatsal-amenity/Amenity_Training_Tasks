const aq = require('arquero');
const op = aq.op;
const fs = require('fs');

///load csv file
const csvData = fs.readFileSync('sales_data.csv', { encoding: 'utf8' });
let dt = aq.fromCSV(csvData);
dt.print(Infinity);


//1.Concatenate DataFrames vertically
const West = dt.filter(d => d.Region === 'West');
const East = dt.filter(d => d.Region === 'East');

console.log("West Rows:", West.numRows());
console.log("East Rows:", East.numRows());

const combine = West.concat(East);
combine.print(Infinity);

//2.Merge DataFrames on a common key (inner, left, right joins)
const Manager = aq.table({
    Region: ['North', 'South', 'Central'],
    Manager: ['Alice', 'Bob', 'Charlie']
});

const dtInner = dt.join(Manager, 'Region');
console.log("--- Inner Join ---");
dtInner.select('OrderID', 'Region', 'Manager').print(Infinity);

const dtLeft = dt.join_left(Manager, 'Region');
console.log("--- Left Join ---");
dtLeft.select('OrderID', 'Region', 'Manager').print(Infinity);

const dtRight = dt.join_right(Manager, 'Region');
console.log("--- Right Join ---");
dtRight.select('OrderID', 'Region', 'Manager').print(Infinity);