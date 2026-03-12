import { useState, useEffect } from "react";
import { Mic, Plus, Trash2, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VoiceClone {
  id: string;
  voice_name: string;
  voice_id: string;
  created_at: string;
}

interface StepVoiceCloningProps {
  data: any;
  updateData: (data: any) => void;
}

const StepVoiceCloning = ({ data, updateData }: StepVoiceCloningProps) => {
  const [voices, setVoices] = useState<VoiceClone[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [voiceName, setVoiceName] = useState("");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(data.voiceCloneId || null);
  const { toast } = useToast();

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: voicesData, error } = await supabase.functions.invoke(
        "voice-cloning",
        { body: { action: "list" } }
      );

      if (!error && voicesData?.voices) {
        setVoices(voicesData.voices);
      }
    } catch (error) {
      console.error("Failed to load voices:", error);
    } finally {
      setLoading(false);
    }
  };

  const createVoiceClone = async () => {
    if (!voiceName.trim()) {
      toast({ title: "Please enter a voice name", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: result, error } = await supabase.functions.invoke(
        "voice-cloning",
        { 
          body: { 
            action: "create", 
            voiceName: voiceName 
          } 
        }
      );

      if (!error && result?.success) {
        toast({ title: "Voice cloned successfully!" });
        setVoiceName("");
        loadVoices();
      } else {
        toast({ title: "Failed to clone voice", description: error?.message || "Please add ELEVENLABS_API_KEY", variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to create voice:", error);
      toast({ title: "Failed to clone voice", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const selectVoice = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    updateData({ voiceCloneId: voiceId });
    toast({ title: "Voice selected!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Voice Cloning</h2>
        <p className="text-muted-foreground">
          Create a custom voice from your own audio samples. This is UNIQUE to VORAX!
        </p>
      </div>

      {/* Pre-built voices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Your Cloned Voices
          </CardTitle>
          <CardDescription>
            These voices were created from your audio samples
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading voices...
            </div>
          ) : voices.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No cloned voices yet. Create one below!
            </p>
          ) : (
            <div className="space-y-2">
              {voices.map((voice) => (
                <div
                  key={voice.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedVoiceId === voice.voice_id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => selectVoice(voice.voice_id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mic className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{voice.voice_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(voice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {selectedVoiceId === voice.voice_id && (
                    <span className="text-xs text-primary font-medium">Selected</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create new voice */}
      <Card>
        <CardHeader>
          <CardTitle>Clone New Voice</CardTitle>
          <CardDescription>
            Upload audio samples (30 seconds minimum) to create a custom voice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voiceName">Voice Name</Label>
            <Input
              id="voiceName"
              placeholder="e.g., My Voice"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={createVoiceClone} 
            disabled={creating || !voiceName.trim()}
            className="w-full"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Voice...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Clone Voice
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Requires ELEVENLABS_API_KEY in edge function secrets
          </p>
        </CardContent>
      </Card>

      {/* Use default voice option */}
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={() => {
            setSelectedVoiceId(null);
            updateData({ voiceCloneId: null });
          }}
        >
          Use Default Voice Instead
        </Button>
      </div>
    </div>
  );
};

export default StepVoiceCloning;
