import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <>
      <Navbar />
      <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Project Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your team's workflow with task management, team collaboration, and progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-medium">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card p-6 rounded-lg border shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-3">Secure Signup</h3>
            <p className="text-muted-foreground">
              With two-factor authentication and OTP verification for enhanced security.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card p-6 rounded-lg border shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-3">Task Management</h3>
            <p className="text-muted-foreground">
              Create, assign, and track tasks with priority levels and due dates.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card p-6 rounded-lg border shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
            <p className="text-muted-foreground">
              Invite team members via email and communicate through built-in chat.
            </p>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
};

export default Index;
