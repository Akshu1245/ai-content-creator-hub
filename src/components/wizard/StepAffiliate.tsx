import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, DollarSign, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AffiliateProduct {
  name: string;
  price: number;
  commission: number;
  platform: string;
  url: string;
  category: string;
  estimatedMonthlyEarnings: number;
  ctaSuggestion: string;
}

interface StepAffiliateProps {
  data: any;
  updateData: (data: any) => void;
}

const StepAffiliate = ({ data, updateData }: StepAffiliateProps) => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<AffiliateProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(data.affiliateProducts || []);
  const { toast } = useToast();

  const loadSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase.functions.invoke(
        "affiliate-suggester",
        { 
          body: { 
            action: "suggest",
            niche: data.niche,
            script: data.script?.content
          } 
        }
      );

      if (!error && result?.suggestions) {
        setSuggestions(result.suggestions);
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    } finally {
      setLoading(false);
    }
  }, [data.niche, data.script]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const toggleProduct = (productName: string) => {
    const newSelected = selectedProducts.includes(productName)
      ? selectedProducts.filter(p => p !== productName)
      : [...selectedProducts, productName];
    
    setSelectedProducts(newSelected);
    updateData({ affiliateProducts: newSelected });
    
    if (!selectedProducts.includes(productName)) {
      toast({ title: "Product added to video!" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Affiliate Products
          </h2>
          <p className="text-muted-foreground">
            Find products to promote in your video
          </p>
        </div>
        
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Finding best products for your niche...
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
          <ShoppingCart className="w-6 h-6" />
          Affiliate Products
        </h2>
        <p className="text-muted-foreground">
          Select products to promote in your video. This is UNIQUE to VORAX!
        </p>
      </div>

      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No affiliate products found for this niche.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {suggestions.map((product, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-colors ${
                  selectedProducts.includes(product.name)
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => toggleProduct(product.name)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{product.name}</p>
                        <Badge variant="outline">{product.platform}</Badge>
                        <Badge>{product.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Price: ₹{product.price > 0 ? product.price : "Free"}
                      </p>
                      <p className="text-xs text-emerald-500 font-medium">
                        {product.commission}% commission
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-500">
                        ₹{product.estimatedMonthlyEarnings}/mo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        potential earnings
                      </p>
                    </div>
                  </div>

                  {selectedProducts.includes(product.name) && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-primary font-medium">
                        Suggested CTA:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        "{product.ctaSuggestion}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          {selectedProducts.length > 0 && (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Your Affiliate Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-500">
                  ₹{suggestions
                    .filter(p => selectedProducts.includes(p.name))
                    .reduce((sum, p) => sum + p.estimatedMonthlyEarnings, 0)
                  }/month
                </p>
                <p className="text-sm text-muted-foreground">
                  From {selectedProducts.length} selected products
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default StepAffiliate;
