const { db } = require('../database');

async function getMenuItems(req, res) {
  try {
    const menuItems = await db('menu').select('*');
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
}

async function createMenuItem(req, res) {
  const { name, price, image } = req.body;

  try {
    await db('menu').insert({ name, price, image });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    getMenuItems(req, res);
  } else if (req.method === 'POST') {
    createMenuItem(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
