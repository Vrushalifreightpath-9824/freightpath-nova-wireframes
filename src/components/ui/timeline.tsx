
import React from "react";
import { Clock, User, Bot, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ActorType = "user" | "system" | "driver" | "api";
type EventType = "status_change" | "assignment" | "manual_update" | "api_update" | "exception" | "note";

interface TimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  description?: string;
  actor: {
    type: ActorType;
    name: string;
    id?: string;
  };
  trigger: string;
  eventType: EventType;
  metadata?: Record<string, any>;
  notes?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
  collapsible?: boolean;
}

const getActorIcon = (type: ActorType) => {
  switch (type) {
    case "user":
      return <User className="h-3 w-3" />;
    case "system":
      return <Bot className="h-3 w-3" />;
    case "driver":
      return <Truck className="h-3 w-3" />;
    case "api":
      return <Bot className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

const getEventTypeColor = (type: EventType) => {
  switch (type) {
    case "status_change":
      return "bg-blue-100 text-blue-800";
    case "assignment":
      return "bg-green-100 text-green-800";
    case "manual_update":
      return "bg-purple-100 text-purple-800";
    case "api_update":
      return "bg-orange-100 text-orange-800";
    case "exception":
      return "bg-red-100 text-red-800";
    case "note":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function Timeline({ events, className, collapsible = true }: TimelineProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsible);

  return (
    <div className={cn("w-full", className)}>
      {collapsible && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Activity Timeline</h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isCollapsed ? "Show Timeline" : "Hide Timeline"}
          </button>
        </div>
      )}
      
      {!isCollapsed && (
        <div className="max-h-96 overflow-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={event.id} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                    {getActorIcon(event.actor.type)}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {event.event}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getEventTypeColor(event.eventType))}
                      >
                        {event.eventType.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{event.timestamp}</span>
                      <span>•</span>
                      <span>by {event.actor.name}</span>
                      <span>•</span>
                      <span>via {event.trigger}</span>
                    </div>
                    
                    {event.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        <strong>Notes:</strong> {event.notes}
                      </div>
                    )}
                    
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <div className="mt-2">
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                            View Details
                          </summary>
                          <div className="mt-1 p-2 bg-gray-50 rounded">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
