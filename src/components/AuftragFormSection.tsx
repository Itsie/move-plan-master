import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => (
  <Card className="bg-form-bg border-border">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

interface AuftragFormSectionProps {
  formData: any;
  onFormChange: (field: string, value: any) => void;
}

export const AuftragFormSection = ({ formData, onFormChange }: AuftragFormSectionProps) => {
  const handleShiftChange = (shift: string, checked: boolean) => {
    const updatedShifts = { ...formData.shifts, [shift]: checked };
    onFormChange('shifts', updatedShifts);
  };

  const handleShiftTimeChange = (shift: string, field: string, value: string) => {
    const updatedTimes = {
      ...formData.shiftTimes,
      [shift]: { ...formData.shiftTimes[shift], [field]: value }
    };
    onFormChange('shiftTimes', updatedTimes);
  };

  return (
    <FormSection title="Auftragsdaten & Schichtsystem">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="auftragsname" className="text-foreground">Auftragsname</Label>
          <Input
            id="auftragsname"
            value={formData.auftragsname}
            onChange={(e) => onFormChange('auftragsname', e.target.value)}
            placeholder="z.B. Kommissionierung KW05"
            className="bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="aktionszeitraum" className="text-foreground">Aktionszeitraum</Label>
          <Input
            id="aktionszeitraum"
            value={formData.aktionszeitraum}
            onChange={(e) => onFormChange('aktionszeitraum', e.target.value)}
            placeholder="z.B. KW05-KW12 2025"
            className="bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="kostenstelle" className="text-foreground">Kostenstelle</Label>
          <Input
            id="kostenstelle"
            value={formData.kostenstelle}
            onChange={(e) => onFormChange('kostenstelle', e.target.value)}
            placeholder="z.B. Logistik-Zentrum West"
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div>
          <Label className="text-foreground font-medium mb-3 block">Schichtsystem</Label>
          <div className="space-y-3">
            {[
              { key: 'fruehschicht', label: 'Frühschicht', defaultChecked: true },
              { key: 'spaetschicht', label: 'Spätschicht', defaultChecked: false },
              { key: 'nachtschicht', label: 'Nachtschicht', defaultChecked: false },
              { key: 'tagschicht', label: 'Tagschicht', defaultChecked: true }
            ].map((shift) => (
              <div key={shift.key} className="flex items-center space-x-2">
                <Checkbox
                  id={shift.key}
                  checked={formData.shifts?.[shift.key] ?? shift.defaultChecked}
                  onCheckedChange={(checked) => handleShiftChange(shift.key, !!checked)}
                  className="border-border data-[state=checked]:bg-primary"
                />
                <Label htmlFor={shift.key} className="text-foreground">
                  {shift.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-foreground font-medium mb-3 block">Schichtzeiten</Label>
          <div className="space-y-3 text-sm">
            {Object.entries(formData.shifts || {}).map(([shiftKey, enabled]) => 
              enabled && (
                <div key={shiftKey} className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[60px]">
                    {shiftKey === 'fruehschicht' && 'Früh:'}
                    {shiftKey === 'tagschicht' && 'Tag:'}
                    {shiftKey === 'spaetschicht' && 'Spät:'}
                    {shiftKey === 'nachtschicht' && 'Nacht:'}
                  </span>
                  <span className="text-muted-foreground">von:</span>
                  <Input
                    type="time"
                    value={formData.shiftTimes?.[shiftKey]?.from || 
                      (shiftKey === 'fruehschicht' ? '06:00' :
                       shiftKey === 'tagschicht' ? '08:00' :
                       shiftKey === 'spaetschicht' ? '14:00' : '22:00')}
                    onChange={(e) => handleShiftTimeChange(shiftKey, 'from', e.target.value)}
                    className="w-20 bg-input border-border text-foreground"
                  />
                  <span className="text-muted-foreground">bis:</span>
                  <Input
                    type="time"
                    value={formData.shiftTimes?.[shiftKey]?.to || 
                      (shiftKey === 'fruehschicht' ? '14:00' :
                       shiftKey === 'tagschicht' ? '16:30' :
                       shiftKey === 'spaetschicht' ? '22:00' : '06:00')}
                    onChange={(e) => handleShiftTimeChange(shiftKey, 'to', e.target.value)}
                    className="w-20 bg-input border-border text-foreground"
                  />
                  <span className="text-muted-foreground">Pause:</span>
                  <Input
                    value={formData.shiftTimes?.[shiftKey]?.pause || '35:00'}
                    onChange={(e) => handleShiftTimeChange(shiftKey, 'pause', e.target.value)}
                    className="w-20 bg-input border-border text-foreground"
                    placeholder="35:00"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </FormSection>
  );
};