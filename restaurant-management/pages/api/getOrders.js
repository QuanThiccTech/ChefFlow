import mysql from 'mysql2/promise';

async function connectToDatabase() {
  console.log('Connecting to the database...');
  try {
    const connection = await mysql.createConnection({
      host: 'qtt.ddns.net',
      user: 'chefflow',
      password: '123123',
      database: 'chefflow',
    });

    console.log('Connected to the database');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

async function getOrders(req, res) {
  try {
    const connection = await connectToDatabase();

    console.log('Fetching orders from the database...');
    const [rows] = await connection.query('SELECT * FROM orders');

    const orders = rows.map((row) => ({
      id: row.id,
      items: JSON.parse(row.items),
      customerName: row.customerName,
      status: row.status,
      timestamp: row.timestamp,
    }));

    console.log('Orders fetched successfully:', orders);
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

export default getOrders;
