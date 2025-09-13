import React from 'react';
import { motion } from 'framer-motion';

export const TrustedCompanies: React.FC = () => {
  // Mock company logos - in production, these would be real client logos
  const companies = [
    { name: 'TechCorp', logo: 'TC' },
    { name: 'FinanceFirst', logo: 'FF' },
    { name: 'DataDriven', logo: 'DD' },
    { name: 'GrowthLabs', logo: 'GL' },
    { name: 'SmartMoney', logo: 'SM' },
    { name: 'CloudFinance', logo: 'CF' },
    { name: 'AI Solutions', logo: 'AI' },
    { name: 'NextGen Bank', logo: 'NB' },
    { name: 'ProFin', logo: 'PF' },
    { name: 'MoneyWise', logo: 'MW' },
  ];

  // Duplicate for seamless scrolling
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-16 bg-card/30 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-4">
            Trusted by Leading Financial Organizations
          </h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Join thousands of professionals who rely on our advanced budget tracking solutions
          </p>
        </motion.div>

        {/* Continuous scrolling logo rail */}
        <div className="relative">
          <div className="flex overflow-hidden mask-image-fade">
            <motion.div
              className="flex space-x-8 min-w-fit"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 w-32 h-16 bg-gradient-to-br from-card to-card/50 border border-border/30 rounded-xl flex items-center justify-center group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary mb-1 group-hover:text-primary-hover transition-colors">
                      {company.logo}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {company.name}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Fade masks */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            {
              value: "10,000+",
              label: "Active Users",
              description: "Professionals managing their finances"
            },
            {
              value: "$2.5B+",
              label: "Tracked Assets",
              description: "In transactions and investments"
            },
            {
              value: "99.9%",
              label: "Accuracy Rate",
              description: "In financial calculations"
            }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedCompanies;