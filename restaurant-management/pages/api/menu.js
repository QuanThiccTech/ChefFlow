import mysql from 'mysql2/promise';

async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'qtt.ddns.net',
    user: 'chefflow',
    password: '123123',
    database: 'chefflow',
  });

  return connection;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const [menuItems] = await db.query('SELECT * FROM menu');
      res.json(menuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  } else if (req.method === 'POST') {
    const { name, price, image } = req.body;

    try {
      const db = await connectToDatabase();
      const [result] = await db.query('INSERT INTO menu (name, price, image) VALUES (?, ?, ?)', [name, price, image]);
      const itemId = result.insertId;
      res.status(201).json({ id: itemId, success: true });
    } catch (error) {
      console.error('Error creating menu item:', error);
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  } else if (req.method === 'DELETE') {
    const itemId = req.query.itemId;

    try {
      const db = await connectToDatabase();
      await db.query('DELETE FROM menu WHERE id = ?', [itemId]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
