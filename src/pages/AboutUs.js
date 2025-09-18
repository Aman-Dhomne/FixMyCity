// src/pages/AboutUs.js
import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <motion.div
      className="max-w-5xl mx-auto p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-blue-700 mb-6">About Us</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        FixMyCity is a citizen-driven civic reporting platform designed to
        empower communities and ensure government accountability. Our mission
        is to bridge the gap between citizens and local authorities by
        providing a simple, transparent, and effective way to report and track
        civic issues.
      </p>
      <h3 className="text-xl font-semibold text-blue-600 mt-6">Our Mission</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        We aim to create smarter, cleaner, and more livable cities by enabling
        citizens to participate in solving civic challenges like potholes,
        streetlights, waste management, and more.
      </p>
      <h3 className="text-xl font-semibold text-blue-600 mt-6">Why FixMyCity?</h3>
      <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
        <li>Easy-to-use complaint filing with photos, voice, and location.</li>
        <li>Transparency in tracking complaint progress.</li>
        <li>Stronger citizen-government collaboration.</li>
      </ul>
      <p className="mt-6 text-gray-700 italic">
        Together, let’s build cities we’re proud to live in.
      </p>
    </motion.div>
  );
}