import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
export function CommodityFormSection() {
    const [commodities, setCommodities] = useState([
      { description: "", pallets: "", weight: "", length: "" }
    ]);
  
    const addCommodity = () => {
      setCommodities([...commodities, { description: "", pallets: "", weight: "", length: "" }]);
    };
  
    const removeCommodity = (index: number) => {
      const updated = [...commodities];
      updated.splice(index, 1);
      setCommodities(updated);
    };
  
    const handleChange = (index: number, field: string, value: string) => {
      const updated = [...commodities];
      updated[index][field] = value;
      setCommodities(updated);
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commodities</CardTitle>
          <CardDescription>Add one or more commodities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {commodities.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Description *</Label>
                <Input
                  placeholder="e.g., Electronics"
                  value={item.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Pallets</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={item.pallets}
                  onChange={(e) => handleChange(index, "pallets", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (lbs) *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={item.weight}
                  onChange={(e) => handleChange(index, "weight", e.target.value)}
                  required
                />
              </div>
              <div className="flex items-end space-x-2">
                <Input
                  type="number"
                  placeholder="Length (ft)"
                  value={item.length}
                  onChange={(e) => handleChange(index, "length", e.target.value)}
                />
                {commodities.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeCommodity(index)}
                    className="text-red-500"
                  >
                    <Trash2 className=" w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))} 
          <Button type="button" variant="outline" onClick={addCommodity}>
            + Add Another Commodity
          </Button>
        </CardContent>
      </Card>
    );
  }