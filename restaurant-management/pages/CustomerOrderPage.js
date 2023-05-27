import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerOrderPage() {
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedItems]);

  async function fetchMenu() {
    try {
      const response = await fetch('/api/menu');
      const menuData = await response.json();
      setMenu(menuData);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  }

  function handleItemClick(item) {
    setSelectedItems(prevItems => [...prevItems, item]);
  }

  function handleRemoveItem(item) {
    setSelectedItems(prevItems =>
      prevItems.filter(selectedItem => selectedItem.id !== item.id)
    );
  }

  function calculateTotalPrice() {
    const totalPrice = selectedItems.reduce(
      (total, item) => total + parseFloat(item.price),
      0
    );
    setTotalPrice(totalPrice);
  }

  async function handlePlaceOrder() {
    if (selectedItems.length === 0) {
      alert('Please select at least one item before placing the order.');
      return;
    }

    if (!customerName ) {
      alert('Please provide your name and phone number.');
      return;
    }

    const orderData = {
      items: selectedItems,
      customerName,
      customerNumber,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        setSelectedItems([]);
        setCustomerName('');
        setCustomerNumber('');
        // Add navigation to the Orders page
        window.location.href = '/CustomerOrderPage';
      } else {
        alert('Failed to place the order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order. Please try again later.');
    }
  }

  return (
    <div className="container">
      <div className="order-section">
        <h2>Menu</h2>
        <div className="menu-list">
          {menu.map(item => (
            <div key={item.id} className="menu-item">
              {item.image && <img src={item.image} alt={item.name} />}
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-price">VND {Number(item.price).toFixed(2)}</div>
                <div className="item-description">{item.description}</div>
              </div>
              <button
                className="add-button"
                onClick={() => handleItemClick(item)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="order-section">
        <h2>Selected Items</h2>
        {selectedItems.length === 0 ? (
          <p>No items selected</p>
        ) : (
          <ul className="selected-items-list">
            {selectedItems.map(item => (
              <li key={item.id} className="selected-item">
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
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="customer-details">
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={customerNumber}
            onChange={e => setCustomerNumber(e.target.value)}
          />
        </div>

        <div className="checkout">
          <div className="total-price">
                  {totalPrice
                    ? parseFloat(totalPrice).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    : 'N/A'}
                </div>
          <button className="checkout-button" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`

@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

        .container {
          display: flex;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Quicksand', sans-serif;
          background-color: #706630;
        }

        .order-section {
          width: 60%;
          border-radius: 10px;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .menu-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 10px;
          padding: 20px;
          background: linear-gradient(135deg, #ffae00, #ff6600);
          transition: background-color 0.3s ease;
          height: 200px;
          width: 150px;
        }

        .menu-item:hover {
          background-color: #ff6600;
        }

        .menu-item img {
          width: 128px;
          height: 128px;
          object-fit: cover; /* Maintain the aspect ratio and cover the entire space */
          border-radius: 10px;
        }

        .selected-items-list {
          list-style: none;
          padding: 0;
        }

        .selected-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .item-name {
          font-size: 18px;
          font-weight: bold;
          color: #333333;
        }

        .item-price {
          font-size: 14px;
          color: #000000;
        }

        .add-button,
        .remove-button {
          background-color: #ff8c00;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Your Beautiful Font', sans-serif; /* Replace 'Your Beautiful Font' with the desired font name */
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .add-button:hover,
        .remove-button:hover {
          background-color: #ff6600;
        }

        .customer-details {
          display: flex;
          flex-direction: column;
          margin-top: 20px;
        }

        .customer-details input {
          padding: 8px;
          margin-bottom: 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .checkout {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }

        .total-price {
          font-size: 18px;
          font-weight: bold;
          color: #333333;
        }

        .checkout-button {
          background-color: #ff6600;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Your Beautiful Font', sans-serif; /* Replace 'Your Beautiful Font' with the desired font name */
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .checkout-button:hover {
          background-color: #ff8c00;
        }
      `}</style>
    </div>
  );
}
