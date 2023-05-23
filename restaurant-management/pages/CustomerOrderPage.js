import { useEffect, useState } from 'react';

export default function CustomerOrderPage() {
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedItems]);

  async function fetchMenu() {
    const response = await fetch('/api/menu');
    const menuData = await response.json();
    setMenu(menuData);
  }

  function handleItemClick(item) {
    setSelectedItems(prevItems => [...prevItems, item]);
  }

  function handleRemoveItem(item) {
    setSelectedItems(prevItems => prevItems.filter(selectedItem => selectedItem.id !== item.id));
  }

  function calculateTotalPrice() {
    const totalPrice = selectedItems.reduce((total, item) => total + parseFloat(item.price), 0);
    setTotalPrice(totalPrice);
  }

  function handlePlaceOrder() {
    // Implement the logic to place the order here
    console.log('Placing order:', selectedItems);
  }

  return (
    <div className="container">
      <div className="order-section">
        <h2>Menu</h2>
        <div className="menu-list">
          {menu.map((item) => (
            <div key={item.id} className="menu-item">
              {item.image && <img src={item.image} alt={item.name} />}
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-price">VND {Number(item.price).toFixed(2)}</div><br></br>
                <button className="add-button" onClick={() => handleItemClick(item)}>Add</button>
              </div>
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
            {selectedItems.map((item) => (
              <li key={item.id} className="selected-item">
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">VND {Number(item.price).toFixed(2)}</div>
                </div>
                <button className="remove-button" onClick={() => handleRemoveItem(item)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <div className="checkout">
          <div className="total-price">Total: VND {Number(totalPrice).toFixed(2)}</div>
          <button className="checkout-button" onClick={handlePlaceOrder}>Place Order</button>
        </div>
      </div>

      <style jsx>{`
  .container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Your Beautiful Font', sans-serif; /* Replace 'Your Beautiful Font' with the desired font name */
    background-color: #706630
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
  }

  .checkout {
    margin-top: 20px;
    text-align: right;
  }

  .total-price {
    font-size: 18px;
    font-weight: bold;
    color: #ff8c00;
  }

  .checkout-button {
    background-color: #ff8c00;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Your Beautiful Font', sans-serif; /* Replace 'Your Beautiful Font' with the desired font name */
  }
`}</style>



    </div>
  );
}
