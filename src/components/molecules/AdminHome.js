import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Table } from "react-bootstrap";
import { API } from "../../config/api";
import ModalAddProduct from "../atoms/ModalAddProduct";

export default function AdminHome() {
  const [products, setProducts] = useState([]);
  const [isShow, setIsShow] = useState({
    add: false,
    edit: false,
  });

  const handleShowAdd = () => {
    setIsShow((prevState) => ({ ...prevState, add: true }));
  };

  const handleShowEdit = () => {
    setIsShow((prevState) => ({ ...prevState, edit: true }));
  };

  const handleClose = () => {
    setIsShow({
      add: false,
      edit: false,
    });
  };

  const handleDelete = async () => {
    try {
      console.log("Delete");
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProduct = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  return (
    <div className="admin-home">
      <main>
        <Container>
          <Button variant="primary" className="mb-4" onClick={handleShowAdd}>
            Add Product
          </Button>

          <Table striped bordered hover responsive className="text-indigo">
            <thead className="bg-indigo text-light">
              <tr>
                <th className="text-center">No</th>
                <th className="text-center">Images</th>
                <th className="text-center">Product Name</th>
                <th className="text-center">Buy Price</th>
                <th className="text-center">Sell Price</th>
                <th className="text-center">Stock</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td className="text-center py-4" style={{ width: 70 }}>
                    {item?.id}
                  </td>
                  <td style={{ width: 80 }}>
                    <Image
                      src={item?.image}
                      alt={item?.image}
                      width={70}
                      height={70}
                      className="cursor-pointer"
                      onClick={() => {
                        window.open(item?.image);
                      }}
                      thumbnail
                    />
                  </td>
                  <td className="text-center py-4">{item?.name}</td>
                  <td className="text-center py-4">{item?.buy_price}</td>
                  <td className="text-center py-4">{item?.sell_price}</td>
                  <td className="text-center py-4">{item?.stock}</td>
                  <td className="text-center py-3" style={{ width: 200 }}>
                    <Row className="gx-0 gy-2">
                      <Col>
                        <Button
                          variant="warning"
                          className="btn-action text-white"
                          onClick={handleShowEdit}
                        >
                          Edit
                        </Button>
                      </Col>

                      <Col>
                        <Button
                          variant="danger"
                          className="btn-action"
                          onClick={handleDelete}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </main>

      <ModalAddProduct show={isShow.add} handleClose={handleClose} />
    </div>
  );
}
