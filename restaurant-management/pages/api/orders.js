import ordersData from '../../database/orders.json';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(ordersData);
  }
}
