import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, UserCheck, Sparkles } from "lucide-react";
import { Doctrine } from "@/data/doctrineData";

interface GoodnessSliderProps {
  selectedDoctrine: Doctrine;
  insideSavedPercentage: number;
  setInsideSavedPercentage: (value: number) => void;
  outsideSavedPercentage: number;
  setOutsideSavedPercentage: (value: number) => void;
  edgeCaseValues: Record<string, boolean>;
}

const GoodnessSliders = ({
  selectedDoctrine,
  insideSavedPercentage,
  setInsideSavedPercentage,
  outsideSavedPercentage,
  setOutsideSavedPercentage,
  edgeCaseValues
}: GoodnessSliderProps) => {
  // For atheism, we don't show goodness sliders
  if (selectedDoctrine.id === 'atheism') {
    return null;
  }

  // For universalism, we don't show sliders since everyone is saved
  if (selectedDoctrine.id === 'universalist') {
    return null;
  }

  // Determine if we should show the outside slider
  const showOutsideSlider = 
    edgeCaseValues.neverHeard || 
    edgeCaseValues.otherMonotheists || 
    edgeCaseValues.atheistsPolytheists;

  // Get religion label for display
  const getReligionLabel = () => {
    switch (selectedDoctrine.id) {
      case 'catholic':
      case 'protestant_evangelical':
      case 'protestant_mainline':
      case 'christian_orthodox':
        return 'Christians';
      case 'muslim_sunni':
      case 'muslim_shia':
        return 'Muslims';
      case 'jew_orthodox':
      case 'jew_reform':
        return 'Jews';
      default:
        return 'Religious Adherents';
    }
  };

  return (
    <section className="animate-fade-in">
      <div className="mb-4 flex items-center">
        <UserCheck className="mr-2 h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-medium text-blue-500">4. Estimate Who's Good ��</h2>
      </div>
      
      <Card className="glass-card-whimsy">
        <CardContent className="p-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="inside-saved" className="flex justify-between">
                <span className="flex items-center">
                  <Sparkles className="h-3 w-3 mr-2 text-heaven-accent" />
                  <span>% of {getReligionLabel()} who are saved</span>
                </span>
                <span className="font-medium text-heaven-contrast">{insideSavedPercentage}%</span>
              </Label>
              <input
                id="inside-saved"
                type="range"
                min="0"
                max="100"
                value={insideSavedPercentage}
                onChange={(e) => setInsideSavedPercentage(parseInt(e.target.value))}
                className="w-full h-2 bg-heaven-blue/40 rounded-lg appearance-none cursor-pointer accent-heaven-accent"
                style={{
                  background: `linear-gradient(to right, #42A5F5 0%, #42A5F5 ${insideSavedPercentage}%, #E3F2FD ${insideSavedPercentage}%, #E3F2FD 100%)`
                }}
              />
              <p className="text-sm text-muted-foreground">
                The percentage of people within {selectedDoctrine.name} who qualify for heaven.
              </p>
            </div>

            {showOutsideSlider && (
              <div className="space-y-4 animate-slide-up">
                <Label htmlFor="outside-saved" className="flex justify-between">
                  <span className="flex items-center">
                    <Sparkles className="h-3 w-3 mr-2 text-heaven-accent" />
                    <span>% of non-{getReligionLabel()} who are saved</span>
                  </span>
                  <span className="font-medium text-heaven-contrast">{outsideSavedPercentage}%</span>
                </Label>
                <input
                  id="outside-saved"
                  type="range"
                  min="0"
                  max="100"
                  value={outsideSavedPercentage}
                  onChange={(e) => setOutsideSavedPercentage(parseInt(e.target.value))}
                  className="w-full h-2 bg-heaven-blue/40 rounded-lg appearance-none cursor-pointer accent-heaven-accent"
                  style={{
                    background: `linear-gradient(to right, #42A5F5 0%, #42A5F5 ${outsideSavedPercentage}%, #E3F2FD ${outsideSavedPercentage}%, #E3F2FD 100%)`
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  The percentage of people outside {selectedDoctrine.name} who qualify for heaven.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GoodnessSliders;
