import { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import ModalAddProduct from "../atoms/ModalAddProduct";

export default function AdminHome() {
  const [isShow, setIsShow] = useState(false);
  const [products, setProducts] = useState([]);

  const handleShow = () => {
    setIsShow(true);
  };

  const handleClose = () => {
    setIsShow(false);
  };

  return (
    <div className="admin-home">
      <main>
        <Container>
          <Button variant="primary" className="mb-4" onClick={handleShow}>
            Add Product
          </Button>

          <Table striped bordered hover responsive className="text-indigo">
            <thead className="bg-indigo text-light">
              <tr>
                <th>No</th>
                <th>Images</th>
                <th>Product Name</th>
                <th>Buy Price</th>
                <th>Sell Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>airjordan.jpg</td>
                <td>Air Jordan</td>
                <td>Rp. 200,000,00</td>
                <td>Rp. 250,000,00</td>
                <td>10</td>
              </tr>
              <tr>
                <td>2</td>
                <td>nike.jpg</td>
                <td>Nike</td>
                <td>Rp. 300,000,00</td>
                <td>Rp. 350,000,00</td>
                <td>3</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </main>

      <ModalAddProduct show={isShow} handleClose={handleClose} />
    </div>
  );
}
