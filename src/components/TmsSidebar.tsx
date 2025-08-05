
import { useState } from "react";
import { Package, Ship, Truck, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Order",
    url: "/",
    icon: Package,
    subItems: [
      { title: "Order List", url: "/" },
      { title: "EDI Logs", url: "/orders/edi-logs" },
    ]
  },
  {
    title: "Shipment",
    url: "/shipments",
    icon: Ship,
    subItems: [
      { title: "Shipment List", url: "/shipments" },
      { title: "Planning", url: "/shipments/planning" },
      // { title: "Carrier Assignment", url: "/shipments/tendering" },
      { title: "Dispatch Board", url: "/shipments/dispatch" },
      // { title: "Tracking", url: "/shipments/tracking" },
    ]
  },
];

export function TmsSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const isParentActive = (item: any) => 
    item.subItems.some((subItem: any) => isActive(subItem.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TMS</span>
            </div>
            {!collapsed && (
              <div>
                <div className="font-semibold text-sm">FreightPath Nova</div>
                <div className="text-xs text-muted-foreground">Transportation Management</div>
              </div>
            )}
          </div>
        </div>

        {menuItems.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-4 py-2">
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {!collapsed && item.title}
              </div>
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu>
                {item.subItems.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={subItem.url} className={getNavCls}>
                        <div className="w-2 h-2 rounded-full bg-current opacity-40 ml-6" />
                        {!collapsed && <span className="text-sm text-black">{subItem.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
