import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TmsSidebar } from "./TmsSidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TmsLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function TmsLayout({ children, title, breadcrumbs }: TmsLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/20">
        <TmsSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-background flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              
              {/* Division Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Division:</span>
                <Select defaultValue="west">
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Breadcrumbs */}
              {breadcrumbs && (
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index > 0 && <span>/</span>}
                      {crumb.href ? (
                        <a href={crumb.href} className="hover:text-foreground">
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="text-foreground font-medium">{crumb.label}</span>
                      )}
                    </div>
                  ))}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Page Title */}
          {title && (
            <div className="px-6 py-4 border-b bg-background">
              <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}