"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RevealCardProps {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  parameters?: Record<string, any>;
}

export function RevealCard({ prompt, negativePrompt, model, parameters }: RevealCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">AI Prompt Details</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRevealed(!isRevealed)}
          >
            {isRevealed ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </div>
        
        {isRevealed ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Prompt</p>
              <p className="text-sm text-muted-foreground">{prompt}</p>
            </div>
            
            {negativePrompt && (
              <div>
                <p className="text-sm font-medium mb-1">Negative Prompt</p>
                <p className="text-sm text-muted-foreground">{negativePrompt}</p>
              </div>
            )}
            
            {model && (
              <div>
                <p className="text-sm font-medium mb-1">Model</p>
                <p className="text-sm text-muted-foreground">{model}</p>
              </div>
            )}
            
            {parameters && Object.keys(parameters).length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Parameters</p>
                <pre className="text-xs text-muted-foreground bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(parameters, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground text-sm">
              Swipe or click to reveal prompt details
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

