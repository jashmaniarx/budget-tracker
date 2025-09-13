import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/landing/hero-section';
import TrustedCompanies from '@/components/landing/trusted-companies';
import FeaturesSection from '@/components/landing/features-section';
import MainDashboard from '@/components/dashboard/main-dashboard';
import Footer from '@/components/landing/footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Parallax Background */}
      <HeroSection />
      
      {/* Trusted Companies - Continuous Scrolling */}
      <TrustedCompanies />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Main Dashboard - The Core Product */}
      <MainDashboard />
      
      {/* Footer with Floating Orbs and Credit */}
      <Footer />

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 left-8 z-50 p-3 bg-gradient-primary text-white rounded-full shadow-brand hover:shadow-floating transition-all duration-300"
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Index;