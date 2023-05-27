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

async function updateOrderStatus(req, res) {
    const { orderId, status } = req.body;
  
    // Validate the request
    if (!orderId || !status) {
      return res.status(400).json({ message: 'Invalid request' });
    }
  
    try {
      const connection = await connectToDatabase();
  
      console.log('Updating order status in the database...');
      const [result] = await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      console.log('Order status updated successfully');
      res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status' });
    }
  }
  
  export default updateOrderStatus;