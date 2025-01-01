import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Group, Trip } from '@/types/trip';

interface GroupManagerProps {
  onGroupsChange: (groups: Group[]) => void;
}

export function GroupManager({ onGroupsChange }: GroupManagerProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    setGroups(storedGroups);
  }, []);

  const handleAddGroup = () => {
    if (newGroupName && !groups.some(group => group.name === newGroupName)) {
      const newGroup: Group = {
        id: Date.now(),
        name: newGroupName,
        trips: [],
      };
      const updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
      onGroupsChange(updatedGroups);
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      setNewGroupName('');
      toast({
        title: "Success",
        description: "Group added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Group name already exists or is empty",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = (groupId: number) => {
    const updatedGroups = groups.filter(group => group.id !== groupId);
    setGroups(updatedGroups);
    onGroupsChange(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));

    // Remove group association from trips
    const trips: Trip[] = JSON.parse(localStorage.getItem('trips') || '[]');
    const updatedTrips = trips.map(trip => {
      if (trip.group === groupId) {
        return { ...trip, group: null };
      }
      return trip;
    });
    localStorage.setItem('trips', JSON.stringify(updatedTrips));

    toast({
      title: "Success",
      description: "Group deleted successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="New group name"
            />
            <Button onClick={handleAddGroup}>Add Group</Button>
          </div>
          <div className="space-y-2">
            {groups.map((group) => (
              <div key={group.id} className="flex justify-between items-center">
                <span>{group.name}</span>
                <Button variant="destructive" onClick={() => handleDeleteGroup(group.id)}>Delete</Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

