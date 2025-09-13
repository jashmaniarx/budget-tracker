import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Heart,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Calculator,
  PieChart,
  DollarSign
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Integrations', href: '#integrations' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' },
      { name: 'Contact', href: '#contact' },
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'Blog', href: '#blog' },
      { name: 'Support', href: '#support' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@budgettracker.com', label: 'Email' },
  ];

  const features = [
    { icon: TrendingUp, name: 'Analytics' },
    { icon: Shield, name: 'Security' },
    { icon: Zap, name: 'Performance' },
    { icon: BarChart3, name: 'Reports' },
    { icon: Calculator, name: 'Calculators' },
    { icon: PieChart, name: 'Insights' },
    { icon: DollarSign, name: 'Tracking' },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-background to-card border-t border-border/50">
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="floating-orb-1 absolute top-20 left-20 w-64 h-64 rounded-full opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="floating-orb-2 absolute top-40 right-32 w-48 h-48 rounded-full opacity-25"
          animate={{
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="floating-orb-3 absolute bottom-20 left-1/2 w-80 h-80 rounded-full opacity-20"
          animate={{
            scale: [0.8, 1.3, 0.8],
            x: [-50, 50, -50],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Budget Tracker
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Professional-grade financial management with advanced analytics, 
                double-entry bookkeeping, and AI-powered insights. Built for 
                scale and designed for excellence.
              </p>

              {/* Feature Icons */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-full text-sm"
                  >
                    <feature.icon className="h-3 w-3 text-primary" />
                    <span className="text-muted-foreground">{feature.name}</span>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-10 h-10 bg-muted/50 hover:bg-primary/20 rounded-full transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
              >
                <h4 className="font-semibold text-foreground mb-4 capitalize">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.1 * categoryIndex + 0.05 * linkIndex 
                      }}
                    >
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-border/50 pt-8 mt-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} Budget Tracker by Jash Maniar.</span>
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 text-destructive fill-current" />
              </motion.div>
              <span>for financial excellence.</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>100,000+ Functions</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span>Production Ready</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span>Enterprise Scale</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 right-8 z-20"
        >
          <div className="px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-medium shadow-brand backdrop-blur">
            Budget Tracker by Jash Maniar
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;