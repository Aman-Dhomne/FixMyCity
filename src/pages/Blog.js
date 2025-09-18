import React from "react";
import { motion } from "framer-motion";

export default function Blog() {
  const articles = [
    { id: 1, title: "How FixMyCity is improving urban spaces", img: "city,1" },
    { id: 2, title: "Citizen-driven change: Success stories", img: "city,2" },
    { id: 3, title: "Top 5 recurring civic issues and solutions", img: "city,3" },
  ];

  return (
    <motion.div
      className="max-w-6xl mx-auto p-10 grid gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Blog</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-2xl shadow-md border overflow-hidden">
            <img
              src={`https://source.unsplash.com/400x200/?${article.img}`}
              alt={article.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{article.title}</h3>
              <p className="text-gray-600 text-sm mt-2">
                Read about how FixMyCity is transforming our cities and empowering citizens.
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}