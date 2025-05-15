import { useState, useContext } from "react";
import { UserContext } from "../App";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import HeaderBar from "@/components/HeaderBar";
import MobileNavbar from "@/components/MobileNavbar";

const Settings = () => {
  const { username } = useContext(UserContext);
  const { toast } = useToast();

  // User preferences state
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [minimumRating, setMinimumRating] = useState<number[]>([5.0]);
  const [yearRange, setYearRange] = useState<number[]>([1980, 2025]);
  const [language, setLanguage] = useState<string>("en");

  const handleSaveSettings = () => {
    // Here you would typically save these settings to a user profile
    // For now, we'll just show a toast confirmation
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleClearData = () => {
    // Here you would implement data clearing functionality
    // For now, we'll just show a confirmation toast
    toast({
      title: "Data Cleared",
      description: "Your movie preferences have been reset.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      
      <div className="container mx-auto px-4 pt-20 pb-24">
        <h1 className="text-3xl font-bold mb-6 font-heading">Settings</h1>
        
        <div className="bg-dark rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 font-heading">User Profile</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white mr-3">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{username}</p>
                <p className="text-sm text-muted-foreground">Basic account</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-dark rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 font-heading">Movie Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="adult-content" className="text-base">Adult Content</Label>
                <p className="text-sm text-muted-foreground">Include adult-rated movies in recommendations</p>
              </div>
              <Switch
                id="adult-content"
                checked={includeAdult}
                onCheckedChange={setIncludeAdult}
              />
            </div>
            
            <div>
              <Label htmlFor="min-rating" className="text-base mb-6 block">Minimum Rating</Label>
              <div className="pl-1 pr-1">
                <Slider
                  id="min-rating"
                  defaultValue={[5.0]}
                  max={10}
                  min={0}
                  step={0.5}
                  value={minimumRating}
                  onValueChange={setMinimumRating}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">0</span>
                <span className="text-sm font-medium">{minimumRating[0].toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">10</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="release-year" className="text-base mb-6 block">Release Year Range</Label>
              <div className="pl-1 pr-1">
                <Slider
                  id="release-year"
                  defaultValue={[1980, 2025]}
                  max={2025}
                  min={1900}
                  step={1}
                  value={yearRange}
                  onValueChange={setYearRange}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-medium">{yearRange[0]}</span>
                <span className="text-sm font-medium">{yearRange[1]}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="language" className="text-base mb-2 block">Language</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={handleSaveSettings} className="w-full">
              Save Preferences
            </Button>
          </div>
        </div>
        
        <div className="bg-dark rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 font-heading">Data Management</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Clear all your movie preferences and likes</p>
              <Button
                variant="destructive"
                onClick={handleClearData}
                className="w-full"
              >
                Reset Movie Data
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNavbar />
    </div>
  );
};

export default Settings;