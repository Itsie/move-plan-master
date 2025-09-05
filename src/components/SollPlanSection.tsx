import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Calendar, Users } from "lucide-react";
import { useState } from "react";

interface PlanEntry {
  id: string;
  activity: string;
  qualification: string;
  employees: number;
  cost: number;
}

interface Plan {
  id: string;
  startDate: string;
  endDate: string;
  status: 'Aktiv' | 'Deaktiviert';
  createdAt: string;
  updatedAt?: string;
  deactivatedAt?: string;
  entries: PlanEntry[];
}

interface SollPlanSectionProps {
  basePlan: any;
  plans: Plan[];
  onPlansChange: (plans: Plan[]) => void;
}

export const SollPlanSection = ({ basePlan, plans, onPlansChange }: SollPlanSectionProps) => {
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({
    startDate: '',
    endDate: '',
    entries: [] as PlanEntry[]
  });

  const addPlanRow = () => {
    const newEntry: PlanEntry = {
      id: Date.now().toString(),
      activity: '',
      qualification: 'Keine',
      employees: 1,
      cost: 25.50
    };
    setNewPlan({
      ...newPlan,
      entries: [...newPlan.entries, newEntry]
    });
  };

  const updatePlanEntry = (entryId: string, field: keyof PlanEntry, value: any) => {
    setNewPlan({
      ...newPlan,
      entries: newPlan.entries.map(entry =>
        entry.id === entryId ? { ...entry, [field]: value } : entry
      )
    });
  };

  const removePlanEntry = (entryId: string) => {
    setNewPlan({
      ...newPlan,
      entries: newPlan.entries.filter(entry => entry.id !== entryId)
    });
  };

  const savePlan = () => {
    if (!newPlan.startDate || !newPlan.endDate || newPlan.entries.length === 0) {
      return;
    }

    const plan: Plan = {
      id: editingPlan || Date.now().toString(),
      startDate: newPlan.startDate,
      endDate: newPlan.endDate,
      status: 'Aktiv',
      createdAt: editingPlan 
        ? plans.find(p => p.id === editingPlan)?.createdAt || new Date().toLocaleString('de-DE')
        : new Date().toLocaleString('de-DE'),
      updatedAt: editingPlan ? new Date().toLocaleString('de-DE') : undefined,
      entries: newPlan.entries
    };

    if (editingPlan) {
      onPlansChange(plans.map(p => p.id === editingPlan ? plan : p));
    } else {
      onPlansChange([plan, ...plans]);
    }

    resetForm();
  };

  const resetForm = () => {
    setNewPlan({ startDate: '', endDate: '', entries: [] });
    setEditingPlan(null);
  };

  const editPlan = (plan: Plan) => {
    setEditingPlan(plan.id);
    setNewPlan({
      startDate: plan.startDate,
      endDate: plan.endDate,
      entries: [...plan.entries]
    });
  };

  const deactivatePlan = (planId: string) => {
    onPlansChange(plans.map(plan =>
      plan.id === planId
        ? {
            ...plan,
            status: 'Deaktiviert' as const,
            deactivatedAt: new Date().toLocaleString('de-DE')
          }
        : plan
    ));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Editor Section */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="bg-form-bg border-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              {editingPlan ? 'Abweichung bearbeiten' : 'Neuen abweichenden Plan anlegen'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan-start-date" className="text-foreground">Gültig von</Label>
                <Input
                  id="plan-start-date"
                  type="date"
                  value={newPlan.startDate}
                  onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="plan-end-date" className="text-foreground">Gültig bis</Label>
                <Input
                  id="plan-end-date"
                  type="date"
                  value={newPlan.endDate}
                  onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent/50 border-border">
                    <TableHead className="text-muted-foreground">Tätigkeit</TableHead>
                    <TableHead className="text-muted-foreground">Qualifikation</TableHead>
                    <TableHead className="text-center text-muted-foreground">Soll MA</TableHead>
                    <TableHead className="text-right text-muted-foreground">Kosten/MA (€)</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newPlan.entries.map((entry) => (
                    <TableRow key={entry.id} className="border-border">
                      <TableCell>
                        <Input
                          value={entry.activity}
                          onChange={(e) => updatePlanEntry(entry.id, 'activity', e.target.value)}
                          className="bg-input border-border text-foreground text-sm"
                          placeholder="Tätigkeit"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={entry.qualification}
                          onValueChange={(value) => updatePlanEntry(entry.id, 'qualification', value)}
                        >
                          <SelectTrigger className="bg-input border-border text-foreground text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border z-50">
                            <SelectItem value="Keine">Keine</SelectItem>
                            <SelectItem value="Staplerschein">Staplerschein</SelectItem>
                            <SelectItem value="Ersthelfer">Ersthelfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={entry.employees}
                          onChange={(e) => updatePlanEntry(entry.id, 'employees', parseFloat(e.target.value) || 0)}
                          className="bg-input border-border text-foreground text-sm text-center w-20"
                          min="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={entry.cost}
                          onChange={(e) => updatePlanEntry(entry.id, 'cost', parseFloat(e.target.value) || 0)}
                          className="bg-input border-border text-foreground text-sm text-right w-28"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlanEntry(entry.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {newPlan.entries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Keine Einträge vorhanden
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={addPlanRow}
                variant="secondary"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                + Mitarbeitergruppe hinzufügen
              </Button>
              <Button
                onClick={savePlan}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
              >
                {editingPlan ? 'Änderungen speichern' : 'Abweichung erstellen & historisieren'}
              </Button>
              {editingPlan && (
                <Button
                  onClick={resetForm}
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Abbrechen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* History Section */}
        <Card className="bg-form-bg border-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Historie der Abweichungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plans.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Hier werden alle vom Basisplan abweichenden Zeiträume angezeigt.
              </p>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      plan.status === 'Aktiv'
                        ? 'border-l-info bg-info/5 border border-info/20'
                        : 'border-l-muted bg-muted/5 border border-muted/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={plan.status === 'Aktiv' ? 'default' : 'secondary'}
                          className={
                            plan.status === 'Aktiv'
                              ? 'bg-info text-info-foreground'
                              : 'bg-muted text-muted-foreground'
                          }
                        >
                          {plan.status}
                        </Badge>
                        {plan.status === 'Aktiv' && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editPlan(plan)}
                              className="h-6 px-2 text-xs text-muted-foreground hover:text-info"
                            >
                              Bearbeiten
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deactivatePlan(plan.id)}
                              className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                            >
                              Deaktivieren
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.entries.map((entry, index) => (
                        <div key={entry.id} className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {entry.activity} ({entry.employees} MA)
                          </span>
                          {index < plan.entries.length - 1 && <span className="mx-1">•</span>}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-right space-y-1">
                      <div>Erstellt: {plan.createdAt}</div>
                      {plan.updatedAt && <div>Bearbeitet: {plan.updatedAt}</div>}
                      {plan.deactivatedAt && <div>Deaktiviert: {plan.deactivatedAt}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Base Plan Section */}
      <div className="lg:col-span-2">
        <Card className="bg-form-bg border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Basisplan (ursprüngliche Anlage)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 mb-4 text-sm">
              <div>
                <span className="block text-muted-foreground">Auftrag:</span>
                <span className="font-semibold text-foreground">
                  {basePlan?.auftragsname || 'Kein Auftrag ausgewählt'}
                </span>
              </div>
              <div>
                <span className="block text-muted-foreground">Kostenstelle:</span>
                <span className="font-semibold text-foreground">
                  {basePlan?.kostenstelle || '-'}
                </span>
              </div>
              <div>
                <span className="block text-muted-foreground">Gültigkeitszeitraum:</span>
                <span className="font-semibold text-foreground">
                  {basePlan?.startDate && basePlan?.endDate
                    ? `${formatDate(basePlan.startDate)} - ${formatDate(basePlan.endDate)}`
                    : 'Nicht definiert'}
                </span>
              </div>
            </div>

            {basePlan?.activities && basePlan.activities.length > 0 && (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-accent/50 border-border">
                      <TableHead className="text-muted-foreground text-xs">Tätigkeit</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Qualifikation</TableHead>
                      <TableHead className="text-center text-muted-foreground text-xs">Soll MA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {basePlan.activities.map((activity: any, index: number) => (
                      <TableRow key={index} className="border-border">
                        <TableCell className="text-foreground text-sm">{activity.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">Keine</TableCell>
                        <TableCell className="text-center text-foreground text-sm">{activity.employees}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};