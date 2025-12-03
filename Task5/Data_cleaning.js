const aq = require('arquero');
const op = aq.op;
const fs = require('fs');

///load csv file
const csvData = fs.readFileSync('sales_data.csv', { encoding: 'utf8' });
let dt = aq.fromCSV(csvData);
dt.print(Infinity);

//1. Detect columns with missing values
// console.log("******************detect columns with missing values***************");
// const missingSummary = dt.rollup({
//     missing_Category: d =>op.sum(d.Category === null || d.Category === "" ? 1 : 0),
//     missing_Price:    d => op.sum(d.Price === null || d.Price === ""? 1 : 0),
//     missing_Quantity: d => op.sum(d.Quantity === null || d.Quantity === "" ? 1 : 0),
//     missing_Revenue:  d => op.sum(d.Revenue === null || d.Revenue === "" ? 1 : 0)
// });

// missingSummary.print();

//2.Count missing values per column
console.log("******************count missing values per column***************");
dt.rollup({
    nulls_price: d => op.sum(d.Price === null ? 1 : 0),
    nulls_category: d => op.sum(d.Category === null ? 1 : 0),
    nulls_Quantity: d => op.sum(d.Quantity === null ? 1 : 0),
    nulls_Revenue: d => op.sum(d.Revenue === null ? 1 : 0)
}).print(Infinity);

//3. Fill missing numeric values using mean or median
console.log("******************fill missing numeric values using mean or median***************");
const fill_price = dt.impute({
    Price: () => op.mean('Price'),
    Quantity: () => 0
});

fill_price.print(Infinity);

//4. Fill missing categorical values using placeholders or mode
console.log("******************fill missing categorical values using placeholders or mode***************");
const fill_category = dt.impute({
    Category: () => 'Unknown'
});
fill_category.print(Infinity);

//5. Drop rows with missing values
// console.log("******************drop rows with missing values***************");
// const remove = dt.filter(d => op.valid(d.Price) && op.valid(d.Product));
// remove.print(Infinity);

//6. Drop specific columns
console.log("******************Drop specific columns***************");
const drop = dt.select(aq.not('Region'));
drop.print(Infinity);

//7. Create new columns from arithmetic between existing columns
console.log("******************Create new columns from arithmetic between existing columns***************");
const Calculate = dt.derive({
    Calculate_Revenue: d => d.Price * d.Quantity
});
Calculate.select('OrderID', 'Price', 'Quantity', 'Calculate_Revenue').print();

//9. Extract month or year from a datetime column
console.log("******************Extract month or year from a datetime column***************");
const Extract = dt.derive({
    OrderDate: d => op.parse_date(d.OrderDate)
})
.derive({
    Year: d => op.year(d.OrderDate),
    Month: d => op.month(d.OrderDate) + 1 
});
Extract.select('OrderID', 'OrderDate', 'Year', 'Month').print(Infinity);

//10. Rename columns
console.log("******************Rename columns***************");
const Rename = dt.rename({
    Revenue: 'Total_sell',
    OrderID: 'ID'
});

Rename.print();

//11. Change column data types
console.log("******************Change column data types***************");
const datatype = dt.derive({
    Quantity: d => op.parse_int(d.Quantity)
});
datatype.print();

//12. Remove duplicate rows
console.log("******************Remove duplicate rows***************");
const dtUnique = dt.dedupe('OrderID');
dtUnique.print(Infinity);

//13. Apply custom functions to columns
console.log("******************Apply custom functions to columns***************");
// const calculateTax = (price) => price * 0.18;

// const dtCustom = dt.derive({
//     Tax_Amount: d => calculateTax(d.Price)
// });

// dtCustom.select('OrderID', 'Price', 'Tax_Amount').print();