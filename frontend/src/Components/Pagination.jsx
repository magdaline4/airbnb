import "../Pages/Room/Room.scss";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // show only first, last, current, and dots (...)
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>

      {pages.map((p, index) =>
        p === "..." ? (
          <span key={index} className="dots">
            ...
          </span>
        ) : (
          <button
            key={index}
            className={p === currentPage ? "active" : ""}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
