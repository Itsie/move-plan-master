import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, X, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Expense {
  id: string;
  description: string;
  costType: string;
  cost: string;
  specificDate?: string;
  dateRange?: { from: string; to: string };
  month?: string;
  isPerEmployee: boolean;
  activityId?: string;
  category?: string;
  supplier?: string;
  priority?: string;
  approvalStatus?: string;
}

interface ExpenseSectionProps {
  expenses: Expense[];
  onExpensesChange: (expenses: Expense[]) => void;
  activities: Array<{ id: string; name: string; employees: number; cost: number }>;
}

export const ExpenseSection = ({ expenses, onExpensesChange, activities }: ExpenseSectionProps) => {
  const [newExpense, setNewExpense] = useState<{
    description: string;
    costType: string;
    cost: string;
    specificDate: Date | undefined;
    dateRange: { from: Date | undefined; to: Date | undefined };
    month: Date | undefined;
    isPerEmployee: boolean;
    activityId: string;
    category: string;
    supplier: string;
    priority: string;
    approvalStatus: string;
  }>({
    description: '',
    costType: 'Einmalige Kosten',
    cost: '',
    specificDate: undefined,
    dateRange: { from: undefined, to: undefined },
    month: undefined,
    isPerEmployee: false,
    activityId: '',
    category: 'Material',
    supplier: '',
    priority: 'Mittel',
    approvalStatus: 'Offen'
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const costTypes = [
    'Einmalige Kosten',
    'Pro Tag', 
    'Pro Monat',
    'Beliebiger Zeitraum',
    'Pro Woche'
  ];

  const categories = [
    'Material',
    'Personal', 
    'Equipment',
    'Transport',
    'Externe Dienstleistung',
    'IT/Software',
    'Büromaterial',
    'Sonstiges'
  ];

  const priorities = ['Niedrig', 'Mittel', 'Hoch', 'Kritisch'];
  const approvalStatuses = ['Offen', 'In Prüfung', 'Genehmigt', 'Abgelehnt'];

  const addExpense = () => {
    if (!newExpense.description || !newExpense.cost) {
      return;
    }

    let dateInfo: any = {};
    
    switch (newExpense.costType) {
      case 'Pro Tag':
        dateInfo.specificDate = newExpense.specificDate 
          ? format(newExpense.specificDate, 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd');
        break;
      case 'Pro Monat':
        dateInfo.month = newExpense.month 
          ? format(newExpense.month, 'yyyy-MM')
          : format(new Date(), 'yyyy-MM');
        break;
      case 'Beliebiger Zeitraum':
        if (newExpense.dateRange.from && newExpense.dateRange.to) {
          dateInfo.dateRange = {
            from: format(newExpense.dateRange.from, 'yyyy-MM-dd'),
            to: format(newExpense.dateRange.to, 'yyyy-MM-dd')
          };
        }
        break;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      costType: newExpense.costType,
      cost: newExpense.cost,
      isPerEmployee: newExpense.isPerEmployee,
      activityId: newExpense.isPerEmployee ? newExpense.activityId : undefined,
      category: newExpense.category,
      supplier: newExpense.supplier,
      priority: newExpense.priority,
      approvalStatus: newExpense.approvalStatus,
      ...dateInfo
    };

    onExpensesChange([...expenses, expense]);
    
    // Reset form
    setNewExpense({
      description: '',
      costType: 'Einmalige Kosten',
      cost: '',
      specificDate: undefined,
      dateRange: { from: undefined, to: undefined },
      month: undefined,
      isPerEmployee: false,
      activityId: '',
      category: 'Material',
      supplier: '',
      priority: 'Mittel',
      approvalStatus: 'Offen'
    });
  };

  const removeExpense = (id: string) => {
    onExpensesChange(expenses.filter(e => e.id !== id));
  };

  const formatDisplayDate = (expense: Expense) => {
    if (expense.specificDate) return format(new Date(expense.specificDate), 'dd.MM.yyyy', { locale: de });
    if (expense.month) return format(new Date(expense.month + '-01'), 'MM/yyyy', { locale: de });
    if (expense.dateRange) {
      return `${format(new Date(expense.dateRange.from), 'dd.MM.yyyy', { locale: de })} - ${format(new Date(expense.dateRange.to), 'dd.MM.yyyy', { locale: de })}`;
    }
    return expense.costType;
  };

  const getActivityName = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    return activity ? activity.name : '';
  };

  const renderDateInput = () => {
    switch (newExpense.costType) {
      case 'Pro Tag':
        return (
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Datum auswählen</Label>
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-input border-border text-foreground",
                    !newExpense.specificDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newExpense.specificDate 
                    ? format(newExpense.specificDate, "dd.MM.yyyy", { locale: de })
                    : "Heute auswählen"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
                <Calendar
                  mode="single"
                  selected={newExpense.specificDate}
                  onSelect={(date) => {
                    setNewExpense({ ...newExpense, specificDate: date });
                    setShowDatePicker(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'Pro Monat':
        return (
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Monat auswählen</Label>
            <Popover open={showMonthPicker} onOpenChange={setShowMonthPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-input border-border text-foreground",
                    !newExpense.month && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newExpense.month 
                    ? format(newExpense.month, "MMMM yyyy", { locale: de })
                    : "Monat auswählen"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
                <Calendar
                  mode="single"
                  selected={newExpense.month}
                  onSelect={(date) => {
                    setNewExpense({ ...newExpense, month: date });
                    setShowMonthPicker(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'Beliebiger Zeitraum':
        return (
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Zeitraum auswählen</Label>
            <Popover open={showRangePicker} onOpenChange={setShowRangePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-input border-border text-foreground",
                    (!newExpense.dateRange.from || !newExpense.dateRange.to) && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newExpense.dateRange.from && newExpense.dateRange.to 
                    ? `${format(newExpense.dateRange.from, "dd.MM.yyyy", { locale: de })} - ${format(newExpense.dateRange.to, "dd.MM.yyyy", { locale: de })}`
                    : "Zeitraum auswählen"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: newExpense.dateRange.from,
                    to: newExpense.dateRange.to
                  }}
                  onSelect={(range) => {
                    setNewExpense({ 
                      ...newExpense, 
                      dateRange: { 
                        from: range?.from, 
                        to: range?.to 
                      } 
                    });
                    if (range?.from && range?.to) {
                      setShowRangePicker(false);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-form-bg border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Sonstige Ausgaben erfassen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Intelligentes Formular */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-accent/10 rounded-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="description" className="text-foreground font-medium">Ausgabenbeschreibung *</Label>
              <Input
                id="description"
                placeholder="z.B. Benzinkosten, Hotelkosten..."
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="bg-input border-border text-foreground mt-1"
              />
            </div>

            <div>
              <Label htmlFor="costType" className="text-foreground font-medium">Art der Kosten *</Label>
              <Select 
                value={newExpense.costType} 
                onValueChange={(value) => setNewExpense({ ...newExpense, costType: value })}
              >
                <SelectTrigger className="bg-input border-border text-foreground mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {costTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderDateInput()}

            <div>
              <Label htmlFor="cost" className="text-foreground font-medium">Kosten (€) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newExpense.cost}
                onChange={(e) => setNewExpense({ ...newExpense, cost: e.target.value })}
                className="bg-input border-border text-foreground mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category" className="text-foreground font-medium">Kategorie</Label>
              <Select 
                value={newExpense.category} 
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger className="bg-input border-border text-foreground mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perEmployee"
                checked={newExpense.isPerEmployee}
                onCheckedChange={(checked) => setNewExpense({ ...newExpense, isPerEmployee: !!checked })}
                className="border-border data-[state=checked]:bg-primary"
              />
              <Label htmlFor="perEmployee" className="text-foreground font-medium">
                Pro Mitarbeiter berechnen
              </Label>
            </div>

            {newExpense.isPerEmployee && (
              <div>
                <Label htmlFor="activity" className="text-foreground font-medium">Tätigkeit auswählen</Label>
                <Select 
                  value={newExpense.activityId} 
                  onValueChange={(value) => setNewExpense({ ...newExpense, activityId: value })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground mt-1">
                    <SelectValue placeholder="Tätigkeit wählen..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50">
                    {activities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.name} ({activity.employees} MA)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="priority" className="text-foreground font-medium">Priorität</Label>
                <Select 
                  value={newExpense.priority} 
                  onValueChange={(value) => setNewExpense({ ...newExpense, priority: value })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50">
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="supplier" className="text-foreground font-medium">Lieferant/Anbieter</Label>
                <Input
                  id="supplier"
                  placeholder="Optional"
                  value={newExpense.supplier}
                  onChange={(e) => setNewExpense({ ...newExpense, supplier: e.target.value })}
                  className="bg-input border-border text-foreground mt-1"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <Button 
              onClick={addExpense}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Ausgabe hinzufügen
            </Button>
          </div>
        </div>

        {/* Tabelle */}
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50 border-border">
                <TableHead className="text-muted-foreground font-medium">Ausgabe</TableHead>
                <TableHead className="text-muted-foreground font-medium">Typ & Zeitraum</TableHead>
                <TableHead className="text-muted-foreground font-medium">Kosten</TableHead>
                <TableHead className="text-muted-foreground font-medium">Details</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="border-border hover:bg-accent/20">
                  <TableCell className="font-medium text-foreground">
                    <div>
                      <div>{expense.description}</div>
                      <div className="text-xs text-muted-foreground">{expense.category}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>
                      <div className="font-medium">{expense.costType}</div>
                      <div className="text-xs">{formatDisplayDate(expense)}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>
                      <div className="font-medium">{expense.cost} €</div>
                      {expense.isPerEmployee && (
                        <div className="text-xs text-info">Pro MA: {getActivityName(expense.activityId || '')}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    <div>Priorität: {expense.priority}</div>
                    {expense.supplier && <div>Lieferant: {expense.supplier}</div>}
                    <div>Status: {expense.approvalStatus}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
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
                        onClick={() => removeExpense(expense.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Keine Ausgaben hinzugefügt
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