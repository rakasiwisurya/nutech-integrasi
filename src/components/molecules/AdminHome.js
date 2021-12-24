import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Container, Image, Row, Table } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { API } from "../../config/api";
import ModalAddProduct from "../atoms/ModalAddProduct";
import Pagination from "../atoms/Pagination";

export default function AdminHome() {
  const history = useHistory();

  let productPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [isShow, setIsShow] = useState({
    add: false,
    edit: false,
  });

  const indexOfLastPage = currentPage * productPerPage;
  const indexOfFirstPage = indexOfLastPage - productPerPage;
  const currentProduct = products.slice(indexOfFirstPage, indexOfLastPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleShowAdd = () => {
    setIsShow((prevState) => ({ ...prevState, add: true }));
  };

  const handleClose = () => {
    setIsShow({
      add: false,
      edit: false,
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await API.delete(`/products/${id}`);
      if (response.status === 200) {
        NotificationManager.success(
          response.data.message,
          response.data.status
        );

        getAllProduct();
      }
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

          <div className="table-box">
            <Table striped bordered hover responsive className="text-primary">
              <thead className="bg-primary text-light">
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
                {currentProduct
                  .sort((a, b) => a.id - b.id)
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="text-center py-4" style={{ width: 70 }}>
                        {products.indexOf(item) + 1}
                      </td>
                      <td style={{ width: 80 }}>
                        <Image
                          src={item?.image}
                          alt={item?.image}
                          width={70}
                          height={70}
                          className="cursor-pointer img-animate"
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
                              onClick={() =>
                                history.push(`/product/${item.id}`)
                              }
                            >
                              Edit
                            </Button>
                          </Col>

                          <Col>
                            <Button
                              variant="danger"
                              className="btn-action"
                              onClick={() => handleDelete(item.id)}
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
          </div>

          <Pagination
            productPerPage={productPerPage}
            totalProduct={products.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </Container>
      </main>

      <ModalAddProduct
        show={isShow.add}
        handleClose={handleClose}
        getAllProduct={getAllProduct}
      />
    </div>
  );
}
