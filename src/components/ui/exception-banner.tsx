
import React, { useState } from "react";
import { AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ExceptionType = "at-risk" | "delayed" | "failed" | "attention-required";

interface ExceptionDetails {
  reason: string;
  location?: string;
  timestamp: string;
  impact: string;
  suggestedAction?: string;
}

interface ExceptionBannerProps {
  type: ExceptionType;
  title: string;
  summary: string;
  details?: ExceptionDetails;
  onDismiss?: () => void;
  className?: string;
}

const getExceptionConfig = (type: ExceptionType) => {
  switch (type) {
    case "at-risk":
      return {
        icon: AlertTriangle,
        className: "border-red-500 bg-red-50 text-red-800",
        iconColor: "text-red-500",
        badge: "AT RISK"
      };
    case "delayed":
      return {
        icon: AlertTriangle,
        className: "border-yellow-500 bg-yellow-50 text-yellow-800",
        iconColor: "text-yellow-500",
        badge: "DELAYED"
      };
    case "failed":
      return {
        icon: X,
        className: "border-red-600 bg-red-100 text-red-900",
        iconColor: "text-red-600",
        badge: "FAILED"
      };
    case "attention-required":
      return {
        icon: AlertTriangle,
        className: "border-orange-500 bg-orange-50 text-orange-800",
        iconColor: "text-orange-500",
        badge: "ATTENTION"
      };
  }
};

export function ExceptionBanner({
  type,
  title,
  summary,
  details,
  onDismiss,
  className
}: ExceptionBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = getExceptionConfig(type);
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, "mb-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Icon className={cn("h-5 w-5 mt-0.5", config.iconColor)} />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTitle className="text-sm font-semibold">
                {title}
              </AlertTitle>
              <Badge variant="outline" className={cn("text-xs", config.className)}>
                {config.badge}
              </Badge>
            </div>
            <AlertDescription className="text-sm">
              {summary}
            </AlertDescription>
            
            {details && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-auto text-xs text-current hover:bg-transparent"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show Details
                    </>
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="mt-3 p-3 bg-white/50 rounded border border-current/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <strong>Reason:</strong> {details.reason}
                      </div>
                      {details.location && (
                        <div>
                          <strong>Location:</strong> {details.location}
                        </div>
                      )}
                      <div>
                        <strong>Time:</strong> {details.timestamp}
                      </div>
                      <div>
                        <strong>Impact:</strong> {details.impact}
                      </div>
                      {details.suggestedAction && (
                        <div className="md:col-span-2">
                          <strong>Suggested Action:</strong> {details.suggestedAction}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 text-current hover:bg-current/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}
