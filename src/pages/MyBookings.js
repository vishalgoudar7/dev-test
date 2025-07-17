import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/MyBookings.css";
import Pagination from "../components/Pagination";

const MyBookings = () => {
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    count: 0,
    maxPage: 1,
    lastPage: 1,
    search: "",
  });

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, [meta.page]);
//   useEffect(() => {
//   getBookings();
// }, [getBookings]); // or disable warning if intentional


  const getBookings = async () => {
    try {
      const response = await api.get(
        `/devotee/pooja_request/list/?page=${meta.page}&size=${meta.size}&search=${meta.search}`
      );
      const count = response.data.count;
      setBookings(response.data.results);
      setMeta((prev) => ({
        ...prev,
        count: count,
        lastPage: Math.ceil(count / meta.size),
        maxPage: Math.ceil(count / meta.size) >= 3 ? 3 : Math.ceil(count / meta.size),
      }));
    } catch (error) {
      console.warn("Failed to load bookings", error);
    }
  };

  const onPageChange = (page) => {
    setMeta((prev) => ({ ...prev, page }));
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setMeta((prev) => ({ ...prev, page: 1 }));
      getBookings();
    }
  };

  const videoPlay = async (id) => {
    try {
      const response = await api.get(`/devotee/pooja_request/${id}`);
      const videoUrl = response.data.videos[0].video;
      const newTab = window.open(videoUrl, "_blank");
      if (!newTab) alert("Please allow popups.");
    } catch (error) {
      console.warn("Video not available", error);
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="bookings-container">
        <h2 className="bookings-title">BOOKINGS</h2>

        <div className="search-container">
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={meta.search}
            onChange={(e) => setMeta({ ...meta, search: e.target.value })}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="table-responsive">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Payment Order ID</th>
                <th>Devotee</th>
                <th>Mobile No</th>
                <th>Pooja Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Pooja Video</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{b.order_id}</td>
                  <td>{b.payment_order_id}</td>
                  <td>{b.name}</td>
                  <td>{b.devotee_number}</td>
                  <td>{b.pooja_date}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "Pending"
                          ? "bg-warning"
                          : b.status === "Completed"
                          ? "bg-success"
                          : b.status === "Expired"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>{b.total_cost}</td>
                  <td>
                    <a
                      href={b.invoice}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-action"
                    >
                      Invoice
                    </a>
                  </td>
                  <td>
                    {b.status === "Completed" && (
                      <button className="btn-action" onClick={() => videoPlay(b.id)}>
                        Play
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-wrapper">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.lastPage}
            maxPage={meta.maxPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
