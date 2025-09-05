import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, X } from "lucide-react";
import { useState } from "react";

interface Expense {
  id: string;
  description: string;
  month: string;
  cost: string;
  interval: string;
}

interface ExpenseSectionProps {
  expenses: Expense[];
  onExpensesChange: (expenses: Expense[]) => void;
}

export const ExpenseSection = ({ expenses, onExpensesChange }: ExpenseSectionProps) => {
  const [newExpense, setNewExpense] = useState({
    description: '',
    month: '',
    cost: '',
    interval: 'Einmalige Kosten'
  });

  const addExpense = () => {
    if (!newExpense.description || !newExpense.cost) {
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      month: newExpense.month,
      cost: newExpense.cost,
      interval: newExpense.interval
    };

    onExpensesChange([...expenses, expense]);
    setNewExpense({ description: '', month: '', cost: '', interval: 'Einmalige Kosten' });
  };

  const removeExpense = (id: string) => {
    onExpensesChange(expenses.filter(e => e.id !== id));
  };

  return (
    <Card className="bg-form-bg border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Sonstige Ausgaben erfassen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <Input
            placeholder="Ausgabenbeschreibung"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="bg-input border-border text-foreground"
          />
          <Input
            placeholder="Leistungsmonat"
            value={newExpense.month}
            onChange={(e) => setNewExpense({ ...newExpense, month: e.target.value })}
            className="bg-input border-border text-foreground"
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Kosten"
            value={newExpense.cost}
            onChange={(e) => setNewExpense({ ...newExpense, cost: e.target.value })}
            className="bg-input border-border text-foreground"
          />
          <Select 
            value={newExpense.interval} 
            onValueChange={(value) => setNewExpense({ ...newExpense, interval: value })}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              <SelectItem value="Einmalige Kosten">Einmalige Kosten</SelectItem>
              <SelectItem value="Pro Woche">Pro Woche</SelectItem>
              <SelectItem value="Beliebiger Zeitraum">Beliebiger Zeitraum</SelectItem>
              <SelectItem value="Pro Tag">Pro Tag</SelectItem>
              <SelectItem value="Pro Monat">Pro Monat</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={addExpense}
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
                <TableHead className="text-muted-foreground font-medium">Ausgabe</TableHead>
                <TableHead className="text-muted-foreground font-medium">Leistungsmonat</TableHead>
                <TableHead className="text-muted-foreground font-medium">Kosten</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="border-border hover:bg-accent/20">
                  <TableCell className="font-medium text-foreground">
                    {expense.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {expense.month}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {expense.cost} €
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
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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