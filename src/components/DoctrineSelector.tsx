import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctrines, dogtrines, Doctrine } from "@/data/doctrineData";
import { Church, Heart, Scale, UserCheck, Dog } from "lucide-react";

interface DoctrineSelectorProps {
  selectedDoctrine: Doctrine | null;
  setSelectedDoctrine: (doctrine: Doctrine | null) => void;
  allDogsGoToHeaven: boolean;
  setAllDogsGoToHeaven: (value: boolean) => void;
  dogGoodnessPercentage: number;
  setDogGoodnessPercentage: (value: number) => void;
  hasError?: boolean;
}

const DoctrineSelector = ({
  selectedDoctrine,
  setSelectedDoctrine,
  allDogsGoToHeaven,
  setAllDogsGoToHeaven,
  dogGoodnessPercentage,
  setDogGoodnessPercentage,
  hasError
}: DoctrineSelectorProps) => {
  return (
    <div className="space-y-8">
      {/* Step 1: Main Religion */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Church className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold font-playfair">1. Choose Your Afterlife Doctrine</h2>
        </div>
        <p className="text-muted-foreground">Pick a religious framework to shape the main rules for entry.</p>
        <Card className={`${hasError ? 'border-red-500' : ''}`}>
          <CardContent className="p-4">
            <Select 
              value={selectedDoctrine?.id || ""}
              onValueChange={(value) => {
                if (!value) {
                  setSelectedDoctrine(null);
                } else {
                  const newDoctrine = doctrines.find(d => d.id === value);
                  if (newDoctrine) setSelectedDoctrine(newDoctrine);
                }
              }}
            >
              <SelectTrigger className={`w-full h-14 text-lg border-2 focus:border-primary ${hasError ? 'border-red-500' : 'border-input'}`}>
                <SelectValue placeholder="Select a doctrine" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {doctrines.map((doctrine) => (
                  <SelectItem key={doctrine.id} value={doctrine.id} className="text-base py-2">
                    {doctrine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-500 mt-2">Please select a doctrine</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Step 2: Dog Doctrine */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Dog className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold font-playfair">2. ...And Your Dogtrine</h2>
        </div>
        <p className="text-muted-foreground">What's your position on pups?</p>
        <Card>
          <CardContent className="p-4">
            <RadioGroup 
              value={allDogsGoToHeaven ? 'allDogsGood' : 'someDogsGood'}
              onValueChange={(value) => {
                setAllDogsGoToHeaven(value === 'allDogsGood');
              }}
              className="space-y-4"
            >
              {dogtrines.map((dogtrine) => (
                <div key={dogtrine.id} className="relative">
                  <RadioGroupItem
                    value={dogtrine.id}
                    id={`dogtrine-${dogtrine.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`dogtrine-${dogtrine.id}`}
                    className="flex flex-col justify-between h-full p-4 rounded-md border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer 
                      transition-all duration-200 ease-in-out
                      peer-data-[state=checked]:border-[#42A5F5] peer-data-[state=checked]:text-foreground 
                      peer-data-[state=checked]:bg-primary/5"
                  >
                    <div className="font-medium text-left">{dogtrine.name}</div>
                    <p className="text-sm text-muted-foreground mt-2 text-left">
                      {dogtrine.description}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {!allDogsGoToHeaven && (
              <div className="mt-6 space-y-4 animate-slide-up">
                <Label htmlFor="dog-goodness" className="text-sm font-medium">
                  What % of dogs are good?
                </Label>
                <div className="flex items-center space-x-2">
                  <input
                    id="dog-goodness"
                    type="range"
                    min="0"
                    max="100"
                    value={dogGoodnessPercentage}
                    onChange={(e) => setDogGoodnessPercentage(parseInt(e.target.value))}
                    className="w-full h-2 bg-heaven-blue/40 rounded-lg appearance-none cursor-pointer accent-heaven-accent"
                    style={{
                      background: `linear-gradient(to right, #42A5F5 0%, #42A5F5 ${dogGoodnessPercentage}%, #E3F2FD ${dogGoodnessPercentage}%, #E3F2FD 100%)`
                    }}
                  />
                  <span className="text-sm font-medium w-10">{dogGoodnessPercentage}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctrineSelector;
