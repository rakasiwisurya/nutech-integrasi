import { useState } from "react";
import { Button, FloatingLabel, Form, Image, Modal } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { API } from "../../config/api";
import LoadingWhite from "../../assets/images/loading-white.svg";

export default function ModalAddProduct({ show, handleClose, getAllProduct }) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    buy_price: "",
    sell_price: "",
    stock: "",
    image: "",
  });

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
    setIsLoading(true);

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

        getAllProduct();
        handleClose();
        setIsLoading(false);
        setPreview(null);
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
        NotificationManager.error(
          error.response.data.message,
          error.response.data.status
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="text-primary" centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddProduct}>
          <FloatingLabel
            className="mb-3 text-primary"
            controlId="name"
            label="Product Name"
          >
            <Form.Control
              type="text"
              placeholder="Product Name"
              onChange={handleChange}
              value={product.name}
              required
            />
          </FloatingLabel>

          <FloatingLabel
            className="mb-4 text-primary"
            controlId="buy_price"
            label="Buy Price"
          >
            <Form.Control
              type="number"
              placeholder="Buy Price"
              onChange={handleChange}
              value={product.buy_price}
              required
            />
          </FloatingLabel>

          <FloatingLabel
            className="mb-4 text-primary"
            controlId="sell_price"
            label="Sell Price"
          >
            <Form.Control
              type="number"
              placeholder="Sell Price"
              onChange={handleChange}
              value={product.sell_price}
              required
            />
          </FloatingLabel>

          <FloatingLabel
            className="mb-4 text-primary"
            controlId="stock"
            label="Stock"
          >
            <Form.Control
              type="number"
              placeholder="Stock"
              min={0}
              onChange={handleChange}
              value={product.stock}
              required
            />
          </FloatingLabel>

          <Form.Group controlId="image" className="mb-3 text-primary">
            <Form.Control type="file" onChange={handleChange} required />
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
            {isLoading ? (
              <>
                <Button
                  variant="primary"
                  type="submit"
                  className="btn-action me-2"
                  disabled
                >
                  <Image src={LoadingWhite} alt={LoadingWhite} height={20} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="btn-action"
                  disabled
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  type="submit"
                  className="btn-action me-2"
                >
                  Add
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="btn-action"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
