// pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";

// ✅ Import leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// fix default marker icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setComplaints(list);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    console.log("Complaints:", complaints);
  }, [complaints]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const complaintRef = doc(db, "complaints", id);
      await updateDoc(complaintRef, { status: newStatus });
      alert(`Status updated to ${newStatus}`);
      fetchComplaints();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h2>

      {/* Map Section */}
      <div className="mb-10 h-[400px] w-full border rounded-lg overflow-hidden">
        <MapContainer
          center={[23.2599, 77.4126]} // Default center = Bhopal
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {complaints
            .filter((c) => c.coords && c.coords.latitude && c.coords.longitude)
            .map((c) => (
              <Marker key={c.id} position={[c.coords.latitude, c.coords.longitude]}>
                <Popup>
                  <strong>{c.title}</strong>
                  <br />
                  {c.description}
                  <br />
                  Status: {c.status}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* Complaint List Section */}
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="space-y-6">
          {complaints.map((c) => (
            <div key={c.id} className="p-6 border rounded-lg shadow bg-white">
              <h3 className="font-semibold text-xl">{c.title}</h3>
              <p className="text-gray-600">{c.description}</p>
              <p className="text-sm text-gray-500 mt-1">📍 {c.location}</p>

              {/* Complaint status */}
              <p className="mt-2">
                Current Status:{" "}
                <span className="font-medium text-blue-600">{c.status}</span>
              </p>

              {/* Photo */}
              {c.photoURL && (
                <img
                  src={c.photoURL}
                  alt="complaint"
                  className="w-40 h-40 object-cover mt-3 rounded"
                />
              )}

              {/* Audio */}
              {c.audioURL && (
                <audio controls src={c.audioURL} className="w-full mt-3" />
              )}

              {/* Status Update Dropdown */}
              <div className="mt-4">
                <select
                  value={c.status}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Under Processing">Under Processing</option>
                  <option value="Work Going On">Work Going On</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}