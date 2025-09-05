import { useState } from "react";
import { Header } from "@/components/Header";
import { TabNavigation } from "@/components/TabNavigation";
import { AuftragFormSection } from "@/components/AuftragFormSection";
import { BudgetSection } from "@/components/BudgetSection";
import { TaetigkeitSection } from "@/components/TaetigkeitSection";
import { ExpenseSection } from "@/components/ExpenseSection";
import { SollPlanSection } from "@/components/SollPlanSection";
import { Button } from "@/components/ui/button";
import { History, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("auftragserfassung");
  const [isPlanningEnabled, setIsPlanningEnabled] = useState(false);
  const [formData, setFormData] = useState({
    auftragsname: "Kommissionierung KW05",
    aktionszeitraum: "",
    kostenstelle: "Logistik-Zentrum West",
    auftragsbudget: "250000",
    kommentar: "Planung für das erste Quartal, erhöhter Bedarf durch Ostergeschäft erwartet.",
    aktenzeichen: "AZ-2025-LOG-17",
    shifts: {
      fruehschicht: true,
      spaetschicht: false,
      nachtschicht: false,
      tagschicht: true
    },
    shiftTimes: {
      fruehschicht: { from: "06:00", to: "14:00", pause: "35:00" },
      tagschicht: { from: "08:00", to: "16:30", pause: "35:00" },
      spaetschicht: { from: "14:00", to: "22:00", pause: "35:00" },
      nachtschicht: { from: "22:00", to: "06:00", pause: "35:00" }
    }
  });

  const [activities, setActivities] = useState([
    { id: "1", name: "Flasher", employees: 3, cost: 79.99 },
    { id: "2", name: "Flasher", employees: 3, cost: 79.99 },
    { id: "3", name: "Flasher", employees: 3, cost: 79.99 }
  ]);

  const [expenses, setExpenses] = useState([
    { id: "1", description: "Benzinkosten", month: "01/25", cost: "25.321", interval: "Pro Monat" },
    { id: "2", description: "Hotelkosten", month: "04/29", cost: "128.321,28", interval: "Einmalige Kosten" },
    { id: "3", description: "Materialkosten", month: "08/24", cost: "10.223", interval: "Einmalige Kosten" }
  ]);

  const [basePlan, setBasePlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const { toast } = useToast();

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBasePlan = {
      auftragsname: formData.auftragsname,
      kostenstelle: formData.kostenstelle,
      startDate: "2025-01-27",
      endDate: "2025-03-28",
      activities: activities
    };

    setBasePlan(newBasePlan);
    setIsPlanningEnabled(true);
    setActiveTab("soll-plan");
    
    toast({
      title: "Auftrag erfolgreich erstellt",
      description: "Sie können nun den Soll-Plan anpassen.",
    });
  };

  const resetForm = () => {
    setFormData({
      auftragsname: "",
      aktionszeitraum: "",
      kostenstelle: "",
      auftragsbudget: "",
      kommentar: "",
      aktenzeichen: "",
      shifts: {
        fruehschicht: false,
        spaetschicht: false,
        nachtschicht: false,
        tagschicht: false
      },
      shiftTimes: {
        fruehschicht: { from: "", to: "", pause: "" },
        tagschicht: { from: "", to: "", pause: "" },
        spaetschicht: { from: "", to: "", pause: "" },
        nachtschicht: { from: "", to: "", pause: "" }
      }
    });
    setActivities([]);
    setExpenses([]);
    setBasePlan(null);
    setPlans([]);
    setIsPlanningEnabled(false);
    setActiveTab("auftragserfassung");
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      
      <div className="bg-content-bg shadow-lg">
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isPlanningEnabled={isPlanningEnabled}
        />

        {activeTab === "auftragserfassung" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Erstelle einen Auftrag
                </h1>
                <p className="text-sm text-muted-foreground">
                  Bitte pflege alle Mitarbeiter deiner Abteilung.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <History className="h-4 w-4 mr-2" />
                  Historie
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="bg-form-bg/30 p-6 rounded-lg">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <AuftragFormSection formData={formData} onFormChange={handleFormChange} />
                  <ExpenseSection expenses={expenses} onExpensesChange={setExpenses} />
                </div>
                <div className="space-y-6">
                  <BudgetSection formData={formData} onFormChange={handleFormChange} />
                  <TaetigkeitSection activities={activities} onActivitiesChange={setActivities} />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Abbrechen
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Auftrag speichern & Plan anpassen
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "soll-plan" && (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                Soll-Plan für '{basePlan?.auftragsname || 'Auftrag'}' anpassen
              </h1>
            </div>

            <div className="bg-form-bg/30 p-6 rounded-lg">
              <SollPlanSection 
                basePlan={basePlan}
                plans={plans}
                onPlansChange={setPlans}
              />
            </div>
          </div>
        )}
      </div>

      <footer className="text-center p-4 text-xs text-muted-foreground bg-app-bg">
        Impressum | Datenschutzerklärung | Nutzungsbedingungen
      </footer>
    </div>
  );
};

export default Index;
