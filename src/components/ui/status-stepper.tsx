
import React from "react";
import { Check, X, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "completed" | "active" | "upcoming" | "failed" | "cancelled";

interface Step {
  id: string;
  label: string;
  status: StepStatus;
  timestamp?: string;
  description?: string;
}

interface StatusStepperProps {
  steps: Step[];
  className?: string;
}

const getStepIcon = (status: StepStatus) => {
  switch (status) {
    case "completed":
      return <Check className="h-4 w-4 text-white" />;
    case "active":
      return <Clock className="h-4 w-4 text-white" />;
    case "failed":
      return <X className="h-4 w-4 text-white" />;
    case "cancelled":
      return <X className="h-4 w-4 text-white" />;
    default:
      return <div className="h-2 w-2 bg-white rounded-full" />;
  }
};

const getStepColor = (status: StepStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-500 border-green-500";
    case "active":
      return "bg-blue-500 border-blue-500";
    case "failed":
      return "bg-red-500 border-red-500";
    case "cancelled":
      return "bg-gray-500 border-gray-500";
    default:
      return "bg-gray-200 border-gray-300";
  }
};

const getConnectorColor = (currentStatus: StepStatus, nextStatus: StepStatus) => {
  if (currentStatus === "completed") return "bg-green-500";
  if (currentStatus === "active") return "bg-gradient-to-r from-blue-500 to-gray-200";
  if (currentStatus === "failed" || currentStatus === "cancelled") return "bg-red-500";
  return "bg-gray-200";
};

export function StatusStepper({ steps, className }: StatusStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative">
              {/* Step Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10",
                  getStepColor(step.status)
                )}
              >
                {getStepIcon(step.status)}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <div className={cn(
                  "text-sm font-medium",
                  step.status === "active" ? "text-blue-600" : 
                  step.status === "completed" ? "text-green-600" :
                  step.status === "failed" || step.status === "cancelled" ? "text-red-600" :
                  "text-gray-500"
                )}>
                  {step.label}
                </div>
                {step.timestamp && (
                  <div className="text-xs text-gray-400 mt-1">
                    {step.timestamp}
                  </div>
                )}
                {step.description && (
                  <div className="text-xs text-gray-500 mt-1 max-w-20 truncate">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 relative">
                <div className={cn(
                  "absolute inset-0 rounded",
                  getConnectorColor(step.status, steps[index + 1].status)
                )} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
