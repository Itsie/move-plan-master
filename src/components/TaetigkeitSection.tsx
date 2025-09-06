import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, X, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Activity {
  id: string;
  name: string;
  employees: number;
  cost: number;
  shift: string;
}

interface TaetigkeitSectionProps {
  activities: Activity[];
  onActivitiesChange: (activities: Activity[]) => void;
  formData: any;
}

export const TaetigkeitSection = ({ activities, onActivitiesChange, formData }: TaetigkeitSectionProps) => {
  const [activeShift, setActiveShift] = useState<string>('');
  const [newActivities, setNewActivities] = useState<{ [key: string]: { name: string; employees: string; cost: string } }>({});

  const getEnabledShifts = () => {
    const shifts = [];
    if (formData.shifts?.fruehschicht) shifts.push({ key: 'fruehschicht', label: 'Frühschicht' });
    if (formData.shifts?.tagschicht) shifts.push({ key: 'tagschicht', label: 'Tagschicht' });
    if (formData.shifts?.spaetschicht) shifts.push({ key: 'spaetschicht', label: 'Spätschicht' });
    if (formData.shifts?.nachtschicht) shifts.push({ key: 'nachtschicht', label: 'Nachtschicht' });
    return shifts;
  };

  const enabledShifts = getEnabledShifts();

  // Set active shift if not set and shifts available
  if (!activeShift && enabledShifts.length > 0) {
    setActiveShift(enabledShifts[0].key);
  }

  const addActivity = (shiftKey: string, shiftLabel: string) => {
    const newActivity = newActivities[shiftKey];
    if (!newActivity?.name || !newActivity?.employees || !newActivity?.cost) {
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name,
      employees: parseFloat(newActivity.employees),
      cost: parseFloat(newActivity.cost),
      shift: shiftLabel
    };

    onActivitiesChange([...activities, activity]);
    setNewActivities({
      ...newActivities,
      [shiftKey]: { name: '', employees: '', cost: '' }
    });
  };

  const removeActivity = (id: string) => {
    onActivitiesChange(activities.filter(a => a.id !== id));
  };

  const updateNewActivity = (shiftKey: string, field: string, value: string) => {
    setNewActivities({
      ...newActivities,
      [shiftKey]: {
        ...newActivities[shiftKey],
        [field]: value
      }
    });
  };

  const getActivitiesForShift = (shiftLabel: string) => {
    return activities.filter(activity => activity.shift === shiftLabel);
  };

  const getTotalEmployees = () => {
    return activities.reduce((sum, activity) => sum + activity.employees, 0);
  };

  const getShiftEmployees = (shiftLabel: string) => {
    return getActivitiesForShift(shiftLabel).reduce((sum, activity) => sum + activity.employees, 0);
  };

  if (enabledShifts.length === 0) {
    return (
      <Card className="bg-form-bg border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Tätigkeit und Stundensatz erfassen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Bitte aktivieren Sie zuerst ein Schichtsystem
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-form-bg border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">
          Tätigkeit und Stundensatz erfassen
        </CardTitle>
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          Gesamt: {getTotalEmployees()} Mitarbeiter
        </span>
      </CardHeader>
      <CardContent>
        <Tabs value={activeShift} onValueChange={setActiveShift} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {enabledShifts.map((shift) => (
              <TabsTrigger 
                key={shift.key} 
                value={shift.key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm">{shift.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getShiftEmployees(shift.label)} MA
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {enabledShifts.map((shift) => (
            <TabsContent key={shift.key} value={shift.key} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground">{shift.label}</h3>
                <div className="text-sm text-muted-foreground">
                  {formData.shiftTimes?.[shift.key] && (
                    <span>
                      {formData.shiftTimes[shift.key].from} - {formData.shiftTimes[shift.key].to}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  placeholder="Tätigkeit"
                  value={newActivities[shift.key]?.name || ''}
                  onChange={(e) => updateNewActivity(shift.key, 'name', e.target.value)}
                  className="bg-input border-border text-foreground"
                />
                <Input
                  type="number"
                  placeholder="Soll MA"
                  value={newActivities[shift.key]?.employees || ''}
                  onChange={(e) => updateNewActivity(shift.key, 'employees', e.target.value)}
                  className="bg-input border-border text-foreground"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Kosten"
                  value={newActivities[shift.key]?.cost || ''}
                  onChange={(e) => updateNewActivity(shift.key, 'cost', e.target.value)}
                  className="bg-input border-border text-foreground"
                />
                <Button 
                  onClick={() => addActivity(shift.key, shift.label)}
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
                      <TableHead className="text-right text-muted-foreground font-medium">Details & Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getActivitiesForShift(shift.label).map((activity) => (
                      <TableRow key={activity.id} className="border-border hover:bg-accent/20">
                        <TableCell className="font-medium text-foreground">
                          {activity.name}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-muted-foreground text-sm">
                              {activity.employees} MA - {activity.cost.toFixed(2)} €
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
                    {getActivitiesForShift(shift.label).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                          Keine Tätigkeiten für {shift.label} hinzugefügt
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};