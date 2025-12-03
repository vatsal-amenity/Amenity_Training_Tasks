const aq = require('arquero');
const op = aq.op;
const fs = require('fs');

// CSV File Load 
const csvData = fs.readFileSync('sales_data.csv', { encoding: 'utf8' });
let dt = aq.fromCSV(csvData);
dt.print();


//1.Filter rows based on numerical conditions
console.log("******************filter rows based on numerical conditions***************");
dt.filter((d) => d.Price > 100)
  .print();

//2.Filter rows based on categorical conditions
console.log("******************filter rows based on categorical conditions***************");
dt.filter((d) => d.Product === 'Notebook')
  .print();

//3.Filter rows using multiple conditions together
console.log("******************filter rows using multiple conditions together***************");
dt.filter((d) => d.Price > 100 && d.Product === 'Laptop')
    .print();

//4.Filter rows where values are in a list
console.log("******************filter rows where values are in a list***************");
// const allowedProduct = ['Laptop', 'Mouse'];
// dt.filter(d => { return allowedProduct.includes(d.Product)})
//     .print();


//5.Remove rows with missing values in specific columns
console.log("******************remove rows with missing values in specific columns***************");
dt.filter(d => op.valid(d.Price))
.print()
