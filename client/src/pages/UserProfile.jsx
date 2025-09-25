import React, { useState, useRef, useEffect } from 'react';
import './UserProfile.css';

// Google Places API script
const loadGoogleMapsScript = (callback) => {
  if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places`;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
};

const UserProfile = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    state: '',
    zip: '',
    newsletter: false,
    dataAgreement: false,
  });

  const addressRef = useRef(null);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
        types: ['address'],
        componentRestrictions: { country: ['us', 'ke', 'gb'] }, // adjust as needed
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setForm((prev) => ({
          ...prev,
          address: place.formatted_address || '',
        }));
      });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('Saving:', form);
    // Submit logic here
  };

  const handleRevert = () => {
    // Reset logic here
    setForm({});
  };

  return (
    <div className="user-profile-container">
      <div className="left-panel">
        <h2>Account Info</h2>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        <label>Confirm Password</label>
        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />

        <h2>Contact Info</h2>
        <label>First Name</label>
        <input name="firstName" value={form.firstName} onChange={handleChange} />

        <label>Last Name</label>
        <input name="lastName" value={form.lastName} onChange={handleChange} />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+254..." />

        <h2>Shipping Address</h2>
        <label>Address</label>
        <input name="address" ref={addressRef} value={form.address} onChange={handleChange} />

        <label>City</label>
        <input name="city" value={form.city} onChange={handleChange} />

        <label>Country</label>
        <select name="country" value={form.country} onChange={handleChange}>
          <option value="">Select Country</option>
          <option value="KE">Kenya</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
        </select>

        <label>State/Province</label>
        <input name="state" value={form.state} onChange={handleChange} />

        <label>Zip/Postal Code</label>
        <input name="zip" value={form.zip} onChange={handleChange} />

        <button className="support-btn">Need Help?</button>
      </div>

      <div className="right-panel">
        <div className="guidelines">
          <h3>Password Guidelines</h3>
          <ul>
            <li>❌ Avoid using dictionary words</li>
            <li>❌ No simple patterns (like "12345" or "qwerty")</li>
            <li>❌ Avoid personal info (birthdays, names)</li>
            <li>✅ Use a mix of symbols, numbers, and caps</li>
          </ul>
        </div>

        <div className="preferences">
          <h3>Preferences</h3>
          <label>
            <input
              type="checkbox"
              name="newsletter"
              checked={form.newsletter}
              onChange={handleChange}
            />
            Subscribe to news and exclusive discounts
          </label>
          <small>You’ll receive occasional promotions.</small>

          <label>
            <input
              type="checkbox"
              name="dataAgreement"
              checked={form.dataAgreement}
              onChange={handleChange}
            />
            I agree to the processing of my personal data
          </label>
          <small>We care about your data. Read our policy.</small>
        </div>

        <div className="button-group">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={handleRevert} className="revert-btn">Revert</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
