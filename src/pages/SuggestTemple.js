import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setsignInMbl } from "../redux/authSlice";
import api from "../api/api";
import "../styles/SuggestTemple.css";

const SuggestTemple = () => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.auth.signInMbl);

  const [suggest, setSuggest] = useState({
    name_en: "",
    details_en: "",
    taluk_en: "",
    district_en: "",
    area_en: "",
    city_en: "",
    state_en: "",
    pincode: "",
    address: "",
    rath: false,
  });

  const [panditName, setPanditName] = useState("");
  const [panditNumber, setPanditNumber] = useState("");
  const [selectedGod, setSelectedGod] = useState("");
  const [gods, setGods] = useState([]);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [imageId, setImageId] = useState("");
  const [videoId, setVideoId] = useState("");
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState({});

  const fileInputRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGods();

    const storedMobile = localStorage.getItem("mobileNumber");
    if (storedMobile && storedMobile !== "null" && storedMobile !== "+919080706050") {
      dispatch(setsignInMbl(true));
    }
  }, [dispatch]);

  const fetchGods = async () => {
    try {
      const res = await api.get("/api/v1/pujari/god/");
      setGods(res.data.results || []);
    } catch (err) {
      console.error("Error fetching gods:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("title_en", imageTitle || "Temple Image");
    formData.append("image", file);
    formData.append("type", "Image");

    try {
      const res = await api.post("devotee/temple/image/", formData);
      setImageId(res.data.id);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);

    const formData = new FormData();
    formData.append("title_en", videoTitle || "Temple Video");
    formData.append("description_en", videoTitle || "Temple Video");
    formData.append("video_file", file);

    try {
      const res = await api.post("devotee/temple/video/", formData);
      setVideoId(res.data.id);
      const reader = new FileReader();
      reader.onload = () => setPreviewVideo(reader.result);
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Video upload failed:", err);
    }
  };

  const validate = () => {
    const errors = {};
    const pincodeRegex = /^[1-9]{1}\d{2}\s?\d{3}$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!suggest.name_en) errors.name_en = "Temple name is required";
    if (!suggest.details_en) errors.details_en = "Temple details are required";
    if (!suggest.taluk_en) errors.taluk_en = "Taluk is required";
    if (!suggest.district_en) errors.district_en = "District is required";
    if (!suggest.area_en) errors.area_en = "Area is required";
    if (!suggest.city_en) errors.city_en = "City is required";
    if (!suggest.state_en) errors.state_en = "State is required";
    if (!suggest.address) errors.address = "Address is required";
    if (!suggest.pincode || !pincodeRegex.test(suggest.pincode)) {
      errors.pincode = "Valid pincode required";
    }
    if (!panditName) errors.panditName = "Pandit name required";
    if (!panditNumber || !phoneRegex.test(panditNumber)) {
      errors.panditNumber = "Valid phone number required";
    }
    if (!imageTitle) errors.imageTitle = "Image title is required";
    if (!videoTitle) errors.videoTitle = "Video title is required";

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...suggest,
      details_en: `${suggest.details_en} Pandit Name: ${panditName}, Pandit Number: +91${panditNumber}`,
      gods: [selectedGod],
      images: [imageId],
      videos: [videoId],
    };

    try {
      await api.post("devotee/temple/create/", payload);
      setAlert(true);
      // Reset form
      setSuggest({
        name_en: "",
        details_en: "",
        taluk_en: "",
        district_en: "",
        area_en: "",
        city_en: "",
        state_en: "",
        pincode: "",
        address: "",
        rath: false,
      });
      setPanditName("");
      setPanditNumber("");
      setImageTitle("");
      setVideoTitle("");
      setImage(null);
      setVideo(null);
      setPreviewImage(null);
      setPreviewVideo(null);
      setSelectedGod("");
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <div className="suggest-temple-container">
      <div className="form-card">
        <h2 className="form-title">SUGGEST TEMPLE</h2>

        {alert && <div className="success-alert">Temple submitted successfully!</div>}

        {[
          { label: "Name", field: "name_en" },
          { label: "Details", field: "details_en" },
          { label: "Taluk", field: "taluk_en" },
          { label: "District", field: "district_en" },
          { label: "Area", field: "area_en" },
          { label: "City", field: "city_en" },
          { label: "State", field: "state_en" },
          { label: "Pincode", field: "pincode" },
          { label: "Address", field: "address" },
        ].map(({ label, field }) => (
          <div className="form-group" key={field}>
            <label>{label}*</label>
            <input
              type={field === "pincode" ? "number" : "text"}
              className={error[field] ? "input error" : "input"}
              value={suggest[field]}
              onChange={(e) => setSuggest({ ...suggest, [field]: e.target.value })}
            />
            {error[field] && <small className="error-text">{error[field]}</small>}
          </div>
        ))}

        <div className="form-group">
          <label>Pandit Name*</label>
          <input
            type="text"
            className={error.panditName ? "input error" : "input"}
            value={panditName}
            onChange={(e) => setPanditName(e.target.value)}
          />
          {error.panditName && <small className="error-text">{error.panditName}</small>}
        </div>

        <div className="form-group">
          <label>Pandit Number*</label>
          <input
            type="number"
            className={error.panditNumber ? "input error" : "input"}
            value={panditNumber}
            onChange={(e) => setPanditNumber(e.target.value)}
          />
          {error.panditNumber && <small className="error-text">{error.panditNumber}</small>}
        </div>

        <div className="form-group">
          <label>Select God</label>
          <select
            className="input"
            value={selectedGod}
            onChange={(e) => setSelectedGod(e.target.value)}
          >
            <option value="">-- Select God --</option>
            {gods.map((god) => (
              <option key={god.id} value={god.id}>
                {god.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Image Title*</label>
          <input
            type="text"
            className={error.imageTitle ? "input error" : "input"}
            value={imageTitle}
            onChange={(e) => setImageTitle(e.target.value)}
          />
          {error.imageTitle && <small className="error-text">{error.imageTitle}</small>}
        </div>

        <div className="form-group">
          <label>Upload Image*</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {previewImage && <img src={previewImage} alt="preview" className="preview-image" />}
        </div>

        <div className="form-group">
          <label>Video Title*</label>
          <input
            type="text"
            className={error.videoTitle ? "input error" : "input"}
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />
          {error.videoTitle && <small className="error-text">{error.videoTitle}</small>}
        </div>

        <div className="form-group">
          <label>Upload Video*</label>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
          {previewVideo && (
            <video src={previewVideo} controls className="preview-video" />
          )}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Suggest Temple
        </button>
      </div>
    </div>
  );
};

export default SuggestTemple;
