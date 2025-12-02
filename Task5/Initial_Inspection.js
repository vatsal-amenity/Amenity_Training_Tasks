const aq = require('arquero');
const fs = require('fs');

//1. Load CSV into DataFrame
console.log("******************load csv into DataFrame***************");
const csvData = fs.readFileSync('sales_data.csv', { encoding: 'utf8' });
let dt = aq.fromCSV(csvData);
dt.print();

//2.View first N rows
console.log("******************view first N rows***************");
dt.slice(0, 5).print();

//3.View last N rows
console.log("******************view last N rows***************");
dt.slice(-5).print();

// 4. Get DataFrame shape
console.log("******************get DataFrame shape***************");
console.log(`Rows: ${dt.numRows()}, columns: ${dt.numCols()}`);

// 5. List all column names
console.log("******************list all column names***************");
console.log(dt.columnNames());

//6. Check column data types
console.log("******************check column data types***************");
const firstRow = dt.object(0);
Object.keys(firstRow).forEach(col => {
    console.log(`${col}: ${typeof firstRow[col]}`);
});

// 7. Get summary statistics for numeric columns
console.log("******************get summary statistics for numeric columns***************");
// console.log("\n--- Summary Statistics (Numeric) ---");
dt.rollup({
    avg_price: aq.op.mean('Price'),
    min_price: aq.op.min('Price'),
    max_price: aq.op.max('Price'),
    avg_qty: aq.op.mean('Quantity'),
    total_rows: aq.op.count()
}).print();

//8.Get summary statistics for all columns
console.log("******************get summary statistics for all columns***************");

dt.columnNames().forEach(colName => {
    console.log(`\n--- Column: ${colName} ---`);
    const firstVal = dt.object(0)[colName]; 
    const isNumeric = typeof firstVal === 'number';

    if (isNumeric) {
        dt.rollup({
            Type: () => 'Numeric',      
            TotalRows: aq.op.count(),   
            Min: aq.op.min(colName),    
            Max: aq.op.max(colName),    
            Mean: aq.op.mean(colName),  
            Median: aq.op.median(colName) 
        }).print();
    } else {
        dt.rollup({
            Type: () => 'String/Text',  
            TotalRows: aq.op.count(),   
            UniqueValues: aq.op.distinct(colName) 
        }).print();
    }
});

//9.Count unique values per column
console.log("******************count unique values per column***************");
dt.columnNames().forEach(col => {
    const uniqueCount = dt.groupby(col).count().numRows();
    console.log(`${col}: ${uniqueCount}`);
});