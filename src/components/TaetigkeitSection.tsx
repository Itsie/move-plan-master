import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, X } from "lucide-react";
import { useState } from "react";

interface Activity {
  id: string;
  name: string;
  employees: number;
  cost: number;
}

interface TaetigkeitSectionProps {
  activities: Activity[];
  onActivitiesChange: (activities: Activity[]) => void;
}

export const TaetigkeitSection = ({ activities, onActivitiesChange }: TaetigkeitSectionProps) => {
  const [newActivity, setNewActivity] = useState({ name: '', employees: '', cost: '' });

  const addActivity = () => {
    if (!newActivity.name || !newActivity.employees || !newActivity.cost) {
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name,
      employees: parseFloat(newActivity.employees),
      cost: parseFloat(newActivity.cost)
    };

    onActivitiesChange([...activities, activity]);
    setNewActivity({ name: '', employees: '', cost: '' });
  };

  const removeActivity = (id: string) => {
    onActivitiesChange(activities.filter(a => a.id !== id));
  };

  const totalEmployees = activities.reduce((sum, activity) => sum + activity.employees, 0);

  return (
    <Card className="bg-form-bg border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">
          Tätigkeit und Stundensatz erfassen
        </CardTitle>
        <span className="text-sm font-medium text-muted-foreground">
          Gesamt: {totalEmployees} Mitarbeiter
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input
            placeholder="Tätigkeit"
            value={newActivity.name}
            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
            className="bg-input border-border text-foreground"
          />
          <Input
            type="number"
            placeholder="Soll MA"
            value={newActivity.employees}
            onChange={(e) => setNewActivity({ ...newActivity, employees: e.target.value })}
            className="bg-input border-border text-foreground"
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Kosten"
            value={newActivity.cost}
            onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
            className="bg-input border-border text-foreground"
          />
          <Button 
            onClick={addActivity}
            variant="secondary"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Hinzufügen
          </Button>
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50 border-border">
                <TableHead className="text-muted-foreground font-medium">Tätigkeit</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="border-border hover:bg-accent/20">
                  <TableCell className="font-medium text-foreground">
                    {activity.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-muted-foreground text-sm">
                        {activity.employees} Mitarbeiter - {activity.cost.toFixed(2)} €
                      </span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-info"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeActivity(activity.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {activities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                    Keine Tätigkeiten hinzugefügt
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};