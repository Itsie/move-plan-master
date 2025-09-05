import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BudgetSectionProps {
  formData: any;
  onFormChange: (field: string, value: any) => void;
}

export const BudgetSection = ({ formData, onFormChange }: BudgetSectionProps) => {
  return (
    <Card className="bg-form-bg border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Budgetangaben</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="auftragsbudget" className="text-foreground">Auftragsbudget (€)</Label>
          <Input
            id="auftragsbudget"
            type="number"
            value={formData.auftragsbudget}
            onChange={(e) => onFormChange('auftragsbudget', e.target.value)}
            placeholder="250000"
            className="bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="kommentar" className="text-foreground">Optionales Kommentar</Label>
          <Textarea
            id="kommentar"
            value={formData.kommentar}
            onChange={(e) => onFormChange('kommentar', e.target.value)}
            placeholder="Planung für das erste Quartal, erhöhter Bedarf durch Ostergeschäft erwartet."
            rows={3}
            className="bg-input border-border text-foreground resize-none"
          />
        </div>
        <div>
          <Label htmlFor="aktenzeichen" className="text-foreground">Aktenzeichen</Label>
          <Input
            id="aktenzeichen"
            value={formData.aktenzeichen}
            onChange={(e) => onFormChange('aktenzeichen', e.target.value)}
            placeholder="AZ-2025-LOG-17"
            className="bg-input border-border text-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
};