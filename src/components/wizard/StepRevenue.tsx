import { useState, useEffect, useCallback } from "react";
import { TrendingUp, DollarSign, Eye, Lightbulb, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StepRevenueProps {
  data: any;
  updateData: (data: any) => void;
}

const StepRevenue = ({ data, updateData }: StepRevenueProps) => {
  const [loading, setLoading] = useState(true);
  const [estimating, setEstimating] = useState(false);
  const [projection, setProjection] = useState<any>(null);
  const { toast } = useToast();

  const estimateRevenue = useCallback(async () => {
    setEstimating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "revenue-estimator",
        { 
          body: { 
            action: "estimate",
            niche: data.niche,
            title: data.topic,
            duration: data.duration
          } 
        }
      );

      if (!error && result) {
        setProjection(result);
        updateData({ 
          estimatedViews: result.perVideo?.estimatedViews,
          estimatedRevenue: result.perVideo?.projectedRevenue
        });
      }
    } catch (error) {
      console.error("Failed to estimate revenue:", error);
    } finally {
      setLoading(false);
      setEstimating(false);
    }
  }, [data.niche, data.topic, data.duration, updateData]);

  useEffect(() => {
    estimateRevenue();
  }, [estimateRevenue]);

  if (loading || estimating) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Revenue Estimator
          </h2>
          <p className="text-muted-foreground">
            Calculating your potential earnings...
          </p>
        </div>
        
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Analyzing your niche and content...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Revenue Estimator
        </h2>
        <p className="text-muted-foreground">
          This is UNIQUE to VORAX! See potential earnings BEFORE you publish.
        </p>
      </div>

      {projection && (
        <>
          {/* Main projection */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Projected Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Conservative</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    ₹{projection.perVideo?.conservativeRevenue?.toFixed(2) || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border-2 border-primary">
                  <p className="text-sm text-muted-foreground">Expected</p>
                  <p className="text-3xl font-bold text-emerald-500">
                    ₹{projection.perVideo?.projectedRevenue?.toFixed(2) || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Optimistic</p>
                  <p className="text-2xl font-bold text-gold">
                    ₹{projection.perVideo?.optimisticRevenue?.toFixed(2) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly projections */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Potential</CardTitle>
              <CardDescription>
                If you post consistently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Daily posting</span>
                  <span className="font-bold">₹{projection.monthlyProjections?.daily?.toFixed(2) || 0}/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Weekly posting</span>
                  <span className="font-bold">₹{projection.monthlyProjections?.weekly?.toFixed(2) || 0}/week</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-medium">Monthly estimate</span>
                  <span className="font-bold text-emerald-500">
                    ₹{projection.monthlyProjections?.monthly?.toFixed(2) || 0}/month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Factors Affecting Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projection.factors?.map((factor: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{factor.factor}</span>
                    <Badge variant={factor.impact === "positive" ? "default" : "secondary"}>
                      {factor.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Tips to Maximize Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {projection.tips?.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* RPM info */}
          <div className="text-center text-sm text-muted-foreground">
            Based on {data.niche} niche RPM: ₹{projection.perVideo?.rpm}/1000 views
          </div>
        </>
      )}
    </div>
  );
};

export default StepRevenue;
