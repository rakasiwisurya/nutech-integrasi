export default function Pagination(props) {
  const { productPerPage, totalProduct, paginate, currentPage } = props;
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProduct / productPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <div
              className={`page-link ${currentPage === number && "active"}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                paginate(number);
              }}
            >
              {number}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
