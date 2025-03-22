
import React from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamMember } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProjectMembersProps {
  members: TeamMember[];
  onInviteClick: () => void;
}

export const ProjectMembers: React.FC<ProjectMembersProps> = ({ 
  members,
  onInviteClick
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <Button onClick={onInviteClick}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>
      
      <div className="space-y-4">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <Badge className={
              member.role === 'admin' ? 'bg-primary text-white' :
              member.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
            }>
              {member.role}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
