import { useEffect, useState } from 'react';

export default function Admin() {
  const [menu, setMenu] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const response = await fetch('/api/menu');
      const menuData = await response.json();
      setMenu(menuData);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  }

  async function handleAddItem() {
    try {
      const newItem = {
        name: itemName,
        price: itemPrice,
        image: itemImage
      };

      await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });

      setItemName('');
      setItemPrice('');
      setItemImage('');
      fetchMenu();
    } catch (error) {
      console.error('Error adding item:', error);
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

  return (
    <div className="container">
      <div className="section">
        <h2 className="section-title">Menu</h2>
        <div className="menu">
          {menu.map((item) => (
            <div key={item.id} className="menu-item">
              {item.image && <img src={item.image} alt={item.name} />}
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-price">Price: {item.price
                    ? parseFloat(item.price).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    : 'N/A'}</div>
                <button
                className="delete-button"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Add Item</h2>
        <div className="item-adder">
          <input
            type="text"
            placeholder="Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={itemImage}
            onChange={(e) => setItemImage(e.target.value)}
          />
          <button onClick={handleAddItem}>Add Item</button>
        </div>
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

        .menu-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
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

        ul {
          list-style-type: none;
          padding: 0;
        }

        li {
          margin-bottom: 10px;
        }

        button {
          background-color: #ff7f11;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-left: 10px;
        }

        button:hover {
          background-color: #ff5811;
        }
      `}</style>
    </div>
  );
}
