const { v4: uuidv4 } = uuid;

const Temple = () => {
  const [isMobileView, setIsMobileView] = React.useState(window.innerWidth <= 768);
  const [search, setSearch] = React.useState("");
  const [temple, setTemple] = React.useState({});
  const [poojas, setPoojas] = React.useState([]);
  const [prasads, setPrasads] = React.useState([]);
  const [booking, setBooking] = React.useState({
    pooja_id: "",
    pooja_name: "",
    pooja_price: 0,
    prasad_delivery: false,
    booking_date: "",
    name: "",
    mobile_no: "",
    comment: "",
    rashi: "",
    nakshatra: "",
    gotra: "",
    prasadam: true,
    prasadam_address: {
      street_address_1: "",
      street_address_2: "",
      area: "",
      city: "",
      district: "",
      state: "",
      pincode: ""
    }
  });
  const [payment, setPayment] = React.useState({
    id: "",
    order_id: "",
    payment_order_id: "",
    original_cost: 0,
    delivery_charge: 0,
    convenience_fee: 0,
    booking_charges: 0,
    total_tax: 0,
    final_total: 0
  });
  const [error, setError] = React.useState({
    booking_date: "",
    name: "",
    mobile_no: "",
    address_1: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pincode: ""
  });
  const [request, setRequest] = React.useState(false);
  const [response, setResponse] = React.useState(false);
  const [rzKey, setRzKey] = React.useState("");
  const [tabNo, setTabNo] = React.useState(4);
  const [cart, setCart] = React.useState([]);
  const [bookingDateRange, setBookingDateRange] = React.useState({ startDate: "", endDate: "" });
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const paymentDialogRef = React.useRef(null);

  React.useEffect(() => {
    const templeId = window.location.pathname.split('/').pop();
    fetchTemple(templeId).then(data => {
      setTemple(data);
      fetchPoojas(data.id, search).then(({ poojas, prasads }) => {
        setPoojas(poojas);
        setPrasads(prasads);
      });
    });
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    const storedMobileNumber = localStorage.getItem("mobileNumber");
    if (storedMobileNumber && storedMobileNumber !== "null" && storedMobileNumber !== "9080706050") {
      setBooking(prev => ({ ...prev, mobile_no: storedMobileNumber.replace('+91', '') }));
    }
    initPrasadamAddress();
    initializeFirebase();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (temple.images?.length > 1) {
        setCurrentSlide((prev) => (prev + 1) % temple.images.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [temple.images]);

  const initPrasadamAddress = () => {
    setBooking(prev => ({
      ...prev,
      prasadam_address: {
        street_address_1: "",
        street_address_2: "",
        area: "",
        city: "",
        district: "",
        state: "",
        pincode: ""
      }
    }));
  };

  const handleTabChange = (tab) => {
    setTabNo(tab);
    setBooking(prev => ({ ...prev, prasadam: tab === 4 }));
  };

  const bookPooja = async (pooja) => {
    const storedMobileNumber = localStorage.getItem("mobileNumber");
    if (storedMobileNumber && storedMobileNumber !== "null" && storedMobileNumber !== "9080706050") {
      setBooking(prev => ({ ...prev, mobile_no: storedMobileNumber.replace('+91', '') }));
    } else {
      setBooking(prev => ({ ...prev, mobile_no: "" }));
      document.getElementById("dialog")?.showModal();
      return;
    }

    setResponse(false);
    paymentDialogRef.current?.showModal();
    try {
      const { pooja_availability, pooja_booking_min_csc_estore } = await fetchConstants();
      setBookingDateRange({
        startDate: moment().add(pooja_booking_min_csc_estore, "d").toDate(),
        endDate: moment().add(pooja_availability + pooja_booking_min_csc_estore, "d").toDate()
      });
      setBooking(prev => ({
        ...prev,
        pooja_id: pooja.id,
        pooja_name: pooja.name,
        pooja_price: pooja.final_total,
        prasad_delivery: pooja.prasad_delivery,
        image: pooja.images.length ? pooja.images[0].image : null,
        pooja_cost: pooja.original_cost
      }));
      setRequest(true);
    } catch (err) {
      console.error(err);
    }
  };

  const poojaSelections = async () => {
    const newError = {
      booking_date: booking.booking_date ? "" : "The booking date is required",
      name: booking.name ? "" : "The devotee name is required",
      mobile_no: booking.mobile_no ? (/^\d{9,10}$/.test(booking.mobile_no) ? "" : "The mobile number must be a valid 10-digit number") : "The devotee mobile number is required",
      address_1: booking.prasadam && !booking.prasadam_address.street_address_1 ? "Address is required for prasadam delivery" : "",
      area: booking.prasadam && !booking.prasadam_address.area ? "Area is required" : "",
      city: booking.prasadam && !booking.prasadam_address.city ? "City is required" : "",
      district: booking.prasadam && !booking.prasadam_address.district ? "District is required" : "",
      state: booking.prasadam && !booking.prasadam_address.state ? "State is required" : "",
      pincode: booking.prasadam && (!booking.prasadam_address.pincode || !/^\d{5,6}$/.test(booking.prasadam_address.pincode)) ? "Pincode should be 5-6 digits" : ""
    };
    setError(newError);

    const regName = /^[a-zA-Z]{3,} [a-zA-Z]{3,}$|^[a-zA-Z]+$/;
    if (!regName.test(booking.name)) {
      newError.name = "Please enter a valid full name";
    }

    if (Object.values(newError).every(err => !err)) {
      const payload = {
        pooja: booking.pooja_id,
        pooja_name: booking.pooja_name,
        pooja_date: moment(booking.booking_date).format('YYYY-MM-DD'),
        name: booking.name,
        devotee_number: '+91' + booking.mobile_no,
        is_prasadam_delivery: booking.prasadam,
        family_member: [{
          id: null,
          name: booking.name,
          father_name: "",
          kula: "",
          gotra: booking.gotra,
          rashi: booking.rashi,
          nakshatra: booking.nakshatra,
          caste: "",
          subcaste: "",
          age: "",
          save_for_future: false,
          date_of_birth: null,
          place_of_birth: null,
          time_of_birth: null
        }],
        comment: `${booking.comment} ( Nakshatra: ${booking.nakshatra} )( Gotra: ${booking.gotra} )( Rashi: ${booking.rashi} )`,
        booked_by: "CSC",
        image: booking.image,
        pooja_cost: booking.pooja_cost
      };

      if (booking.prasadam) {
        payload.prasadam_address = {
          name: booking.name,
          street_address_1: booking.prasadam_address.street_address_1,
          street_address_2: booking.prasadam_address.street_address_2,
          area: booking.prasadam_address.area,
          city: booking.prasadam_address.city,
          state: booking.prasadam_address.state,
          district: booking.prasadam_address.district,
          pincode: booking.prasadam_address.pincode,
          phone_number: booking.mobile_no
        };
      }

      paymentDialogRef.current?.close();
      setCart([...cart, { ...payload, sl_id: uuidv4(), quantity: 1 }]);
      const payments = await bulkPoojaRequest([...cart, { ...payload, sl_id: uuidv4(), quantity: 1 }]);
      if (payments.length) {
        setPayment(prev => ({
          ...prev,
          id: payments[0].id,
          order_id: payments[0].order_id,
          payment_order_id: payments[0].payment_order_id,
          original_cost: payments.reduce((sum, obj) => sum + parseFloat(obj.payment_data.original_cost), 0),
          delivery_charge: payments.reduce((sum, obj) => sum + parseFloat(obj.payment_data.delivery_charge), 0),
          convenience_fee: payments.reduce((sum, obj) => sum + parseFloat(obj.payment_data.convenience_fee), 0),
          booking_charges: payments.reduce((sum, obj) => sum + parseFloat(obj.payment_data.booking_charges), 0),
          total_tax: payments.reduce((sum, obj) => sum + parseFloat(obj.payment_data.total_tax), 0),
          final_total: payments.reduce((sum, obj) => sum + parseFloat(obj.payment_data.final_total), 0)
        }));
        setRequest(false);
        setResponse(true);
        const key = await fetchPaymentKey();
        setRzKey(key);
        paymentDialogRef.current?.showModal();
      }
    }
  };

  const razorpayPayment = () => {
    paymentDialogRef.current?.close();
    const options = {
      key: rzKey,
      amount: payment.final_total * 100,
      currency: "INR",
      name: "Devalaya",
      description: "Payment towards Pooja",
      image: "https://cdn.shopify.com/s/files/1/0735/5895/0166/files/unnamed_copy_ac3ece77-8a3a-44b7-b0f2-820c39455044.jpg?v=1679241399&width=500",
      order_id: payment.payment_order_id,
      handler: (response) => {
        placeOrder(response, payment.id, payment.order_id).then(success => {
          if (success) {
            window.location.href = `/order?payment_id=${response.razorpay_payment_id}&order_id=${payment.order_id}`;
          }
        });
      },
      prefill: { name: booking.name, email: "", contact: booking.mobile_no },
      notes: { address: "Devalaya" },
      theme: { color: "#df3002" }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", (response) => console.error(response));
    rzp1.open();
  };

  const closeDialog = () => {
    paymentDialogRef.current?.close();
  };

  return (
    <main className="main">
      <section className="section pt-0"></section>
      <section className="section pt-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card bg-light p-0 pb-0">
                <div className="card-body">
                  <div>
                    <h1 className="h3 mt-2 mb-1">{temple.name}</h1>
                    <p className="mb-2 mb-sm-0">
                      <i className="bi bi-geo-alt me-1 text-primary"></i>
                      {temple.address}
                    </p>
                    <div className="carousel">
                      {temple.images && temple.images.length > 0 && (
                        <div className="carousel-container">
                          {temple.images.map((image, index) => (
                            <img
                              key={index}
                              src={image.image}
                              className={`temple card-img ${index === currentSlide ? 'active' : ''}`}
                              alt=""
                              style={{
                                display: index === currentSlide ? 'block' : 'none',
                                maxWidth: isMobileView ? '100%' : '200px',
                                maxHeight: 'fit-content'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <ul className="nav nav-tabs nav-bottom-line nav-responsive border-0" role="tablist">
                    {['Prasadam', 'Poojas', 'e-Services', 'About Temple'].map((tab, index) => (
                      <li key={index} className="nav-item" onClick={() => handleTabChange([4, 2, 3, 1][index])}>
                        <a className={`nav-link mb-0 ${tabNo === [4, 2, 3, 1][index] ? 'active' : ''}`} href={`#tab-${[4, 2, 3, 1][index]}`}>
                          {tab}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div className="container">
          <div className="tab-content" id="tour-pills-tabContent">
            <div className={`tab-pane fade ${tabNo === 1 ? 'show active' : ''}`} id="tab-1" role="tabpanel">
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card bg-transparent mb-4">
                    <div className="card-header">
                      <h4 className="mb-0">Description</h4>
                    </div>
                    <div className="card-body">{temple.details}</div>
                  </div>
                  <div className="card bg-transparent">
                    <div className="card-header">
                      <h4 className="mb-0">Image Gallery</h4>
                    </div>
                    <div className="card-body">
                      <div className="row g-4">
                        {temple.images?.map((image, index) => (
                          <div key={index} className="col-md-4">
                            <a className="w-100 h-100">
                              <div className="card overflow-hidden">
                                <img src={image.image} className="temple card-img" alt="" />
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">Get Direction</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-borderless">
                        {['Taluk', 'District', 'Area', 'City', 'State', 'Pincode', 'Website'].map((field, index) => (
                          <li key={index} className="list-group-item">
                            <span>{field}</span>
                            <span>{temple[field.toLowerCase()]}</span>
                            {index < 6 && <hr className="my-1" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {[2, 4].map(tab => (
              <div key={tab} className={`tab-pane fade ${tabNo === tab ? 'show active' : ''}`} id={`tab-${tab}`} role="tabpanel">
                <div className="bg-blur">
                  <div className="row g-3">
                    <div className="col-lg">
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search for ${tab === 2 ? 'Pooja' : 'Prasadam'}`}
                        className="form-control form-control-lg"
                        onKeyUp={(e) => e.key === 'Enter' && fetchPoojas(temple.id, search).then(({ poojas, prasads }) => {
                          setPoojas(poojas);
                          setPrasads(prasads);
                        })}
                      />
                    </div>
                    <div className="col-lg-2">
                      <button className="btn btn-lg btn-primary" onClick={() => fetchPoojas(temple.id, search).then(({ poojas, prasads }) => {
                        setPoojas(poojas);
                        setPrasads(prasads);
                      })}>Search</button>
                    </div>
                  </div>
                </div>
                <div className="row g-4">
                  {(tab === 2 ? poojas : prasads).map((item, index) => (
                    <div key={index} className="col-sm-6 col-lg-4 col-xl-3">
                      <a className="card shadow h-100">
                        <div className="card-body">
                          <ul className="list-group list-group-borderless">
                            <li className="list-group-item small pb-0">
                              <h5>🌸 {item.name}</h5>
                            </li>
                            {item.images?.length > 0 && (
                              <li className="list-group-item">
                                <img src={item.images[0].image} alt="" className="pooja-image" />
                              </li>
                            )}
                            {['Details', "Include's", 'Benefits', 'Cost'].map((field, i) => (
                              <li key={i} className="list-group-item small pb-0">
                                <h6>{field}:</h6>
                                {field === 'Cost' ? `₹ ${item.original_cost}/-` : (
                                  field === "Include's" ? (
                                    <span dangerouslySetInnerHTML={{ __html: item.included }} />
                                  ) : field === 'Benefits' ? (
                                    <span dangerouslySetInnerHTML={{ __html: item.excluded }} />
                                  ) : item[field.toLowerCase()]
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="card-footer">
                          {temple.pujari?.length ? (
                            <button className="btn btn-sm btn-primary" onClick={() => bookPooja(item)}>
                              {tab === 2 ? 'Participate' : 'Book'} <i className="fa fa-arrow-right"></i>
                            </button>
                          ) : (
                            <button className="btn btn-sm btn-primary w-100" onClick={() => requestPooja(item.id).then(success => {
                              if (success) alert("Pooja request has been successfully submitted.");
                            })}>
                              <i className="bi bi-plus-lg"></i> Request for {tab === 2 ? 'Pooja' : 'Prasadam'}
                            </button>
                          )}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className={`tab-pane fade ${tabNo === 3 ? 'show active' : ''}`} id="tab-3" role="tabpanel">
              <h4>Coming Soon!...</h4>
            </div>
          </div>
        </div>
      </section>
      <dialog id="payment" ref={paymentDialogRef} className="dialtag">
        {request && (
          <BookingDialog
            booking={booking}
            setBooking={setBooking}
            error={error}
            setError={setError}
            request={request}
            tabNo={tabNo}
            bookingDateRange={bookingDateRange}
            poojaSelections={poojaSelections}
            closeDialog={closeDialog}
          />
        )}
        {response && (
          <OrderDetails
            payment={payment}
            booking={booking}
            razorpayPayment={razorpayPayment}
            closeDialog={closeDialog}
          />
        )}
      </dialog>
    </main>
  );
};