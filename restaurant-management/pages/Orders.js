import React, { useState, useEffect } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [deniedOrders, setDeniedOrders] = useState([]);

  useEffect(() => {
    fetch('/api/getOrders')
      .then((response) => response.json())
      .then((data) => {
        const allOrders = data.orders;
        const accepted = allOrders.filter((order) => order.status === 'Accepted');
        const denied = allOrders.filter((order) => order.status === 'Denied');
        const pending = allOrders.filter((order) => order.status === 'Pending');
        setOrders(pending);
        setAcceptedOrders(accepted);
        setDeniedOrders(denied);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);
  

  const fetchOrders = () => {
    fetch('/api/getOrders')
      .then((response) => response.json())
      .then((data) => {
        const allOrders = data.orders.map((order) => {
          const itemsWithDetails = [];
          order.items.forEach((item) => {
            const existingItem = itemsWithDetails.find((i) => i.name === item.name);
            if (existingItem) {
              existingItem.amount += 1;
              existingItem.price += item.price;
            } else {
              itemsWithDetails.push({
                ...item,
                amount: 1,
              });
            }
          });
  
          return {
            ...order,
            items: itemsWithDetails,
          };
        });
  
        const accepted = allOrders.filter((order) => order.status === 'Accepted');
        const denied = allOrders.filter((order) => order.status === 'Denied');
        const pending = allOrders.filter((order) => order.status === 'Pending');
        setOrders(pending);
        setAcceptedOrders(accepted);
        setDeniedOrders(denied);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  };
  

  const handleAcceptOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Accepted',
        };
      }
      return order;
    });
  
    setOrders(updatedOrders);
  
    fetch(`/api/updateOrderStatus`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, status: 'Accepted' }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Order status updated successfully.');
          fetchOrders(); // Fetch orders again to update the list
        } else {
          console.error('Failed to update order status.');
        }
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
      });
  };
  
  const handleDenyOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Denied',
        };
      }
      return order;
    });
  
    setOrders(updatedOrders);
  
    fetch(`/api/updateOrderStatus`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, status: 'Denied' }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Order status updated successfully.');
          fetchOrders(); // Fetch orders again to update the list
        } else {
          console.error('Failed to update order status.');
        }
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
      });
  };
  
  const updateOrderStatus = (orderId, status) => {
    fetch(`/api/updateOrderStatus/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Order status updated:', data.message);
        // Refresh the orders or update the specific order in the UI
        fetchOrders();
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
      });
  };

  return (
    <div className="container">
    <div className="orders-page">
      <h2>Orders</h2>
      <div className="orders-container">
        <div className="orders-section">
          <div className="section-header">Pending Orders</div>
          {orders.map((order) => (
            <div className="order-box">
            <div className="order-details">
              <div className="order-id">Order #{order.id}</div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id}>
                    <div>{item.name}</div>
                    <div>Price: {item.price
                    ? parseFloat(item.price).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    : 'N/A'}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-customer">Customer: {order.customerName}</div>
                  <div className="order-time">
        Time: {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
        {new Date(order.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}
      </div>
            <div className="order-actions">
              <button className="accept-button" onClick={() => handleAcceptOrder(order.id)}>
                Accept
              </button>
              <button className="deny-button" onClick={() => handleDenyOrder(order.id)}>
                Deny
              </button>
            </div>
          </div>
          
          ))}
        </div>


          <div className="orders-section">
            <div className="section-header">Accepted Orders</div>
            {acceptedOrders.map((order) => (
              <div className="order-box">
              <div className="order-details">
                <div className="order-id">Order #{order.id}</div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <div>{item.name}</div>
                      <div>Price: {item.price
                    ? parseFloat(item.price).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    : 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-customer">Customer: {order.customerName}</div>
              <div className="order-time">
        Time: {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
        {new Date(order.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}
      </div>
              <div className="order-status accepted">Status: {order.status}</div>
            </div>            
            ))}
          </div>

          <div className="orders-section">
            <div className="section-header">Denied Orders</div>
            {deniedOrders.map((order) => (
              <div className="order-box">
              <div className="order-details">
                <div className="order-id">Order #{order.id}</div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <div>{item.name}</div>
                      <div>Price: {item.price
                    ? parseFloat(item.price).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    : 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-customer">Customer: {order.customerName}</div>
              <div className="order-time">
        Time: {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
        {new Date(order.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}
      </div>
              <div className="order-status denied">Status: {order.status}</div>
            </div>
            
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

        .container {
          background: linear-gradient(to bottom right, #ffbc00, #ff7300);
          padding: 20px;
          border-radius: 10px;
          font-family: 'Quicksand', sans-serif;
        }

        .orders-page {
          color: black;
        }

        .orders-container {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .orders-section {
          flex: 1;
          margin: 0 10px;
        }

        .section-header {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .order-box {
          background-color: #fff;
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 10px;
          box-shadow: 1px 1px;
        }
      
        .order-details {
          margin-bottom: 10px;
        }
      
        .order-id {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 5px;
        }
      
        .order-items {
          margin-bottom: 10px;
        }
      
        .order-items div {
          margin-bottom: 5px;
        }
      
        .order-customer {
          font-weight: bold;
          margin-bottom: 5px;
        }
      
        .order-time {
          margin-bottom: 5px;
        }
      
        .order-status {
          font-weight: bold;
          margin-top: 5px;
        }

        .customer-name {
          margin-top: 5px;
          font-size: 14px;
          color: #555;
        }

        .order-items {
          margin-top: 5px;
          font-size: 14px;
          color: #555;
        }

        .order-actions {
          display: flex;
          align-items: center;
        }

        .accept-button,
        .deny-button {
          margin-left: 10px;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }

        .accept-button {
          background-color: #5cb85c;
          color: white;
        }

        .deny-button {
          background-color: #d9534f;
          color: white;
        }

        .order-status {
          font-weight: bold;
          margin-top: 5px;
        }

        .denied {
          color: red;
        }

        .accepted {
          color: green;
        }
      `}</style>
    </div>
  );
}

export default Orders;
