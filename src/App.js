// App.js
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import AboutUs from "./pages/AboutUs"; 
import ContactUs from "./pages/ContactUs";
import Blog from "./pages/Blog";
import { db, storage } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AdminDashboard from "./pages/AdminDashboard";
import TrackPage from "./pages/TrackPage";


// ---------------- Dashboard ----------------
function Dashboard() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto p-8 grid gap-12"
    >
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to FixMyCity</h1>
        <p className="text-gray-600">
          A transparent way to report and resolve civic issues in your city.
        </p>
        <button
          onClick={() => navigate("/complaint")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md"
        >
          File a Complaint
        </button>
      </div>

      {/* How It Works */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
  { title: "Report", desc: "Submit civic issues with photos & location.", link: "/complaint" },
  { title: "Track", desc: "Follow your complaint status in real time.", link: "/track" },
  { title: "Resolve", desc: "Authorities update progress until resolved.", link: null },
].map((item, i) => (
  <motion.div
    key={i}
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-2xl shadow-md border cursor-pointer"
    onClick={() => item.link && navigate(item.link)}
  >
    <h3 className="text-lg font-semibold text-blue-600">{item.title}</h3>
    <p className="text-gray-600 mt-2">{item.desc}</p>
  </motion.div>
))}
      </div>

      {/* Articles */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Latest Articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl shadow-md border overflow-hidden"
            >
              <img
                src={`https://source.unsplash.com/400x200/?city,${n}`}
                alt="article"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">Civic Improvement #{n}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Learn how FixMyCity is transforming urban spaces...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 text-center">
        {[
          { num: "10k+", label: "Complaints Resolved" },
          { num: "500+", label: "Active Users" },
          { num: "95%", label: "Satisfaction Rate" },
        ].map((stat, i) => (
          <div key={i} className="bg-blue-50 p-6 rounded-2xl shadow-inner">
            <h3 className="text-3xl font-bold text-blue-600">{stat.num}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="bg-white p-6 rounded-2xl shadow-md border text-center">
        <p className="text-gray-600 italic">
          “FixMyCity helped me report a broken streetlight in minutes. It was
          fixed within 24 hours. Amazing transparency!”
        </p>
        <h4 className="mt-2 font-semibold text-blue-600">– Citizen User</h4>
      </div>
    </motion.div>
  );
}

// ---------------- Complaint Form ----------------
function ComplaintForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);

  // ---------- Voice Note ----------
  function getSupportedMimeType() {
    if (typeof MediaRecorder === "undefined") return null;
    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) return "audio/webm;codecs=opus";
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
    return "";
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType || "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };

      mr.start();
      setRecording(true);
    } catch (err) {
      alert("Mic access denied or not supported.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  // ---------- Location ----------
  const getAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setLocation(data.display_name);
      } else {
        setLocation(`${lat}, ${lon}`);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocation(`${lat}, ${lon}`);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        getAddressFromCoords(latitude, longitude);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to fetch location. Please enter manually.");
      }
    );
  };

  // ---------- Firebase Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = "";
      let audioURLFirebase = "";

      // Upload photo if exists
      if (photoFile) {
        const photoRef = ref(storage, `complaintPhotos/${photoFile.name}-${Date.now()}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // Upload audio if exists
      if (audioBlob) {
        const audioRef = ref(storage, `complaintAudios/voice-${Date.now()}.webm`);
        await uploadBytes(audioRef, audioBlob);
        audioURLFirebase = await getDownloadURL(audioRef);
      }

      // Save complaint to Firestore
      await addDoc(collection(db, "complaints"), {
        title,
        description,
        photoURL,
        audioURL: audioURLFirebase,
        location,
        coords,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      alert("Complaint submitted successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setPhotoFile(null);
      setLocation("");
      setCoords(null);
      setAudioBlob(null);
      setAudioURL(null);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit complaint. Try again.");
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">File a Complaint</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Complaint Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <textarea
          placeholder="Complaint Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows="4"
        />
        <input
          type="file"
          onChange={(e) => setPhotoFile(e.target.files[0])}
          className="w-full"
        />

        {/* Location */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Location</label>
          <input
            type="text"
            placeholder="Enter location manually or use auto-detect"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="button"
            onClick={detectLocation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📍 Use My Location
          </button>

          {coords && (
            <p className="text-sm text-gray-500">
              (Lat: {coords.latitude.toFixed(5)}, Lon: {coords.longitude.toFixed(5)})
            </p>
          )}
        </div>

        {/* Voice Note */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Add a Voice Note</h4>
          {!recording ? (
            <button type="button" onClick={startRecording} className="px-4 py-2 bg-green-600 text-white rounded-lg">
              🎤 Start Recording
            </button>
          ) : (
            <button type="button" onClick={stopRecording} className="px-4 py-2 bg-red-600 text-white rounded-lg">
              ⏹ Stop Recording
            </button>
          )}

          {audioURL && (
            <div className="mt-4">
              <audio controls src={audioURL} className="w-full" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

// ---------------- Login ----------------
function LoginPage({ isLogin, setIsLogin }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Admin toggle

  const handleLogin = (e) => {
    e.preventDefault();

    // For demo purposes, we’re not doing actual auth
    if (isAdmin) {
      navigate("/admin"); // Navigate to admin panel
    } else {
      navigate("/dashboard"); // Normal user dashboard
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-green-400">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Admin toggle */}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="adminToggle"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
              className="w-4 h-4"
            />
            <label htmlFor="adminToggle" className="text-gray-700 text-sm">
              Login as Admin
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ---------------- Layout ----------------
function Layout({ children }) {
  return (
    <>
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          FixMyCity
        </Link>
        <nav className="flex space-x-6">
          {["About", "Contact Us", "Fill Complaint", "Blog"].map((item, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className="hover:text-blue-600 transition">
              <Link
                to={
                  item === "About"
                    ? "/about"
                    : item === "Contact Us"
                    ? "/contact"
                    : item === "Fill Complaint"
                    ? "/complaint"
                    : "/blog"
                }
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-800 text-white text-center p-6 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} FixMyCity. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/about" className="hover:text-blue-400">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-400">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-blue-400">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

// ---------------- Main App ----------------
export default function FixMyCityApp() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage isLogin={isLogin} setIsLogin={setIsLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/complaint"
          element={
            <Layout>
              <ComplaintForm />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactUs />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <Blog />
            </Layout>
          }
        />
         <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
         <Route
  path="/track"
  element={
    <Layout>
      <TrackPage />
    </Layout>
  }
/>
      </Routes>
    </Router>
  );
}