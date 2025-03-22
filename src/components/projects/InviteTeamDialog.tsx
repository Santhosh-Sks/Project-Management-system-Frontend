
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InviteTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (emails: string[], role: string) => void;
}

export const InviteTeamDialog: React.FC<InviteTeamDialogProps> = ({
  open,
  onOpenChange,
  onInvite,
}) => {
  const [emails, setEmails] = useState<string[]>(['']);
  const [role, setRole] = useState('member');
  const [errors, setErrors] = useState<string[]>([]);

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
    
    // Clear error when user starts typing
    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = '';
      setErrors(newErrors);
    }
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
    setErrors([...errors, '']);
  };

  const removeEmailField = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
    
    const newErrors = [...errors];
    newErrors.splice(index, 1);
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    let isValid = true;
    
    emails.forEach((email, index) => {
      if (!email.trim()) {
        newErrors[index] = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors[index] = 'Please enter a valid email address';
        isValid = false;
      } else {
        newErrors[index] = '';
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validEmails = emails.filter(email => email.trim() !== '');
      onInvite(validEmails, role);
      
      // Reset form
      setEmails(['']);
      setErrors([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                defaultValue={role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {role === 'admin' ? 'Full access to all project settings and management.' :
                 role === 'manager' ? 'Can manage tasks and assign team members.' :
                 'Can view and update tasks assigned to them.'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Email Addresses</Label>
              
              {emails.map((email, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 mt-2"
                >
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="colleague@example.com"
                      className={cn(errors[index] ? "border-destructive" : "")}
                    />
                    {errors[index] && (
                      <p className="text-sm text-destructive mt-1">{errors[index]}</p>
                    )}
                  </div>
                  
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEmailField(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmailField}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Email
              </Button>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Send Invitations
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
