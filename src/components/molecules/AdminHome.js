import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Image,
  Row,
  Table,
} from "react-bootstrap";

import { API } from "../../config/api";
import formatNumber from "../../utils/formatNumber";

import ModalAddProduct from "../atoms/ModalAddProduct";
import Pagination from "../atoms/Pagination";
import ModalConfirm from "../atoms/ModalConfirm";
import NoData from "../atoms/NoData";

export default function AdminHome() {
  const history = useHistory();

  let productPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [isShow, setIsShow] = useState({
    add: false,
    confirm: false,
  });

  const indexOfLastPage = currentPage * productPerPage;
  const indexOfFirstPage = indexOfLastPage - productPerPage;
  const currentProduct = products.slice(indexOfFirstPage, indexOfLastPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleShowAdd = () => {
    setIsShow((prevState) => ({ ...prevState, add: true }));
  };

  const handleShowConfirm = (id) => {
    setProductId(id);
    setIsShow((prevState) => ({
      ...prevState,
      confirm: true,
    }));
  };

  const handleClose = () => {
    setIsShow({
      add: false,
      edit: false,
    });
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await API.get(`/products/search?name=${search}`);
      setProducts(response.data.data);
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
          <div className="d-flex justify-content-between">
            <Button variant="primary" className="mb-4" onClick={handleShowAdd}>
              Add Product
            </Button>

            <Form className="mb-4 d-flex" onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={handleChange}
                value={search}
              />
              <Button variant="outline-primary" type="submit">
                Search
              </Button>
            </Form>
          </div>

          {products.length ? (
            <>
              <div className="table-box">
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="text-primary"
                >
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
                          <td
                            className="text-center py-4"
                            style={{ width: 70 }}
                          >
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
                          <td className="text-center py-4">
                            Rp. {formatNumber(item?.buy_price)}
                          </td>
                          <td className="text-center py-4">
                            Rp. {formatNumber(item?.sell_price)}
                          </td>
                          <td className="text-center py-4">{item?.stock}</td>
                          <td
                            className="text-center py-3"
                            style={{ width: 200 }}
                          >
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
                                  onClick={() => handleShowConfirm(item.id)}
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
            </>
          ) : (
            <NoData />
          )}
        </Container>
      </main>

      <ModalConfirm
        show={isShow.confirm}
        handleClose={handleClose}
        getAllProduct={getAllProduct}
        id={productId}
      />

      <ModalAddProduct
        show={isShow.add}
        handleClose={handleClose}
        getAllProduct={getAllProduct}
      />
    </div>
  );
}
