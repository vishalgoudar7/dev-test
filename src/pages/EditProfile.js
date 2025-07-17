// src/pages/EditProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import "../styles/EditProfile.css";

const EditProfile = () => {
  const { profile } = useUserAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    dob: "",
    placeOfBirth: "",
    occupation: "",
    street1: "",
    street2: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    sankalpa: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        ...profile,
      }));
    } else {
      const savedProfile = localStorage.getItem("profile");
      if (savedProfile) {
        setFormData(JSON.parse(savedProfile));
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("profile", JSON.stringify(formData));
    navigate("/profile");
  };

  return (
    <div className="edit-wrapper">
      <div className="edit-box">
        <h3>Edit Profile Details</h3>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Your Mobile Number</label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91xxxxxxxxxx"
              maxLength={10}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Place of Birth</label>
              <input name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <select name="occupation" value={formData.occupation} onChange={handleChange}>
                <option value="">Select</option>
                <option>Student</option>
                <option>Employed</option>
                <option>Self-Employed</option>
                <option>Retired</option>
              </select>
            </div>
          </div>

          <h4>Address Details</h4>

          <div className="form-row">
            <div className="form-group">
              <label>Street Address 1 *</label>
              <input name="street1" value={formData.street1} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Street Address 2</label>
              <input name="street2" value={formData.street2} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Area *</label>
              <input name="area" value={formData.area} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input name="city" value={formData.city} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State *</label>
              <input name="state" value={formData.state} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pincode *</label>
              <input
                name="pincode"
                value={formData.pincode}
                maxLength={6}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pincode: e.target.value.replace(/[^0-9]/g, ""),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Sankalpa (optional)</label>
            <input name="sankalpa" value={formData.sankalpa} onChange={handleChange} />
          </div>

          <button type="submit" className="save-btn">SAVE CHANGES</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
