import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, FloatingLabel, Form, Image } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { API } from "../config/api";
import LoadingWhite from "../assets/images/loading-white.svg";
import Header from "../components/molecules/Header";

export default function EdiProduct() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    buy_price: "",
    sell_price: "",
    stock: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);

  const getProduct = async () => {
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data.data);
      setPreview(response.data.data.imageUrl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

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

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let config;
      let formData;

      if (typeof product.image === "object") {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        formData = new FormData();
        formData.set("image", product.image, product.image.name);
        formData.set("name", product.name);
        formData.set("buy_price", product.buy_price);
        formData.set("sell_price", product.sell_price);
        formData.set("stock", product.stock);
      } else {
        config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        formData = JSON.stringify({
          name: product.name,
          buy_price: product.buy_price,
          sell_price: product.sell_price,
          stock: product.stock,
          image: product.image,
        });
      }

      const response = await API.put(
        `/products/${product.id}`,
        formData,
        config
      );

      if (response?.status === 200) {
        NotificationManager.success(
          response.data.message,
          response.data.status
        );

        setIsLoading(false);
        getProduct();
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
    <div className="edit-product">
      <Header />

      <main>
        <Card className="shadow">
          <Card.Body>
            <Card.Title className="mb-3">Edit Product</Card.Title>
            <Form onSubmit={handleUpdateProduct}>
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

              <div className="mt-4 d-flex justify-content-end">
                {isLoading ? (
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn-action me-2"
                    disabled
                  >
                    <Image src={LoadingWhite} alt={LoadingWhite} height={20} />
                  </Button>
                ) : (
                  <Button variant="primary" type="submit" className="w-100">
                    Update Product
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}
