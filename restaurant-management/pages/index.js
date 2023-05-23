import { useEffect, useState } from 'react';

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');

  useEffect(() => {
    fetchMenu();
    fetchOrders();
  }, []);

  async function fetchMenu() {
    const response = await fetch('/api/menu');
    const menuData = await response.json();
    setMenu(menuData);
  }

  async function fetchOrders() {
    const response = await fetch('/api/orders');
    const ordersData = await response.json();
    setOrders(ordersData);
  }

  async function handleAddItem(event) {
    event.preventDefault();

    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: itemName,
        price: parseFloat(itemPrice),
        image: itemImage,
      }),
    });

    if (response.ok) {
      setItemName('');
      setItemPrice('');
      setItemImage('');
      fetchMenu();
    }
  }

  async function handleDeleteItem(itemId) {
    const response = await fetch(`/api/menu?itemId=${itemId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchMenu();
    }
  }

  async function handleOrderPlaced(order) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      fetchOrders();
    }
  }

  return (
    <div className="container">
      <div className="section">
        <h2>Menu</h2>
        <ul>
          {menu.map((item) => (
            <li key={item.id} className="menu-item">
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-price">
                  {item.price
                    ? parseFloat(item.price).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    : 'N/A'}
                </div>
              </div>
              {item.image && <img src={item.image} alt={item.name} />}
              <button
                className="delete-button"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Orders</h2>
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Order #{order.id}: {order.items.length} items
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Item Adder</h2>
        <form onSubmit={handleAddItem} className="item-adder-form">
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Item Price"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Item Image URL"
            value={itemImage}
            onChange={(e) => setItemImage(e.target.value)}
          />
          <button type="submit" className="add-item-button">
            Add Item
          </button>
        </form>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

        .container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          font-family: 'Quicksand', sans-serif;
        }

        .section {
          background-color: #ffad61;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .section-title {
          margin-bottom: 10px;
          background-color: #ff7f11;
          padding: 5px 10px;
          border-radius: 8px;
          display: inline-block;
        }

        .menu-item {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 200px;
          height: 250px;
          border-radius: 8px;
          background-color: #ff7f11;
          padding: 10px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .menu-item .item-image {
          width: 128px;
          height: 128px;
          object-fit: cover;
          border-radius: 8px;
        }

        .menu-item .item-name {
          font-weight: bold;
        }

        .menu-item .item-price {
          font-weight: bold;
        }

        .menu-item img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }

        .menu-item:hover {
          transform: scale(1.05);
        }

        .menu-item .item-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 10px;
        }

        .menu-item .item-name {
          font-weight: bold;
        }

        .menu-item .item-price {
          font-weight: bold;
        }

        .menu-item .item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }

        .delete-button {
          background-color: #ff7f11;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .delete-button:hover {
          background-color: #ff5811;
        }

        .item-adder-form {
          display: flex;
          gap: 10px;
        }

        .add-item-button {
          background-color: #ff7f11;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-item-button:hover {
          background-color: #ff5811;
        }
      `}</style>
    </div>
  );
}
