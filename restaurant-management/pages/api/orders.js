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

async function placeOrder(req, res) {
  const { items, customerName } = req.body;

  // Validate the request
  if (!items || !customerName) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const connection = await connectToDatabase();

    console.log('Inserting new order into the database...');
    const [result] = await connection.query(
      'INSERT INTO orders (items, customerName, status, timestamp) VALUES (?, ?, ?, ?)',
      [JSON.stringify(items), customerName, 'Pending', new Date()]
    );

    const orderId = result.insertId;

    console.log('Retrieving the created order from the database...');
    const [orderRows] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);

    const newOrder = orderRows[0];

    console.log('Order placed successfully:', newOrder);
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
}

export default placeOrder;
