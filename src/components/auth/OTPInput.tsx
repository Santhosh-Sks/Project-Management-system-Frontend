
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  isVerifying?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onResend,
  isVerifying = false,
  className,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);

  // Set up the countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdown > 0 && !isResendActive) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsResendActive(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isResendActive]);

  const handleResend = () => {
    if (onResend && isResendActive) {
      onResend();
      setCountdown(60);
      setIsResendActive(false);
    }
  };

  const handleComplete = (value: string) => {
    setOtp(value);
    if (value.length === length) {
      onComplete(value);
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      <div>
        <InputOTP 
          maxLength={length} 
          value={otp} 
          onChange={(value) => handleComplete(value)}
          disabled={isVerifying}
          className="gap-2"
        >
          <InputOTPGroup>
            {Array.from({ length }).map((_, index) => (
              <InputOTPSlot key={index} index={index} className="h-14 w-12 border-primary/20 focus:border-primary" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      
      {onResend && (
        <div className="text-center">
          {isResendActive ? (
            <Button
              type="button"
              variant="link"
              onClick={handleResend}
              disabled={isVerifying}
              className="text-primary"
            >
              Resend code
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend code in <span className="font-semibold">{countdown}s</span>
            </p>
          )}
        </div>
      )}
      
      {isVerifying && (
        <div className="flex items-center justify-center">
          <div className="loader mr-2" />
          <span className="text-sm">Verifying...</span>
        </div>
      )}
    </div>
  );
};
