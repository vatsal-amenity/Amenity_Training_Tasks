const aq = require('arquero');
const op = aq.op;
const fs = require('fs');

///load csv file
const csvData = fs.readFileSync('sales_data.csv', { encoding: 'utf8' });
let dt = aq.fromCSV(csvData);
dt.print(Infinity);

//1.Group data by one column and compute sums
const Sum = dt
  .groupby('Category')
  .rollup({
    Total_Revenue: op.sum('Revenue')
  });
Sum.print(Infinity);

//2.Group data by one column and compute means
const Mean = dt
  .groupby('Region')
  .rollup({
    Avg: op.mean('Price')
  });
Mean.print(Infinity);

//3.Group data by multiple columns and count occurrences
const mulcolumn = dt
  .groupby('Region', 'Product')
  .count();

mulcolumn.print(Infinity);

//4.Compute min and max values for each group
const Minmax = dt
  .groupby('Category')
  .rollup({
    Min_Price: op.min('Price'),
    Max_Price: op.max('Price')
  });

Minmax.print(Infinity);

//5.Count unique items in each group
const Unique_item = dt
  .groupby('Region')
  .rollup({
    Unique_item: op.distinct('Product')
  });
Unique_item .print(Infinity);

//6.Get group sizes
const GroupSize = dt
  .groupby('Category')
  .rollup({
    Order_Count: op.count()
  });
GroupSize.print(Infinity);

//7.Apply multiple aggregations using a single operation
const aggregations = dt
  .groupby('Product')
  .rollup({
    Total_Sales: op.sum('Revenue'),
    Avg_Price: op.mean('Price'),
    Order_Count: op.count(),
    Max_Sale: op.max('Revenue')
  });

aggregations.print(Infinity);