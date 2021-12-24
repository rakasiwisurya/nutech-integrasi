import { useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { API } from "../../config/api";

export default function ModalAddProduct({ show, handleClose }) {
  const [product, setProduct] = useState({
    name: "",
    buy_price: "",
    sell_price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setProduct((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(product);

      const response = API.post("/product", body, config);

      if (response?.status === 200) {
        NotificationManager.success(
          response.data.message,
          response.data.status
        );

        handleClose();

        setProduct({
          name: "",
          buy_price: "",
          sell_price: "",
          stock: "",
        });
      }
    } catch (error) {
      console.log(error);
      if (error?.response.data?.message) {
        return NotificationManager.error(
          error.response.data.message,
          error.response.data.status
        );
      }
    }
  };

  return (
    <div className="add-product">
      <Modal show={show} onHide={handleClose} className="text-indigo" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <FloatingLabel
              className="mb-3 text-indigo"
              controlId="name"
              label="Product Name"
            >
              <Form.Control
                type="text"
                placeholder="Product Name"
                onChange={handleChange}
                value={product.name}
              />
            </FloatingLabel>

            <FloatingLabel
              className="mb-4 text-indigo"
              controlId="buy_price"
              label="Buy Price"
            >
              <Form.Control
                type="number"
                placeholder="Buy Price"
                onChange={handleChange}
                value={product.buy_price}
              />
            </FloatingLabel>

            <FloatingLabel
              className="mb-4 text-indigo"
              controlId="sell_price"
              label="Sell Price"
            >
              <Form.Control
                type="number"
                placeholder="Sell Price"
                onChange={handleChange}
                value={product.sell_price}
              />
            </FloatingLabel>

            <FloatingLabel
              className="mb-4 text-indigo"
              controlId="stock"
              label="Stock"
            >
              <Form.Control
                type="number"
                placeholder="Stock"
                onChange={handleChange}
                value={product.stock}
              />
            </FloatingLabel>

            <div className="mb-2 d-flex justify-content-end">
              <Button variant="primary" type="submit" className="px-4 me-2">
                Add
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
