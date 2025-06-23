import React from 'react';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import Footer from './shared/Footer';
import CategoryCarousel from './CategoryCarousel';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  let backgroundImage = "/MessI.png";
  if (user?.role === "admin") backgroundImage = "/MessI1.png";
  else if (user?.role === "student") backgroundImage = "/MessI.png";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black/30 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <Navbar />
          <HeroSection />
          <CategoryCarousel />
        </motion.div>
          <Footer />
      </div>
    </div>
  );
}
