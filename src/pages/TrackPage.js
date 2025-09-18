// pages/TrackPage.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function TrackPage() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setComplaints(list);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Track Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="p-4 border rounded-lg shadow bg-white">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-gray-600">{c.description}</p>
              <p className="text-sm text-gray-500">
                Status: <span className="font-medium text-blue-600">{c.status}</span>
              </p>
              {c.location && (
                <p className="text-sm text-gray-500">📍 {c.location}</p>
              )}
              {c.photoURL && (
                <img
                  src={c.photoURL}
                  alt="complaint"
                  className="w-40 h-40 object-cover mt-2 rounded"
                />
              )}
              {c.audioURL && (
                <audio controls src={c.audioURL} className="w-full mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}