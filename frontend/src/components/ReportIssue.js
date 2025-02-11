import axios from "axios";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet"; // Leaflet for custom icon creation

const ReportIssue = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState([51.505, -0.09]);
  const [zoom, setZoom] = useState(13);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    issueType: "",
    priority: "",
    contactInfo: "",
  });
  const [image, setImage] = useState(null); // State for file upload
  const navigate = useNavigate();

  const handleSearch = async () => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1`;
  
    try {
      const response = await axios.get(url);
      if (response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0]; // Extract location name
        const newLocation = [parseFloat(lat), parseFloat(lon)];
        setLocation(newLocation);
        setZoom(15);
        setMarkerPosition(newLocation);
        setFormData({ ...formData, locationName: display_name }); // Store location name in form data
      } else {
        alert("Location not found. Please try another search term.");
      }
    } catch (error) {
      console.error("Error fetching location:", error.message);
      alert("Failed to fetch location. Please try again later.");
    }
  };
  

  // Define dropIcon inside the component to ensure it's in scope
  const dropIcon = new L.DivIcon({
    className: "leaflet-div-icon",
    html: `
      <div style="background-color: red; width: 30px; height: 40px; border-radius: 50% 50% 0 0; position: relative; border: 2px solid #b30000; transform: rotate(45deg);">
        <div style="position: absolute; width: 10px; height: 10px; background-color: red; top: 100%; left: 50%; margin-left: -5px; border-radius: 50%;"></div>
      </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!markerPosition || markerPosition.length !== 2) {
      alert("Please select a location before submitting.");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("issueType", formData.issueType);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("contactInfo", formData.contactInfo);
    formDataToSend.append("latitude", markerPosition[0]);
    formDataToSend.append("longitude", markerPosition[1]);
    formDataToSend.append("locationName", formData.locationName); // Include location name
    if (image) formDataToSend.append("image", image);
  
    try {
      const response = await axios.post("http://localhost:5000/api/issues", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Issue reported successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error submitting issue:", error.message);
      alert("Failed to submit the issue. Please try again later.");
    }
  };
    

  // This hook ensures that the map's center is updated when the marker position changes
  function MapCenterer({ markerPosition }) {
    const map = useMap();
    useEffect(() => {
      if (markerPosition) {
        map.setView(markerPosition, 15);
      }
    }, [markerPosition, map]);
    return null;
  }

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded ml-2"
        >
          Search
        </button>
      </div>
      <MapContainer
        center={location}
        zoom={zoom}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markerPosition && (
          <Marker position={markerPosition} icon={dropIcon}>
            <Popup>
              <div>Selected location: [Lat: {markerPosition[0]}, Lon: {markerPosition[1]}]</div>
            </Popup>
          </Marker>
        )}
        <MapCenterer markerPosition={markerPosition} />
      </MapContainer>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label>Issue Type:</label>
          <select
            value={formData.issueType}
            onChange={(e) =>
              setFormData({ ...formData, issueType: e.target.value })
            }
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select an issue type</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Question">Question</option>
          </select>
        </div>
        <div className="mb-4">
          <label>Priority:</label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="mb-4">
          <label>Contact Info:</label>
          <input
            type="text"
            value={formData.contactInfo}
            onChange={(e) =>
              setFormData({ ...formData, contactInfo: e.target.value })
            }
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label>Attach an Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2"
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
