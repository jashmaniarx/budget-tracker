import React from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  RefreshCw,
  Target,
  Brain,
  FileText,
  Lock,
  Globe,
  Smartphone,
  Cloud,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export const FeaturesSection: React.FC = () => {
  const mainFeatures = [
    {
      icon: Calculator,
      title: 'Advanced Calculators',
      description: 'Professional-grade financial calculators with real-time computation, percentage changes, ROI analysis, and loan amortization schedules.',
      features: ['Currency Mode', 'Percentage Calculator', 'Investment Returns', 'Loan Calculator'],
      color: 'from-gradient-1 to-gradient-5'
    },
    {
      icon: BarChart3,
      title: 'Interactive Charts',
      description: 'Dynamic, high-performance visualizations with drill-down capabilities, real-time updates, and export functionality.',
      features: ['Multiple Chart Types', 'Real-time Updates', 'Export to PNG/SVG', 'Drill-down Analysis'],
      color: 'from-gradient-3 to-gradient-8'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Machine learning algorithms for predictive analytics, anomaly detection, and personalized financial recommendations.',
      features: ['Spending Predictions', 'Anomaly Detection', 'Smart Categories', 'Budget Optimization'],
      color: 'from-gradient-5 to-gradient-10'
    },
    {
      icon: FileText,
      title: 'Double-Entry Bookkeeping',
      description: 'Professional accounting with journals, ledgers, trial balance, and complete audit trails for enterprise-level accuracy.',
      features: ['Trial Balance', 'General Ledger', 'Audit Trail', 'Reconciliation'],
      color: 'from-gradient-2 to-gradient-7'
    }
  ];

  const additionalFeatures = [
    { icon: Shield, title: 'Bank-Level Security', description: 'End-to-end encryption with 256-bit SSL' },
    { icon: Zap, title: 'Lightning Fast', description: 'Optimized for 100K+ transactions' },
    { icon: RefreshCw, title: 'Real-time Sync', description: 'Instant updates across all devices' },
    { icon: Target, title: 'Goal Tracking', description: 'Set and monitor financial objectives' },
    { icon: PieChart, title: 'Budget Analysis', description: 'Comprehensive spending breakdown' },
    { icon: Lock, title: 'Data Privacy', description: 'GDPR compliant with local storage' },
    { icon: Globe, title: 'Multi-Currency', description: 'Support for 150+ currencies' },
    { icon: Smartphone, title: 'Mobile Ready', description: 'Responsive design for all devices' },
    { icon: Cloud, title: 'Cloud Backup', description: 'Automatic data synchronization' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            🚀 Enterprise Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need for
            <span className="bg-gradient-to-r from-gradient-1 to-gradient-10 bg-clip-text text-transparent">
              {" "}Professional Finance
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From basic budgeting to advanced financial analysis, our comprehensive suite 
            includes 100,000+ functions designed for scale and accuracy.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {mainFeatures.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="card-floating h-full p-8 group">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.features.map((item, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {additionalFeatures.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="card-gradient p-6 h-full group hover:border-primary/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-gradient-1/10 via-gradient-5/10 to-gradient-10/10 rounded-2xl p-8 border border-border/50"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Built for Enterprise Scale
            </h3>
            <p className="text-muted-foreground">
              Engineered to handle the most demanding financial workloads
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '100K+', label: 'Functions & Components', description: 'Modular architecture' },
              { value: '<100ms', label: 'Average Response Time', description: 'Lightning fast queries' },
              { value: '99.99%', label: 'Uptime Guarantee', description: 'Enterprise reliability' },
              { value: '1M+', label: 'Transactions/Hour', description: 'Massive throughput' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mt-16"
        >
          <Button 
            size="lg" 
            className="bg-gradient-primary px-8 py-4 text-lg font-medium group"
            onClick={() => {
              document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Dashboard
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;