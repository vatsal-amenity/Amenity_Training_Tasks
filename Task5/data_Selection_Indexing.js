const aq = require('arquero');
const fs = require('fs');

///load csv file
const csvData = fs.readFileSync('sales_data.csv', { encoding: 'utf8' });
let dt = aq.fromCSV(csvData);
dt.print();

//1.Select a single column
console.log("******************select a single column***************");
dt.select("Product").print();

//2.Select multiple columns
console.log("******************select multiple columns***************");
dt.select("Product", "Price", "Quantity").print();

//3.Select a row by index position
console.log("******************select a row by index position***************");
dt.slice(2, 3).print();

//4.Select a range of rows
console.log("******************select a range of rows***************");
dt.slice(1, 5).print();

//5.Set a column as index
console.log("******************set a column as index***************");
// const indexedData = dt.lookup('OrderID');
// console.log("Lookup result for 'ORD003':", indexedData.get('ORD003'));

//6.Select rows using index labels
console.log("******************select rows using index labels***************");
dt.filter(d => d.OrderID === 'ORD005').print();

//7.Select rows and columns using labeled indexing (loc)
console.log("******************select rows and columns using labeled indexing (loc)***************");
dt.filter(d => d.OrderID === 'ORD005')
  .select('Product', 'Price')
  .print();

//8.Select rows and columns using positional indexing (iloc)
console.log("******************select rows and columns using positional indexing (iloc)***************");
dt.slice(0, 3)
  .select('Product', 'Revenue')
  .print();
