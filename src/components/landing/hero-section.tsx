import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
    >
      {/* Animated background elements */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,30,55,0.1),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-9 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-1" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-5 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-2" />
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-gradient-10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-3" />
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        {/* Hero Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Badge 
            variant="outline" 
            className="px-4 py-2 text-sm bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
          >
            🚀 Production-Ready Financial Dashboard
          </Badge>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Professional
          <span className="bg-gradient-to-r from-white via-gradient-10 to-gradient-6 bg-clip-text text-transparent">
            {" "}Budget Tracking
          </span>
          <br />
          Made Simple
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Advanced double-entry bookkeeping, interactive charts, AI-powered insights, 
          and professional calculators. Manage your finances like a Fortune 500 company.
        </motion.p>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-10 text-white/70"
        >
          {[
            { icon: TrendingUp, text: "Real-time Analytics" },
            { icon: Shield, text: "Bank-Level Security" },
            { icon: Zap, text: "AI-Powered Insights" },
            { icon: BarChart3, text: "Interactive Charts" },
          ].map(({ icon: Icon, text }, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button 
            size="lg" 
            className="btn-hero px-8 py-4 text-lg font-medium group"
            onClick={() => {
              document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Tracking Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-4 text-lg font-medium bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: "100K+", label: "Components & Functions", description: "Fully scalable architecture" },
            { value: "99.9%", label: "Uptime Guarantee", description: "Enterprise reliability" },
            { value: "24/7", label: "Real-time Sync", description: "Always up-to-date data" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-white/80 mb-1">{stat.label}</div>
              <div className="text-xs text-white/60">{stat.description}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;