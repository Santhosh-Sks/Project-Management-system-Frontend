
import React from 'react';
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className,
  fullWidth = false
}) => {
  return (
    <div 
      className={cn(
        "min-h-[calc(100vh-64px)] w-full animate-fade-in",
        fullWidth ? "px-4 sm:px-6" : "container py-8 px-4",
        className
      )}
    >
      {children}
    </div>
  );
};
