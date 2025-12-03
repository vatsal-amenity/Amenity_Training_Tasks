const aq = require('arquero');
const op = aq.op;
const fs = require('fs');

///load csv file
const csvData = fs.readFileSync('sales_data.csv', { encoding: 'utf8' });
let dt = aq.fromCSV(csvData);
dt.print(Infinity);

//1.Sort by a single column (ascending or descending)
const sort = dt.orderby('Price')
sort.print(Infinity);

//2.Sort by multiple columns
const mulsort = dt.orderby('Region', aq.desc("Price"), aq.desc('Quantity'))
mulsort.print(Infinity);