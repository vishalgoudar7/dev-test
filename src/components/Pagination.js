import React from "react";
import "../styles/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="custom-pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>
      <span className="page-number">
        {currentPage} / {totalPages}
      </span>
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
