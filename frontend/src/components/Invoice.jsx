import React from "react";
import { Card, Table } from "react-bootstrap";

const Invoice = ({ orderData }) => {
  if (!orderData) {
    return null;
  }

  const {
    orderItems,
    itemsPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    createdAt,
  } = orderData;
  const invoiceDate = new Date(createdAt).toLocaleDateString();
  const invoiceTime = new Date(createdAt).toLocaleTimeString();

  return (
    <Card id="invoice-content" className="p-4">
      <div className="text-center mb-4">
        <h4>Grocery Billing System</h4>
        <p>Invoice #{orderData._id.substring(18)}</p>
        <p>
          Date: {invoiceDate} | Time: {invoiceTime}
        </p>
      </div>
      <Table bordered className="mb-4">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.price * item.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end mb-2">
        <strong>Subtotal:</strong>
        <span className="ms-auto">${itemsPrice.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-end mb-2">
        <strong>Tax:</strong>
        <span className="ms-auto">${taxPrice.toFixed(2)}</span>
      </div>
      {discountAmount > 0 && (
        <div className="d-flex justify-content-end mb-2 text-success">
          <strong>Discount:</strong>
          <span className="ms-auto">- ${discountAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="d-flex justify-content-end border-top pt-2">
        <h4>Total:</h4>
        <h4 className="ms-auto">${totalPrice.toFixed(2)}</h4>
      </div>
    </Card>
  );
};

export default Invoice;
