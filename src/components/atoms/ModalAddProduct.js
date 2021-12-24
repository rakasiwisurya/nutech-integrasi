import { useState } from "react";
import { Button, FloatingLabel, Form, Image, Modal } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { API } from "../../config/api";

export default function ModalAddProduct({ show, handleClose }) {
  const [preview, setPreview] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    buy_price: "",
    sell_price: "",
    stock: "",
    image: "",
  });

  console.log(product);

  const handleChange = (e) => {
    setProduct((prevState) => ({
      ...prevState,
      [e.target.id]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    }));

    if (e.target.type === "file") {
      const fileList = e.target.files;

      for (const file of fileList) {
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set("image", product.image, product.image.name);
      formData.set("name", product.name);
      formData.set("buy_price", product.buy_price);
      formData.set("sell_price", product.sell_price);
      formData.set("stock", product.stock);

      const response = await API.post("/products", formData, config);

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
          image: "",
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
                min={0}
                onChange={handleChange}
                value={product.stock}
              />
            </FloatingLabel>

            <Form.Group controlId="image" className="mb-3 text-indigo">
              <Form.Control type="file" onChange={handleChange} />
            </Form.Group>

            {preview && (
              <Image
                src={preview}
                alt="Product Image"
                width={100}
                height={100}
                thumbnail
              />
            )}

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
