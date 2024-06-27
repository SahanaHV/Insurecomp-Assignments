fetch('salesData.json')
  .then((response) => response.json())
  .then((data) => salesAnalysis(data));

function salesAnalysis(salesData) {
  //   Total Sales
  const totalSales = salesData.reduce(
    (sum, sale) => sum + sale['Total Price'],
    0
  );
  document.getElementById('total').innerHTML =
    'Total sales of the store is : ' + totalSales;
  // console.log('Total Sales:', totalSales);

  //   Monthwise Total
  const monthWiseSales = {};
  salesData.forEach((sale) => {
    // convert sale date string to date object
    const month = dateFns.format(new Date(sale.Date), 'yyyy-MM');
    if (!monthWiseSales[month]) {
      monthWiseSales[month] = 0;
    }
    monthWiseSales[month] += sale['Total Price'];
  });
  //   console.log('Monthwise Sales:', monthWiseSales);

  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';

  // Iterate over the data and create rows
  Object.keys(monthWiseSales).forEach((month) => {
    const row = document.createElement('tr');

    // Create and append the month cell
    const monthCell = document.createElement('td');
    monthCell.textContent = month;
    row.appendChild(monthCell);

    // Create and append the total sales cell
    const totalCell = document.createElement('td');
    totalCell.textContent = monthWiseSales[month];
    row.appendChild(totalCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Find the most popular item in each month
  //   month, sku, quantity
  const popularItems = [];
  salesData.forEach((sale) => {
    const month = dateFns.format(new Date(sale.Date), 'yyyy-MM');
    if (!popularItems[month]) {
      popularItems[month] = {};
    }
    if (!popularItems[month][sale.SKU]) {
      popularItems[month][sale.SKU] = 0;
    }
    popularItems[month][sale.SKU] += sale.Quantity;
  });

  const mostPopularItems = {};
  const mostPopularItemsQuantity = {};
  const orderStats = {};

  Object.keys(popularItems).forEach((month) => {
    const items = popularItems[month];
    let itemName = '';
    let itemQuantity = 0;
    Object.keys(items).forEach((item) => {
      if (items[item] > itemQuantity) {
        itemName = item;
        itemQuantity = items[item];
      }
    });
    mostPopularItems[month] = itemName;
    mostPopularItemsQuantity[month] = itemQuantity;

    const popularTable = document.getElementById('popular-items');
    popularTable.innerHTML = '';
    Object.keys(mostPopularItems).forEach((month) => {
      const row = document.createElement('tr');

      const monthCell = document.createElement('td');
      monthCell.textContent = month;
      row.appendChild(monthCell);

      const skuCell = document.createElement('td');
      skuCell.textContent = mostPopularItems[month];
      row.appendChild(skuCell);

      const totalCell = document.createElement('td');
      totalCell.textContent = mostPopularItemsQuantity[month];
      row.appendChild(totalCell);

      popularTable.appendChild(row);
    });

    //   For the most popular item, find the min, max and average number of orders each month.
    const orders = salesData
      .filter(
        (sale) =>
          dateFns.format(new Date(sale.Date), 'yyyy-MM') === month &&
          sale.SKU === itemName
      )
      .map((sale) => sale.Quantity);

    const minOrders = Math.min(...orders);
    const maxOrders = Math.max(...orders);
    const avgOrders =
      orders.reduce((sum, quantity) => sum + quantity, 0) / orders.length;

    orderStats[month] = {
      min: minOrders,
      max: maxOrders,
      avg: avgOrders.toFixed(2),
    };

    const minMaxAvgData = document.getElementById('min-max-avg-data');
    minMaxAvgData.innerHTML = '';
    Object.keys(orderStats).forEach((month) => {
      const row = document.createElement('tr');

      const monthCell = document.createElement('td');
      monthCell.textContent = month;
      row.appendChild(monthCell);

      const minCell = document.createElement('td');
      minCell.textContent = orderStats[month].min;
      row.appendChild(minCell);

      const maxCell = document.createElement('td');
      maxCell.textContent = orderStats[month].max;
      row.appendChild(maxCell);

      const avgCell = document.createElement('td');
      avgCell.textContent = orderStats[month].avg;
      row.appendChild(avgCell);

      minMaxAvgData.appendChild(row);
    });
  });
  //   console.log('Most Popular Items Per Month:', mostPopularItems, orderStats);

  //Items generating most revenue in each month
  const revenueItems = [];

  salesData.forEach((sale) => {
    const month = dateFns.format(new Date(sale.Date), 'yyyy-MM');
    if (!revenueItems[month]) {
      revenueItems[month] = {};
    }
    if (!revenueItems[month][sale.SKU]) {
      revenueItems[month][sale.SKU] = 0;
    }
    revenueItems[month][sale.SKU] += sale['Unit Price'] * sale.Quantity;
  });

  const mostRevenueItems = {};
  const totalRevenue = {};

  Object.keys(revenueItems).forEach((month) => {
    const items = revenueItems[month];
    let itemName = '';
    let itemQuantity = 0;
    Object.keys(items).forEach((item) => {
      if (items[item] > itemQuantity) {
        itemName = item;
        itemQuantity = items[item];
      }
    });
    mostRevenueItems[month] = itemName;
    totalRevenue[month] = itemQuantity;
  });

  const revenueData = document.getElementById('revenue-data');
  revenueData.innerHTML = '';
  Object.keys(orderStats).forEach((month) => {
    const row = document.createElement('tr');

    const monthCell = document.createElement('td');
    monthCell.textContent = month;
    row.appendChild(monthCell);

    const skuCell = document.createElement('td');
    skuCell.textContent = mostRevenueItems[month];
    row.appendChild(skuCell);

    const revenueCell = document.createElement('td');
    revenueCell.textContent = totalRevenue[month];
    row.appendChild(revenueCell);

    revenueData.appendChild(row);
  });
}
