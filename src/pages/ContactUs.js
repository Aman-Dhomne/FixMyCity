import React from "react";
import { motion } from "framer-motion";

export default function ContactUs() {
  return (
    <motion.div
      className="max-w-5xl mx-auto p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Contact Us</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Have questions, feedback, or need help with reporting an issue? Reach out to us!
      </p>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <textarea
          placeholder="Your Message"
          className="w-full px-4 py-2 border rounded-lg"
          rows="5"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
      <p className="mt-6 text-gray-700">
        Or email us directly at <span className="text-blue-600">support@fixmycity.com</span>
      </p>
    </motion.div>
  );
}