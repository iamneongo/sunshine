import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  Settings2,
  Users
} from "lucide-react";

export interface DashboardNavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface DashboardNavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: DashboardNavSubItem[];
}

export interface DashboardNavGroup {
  id: number;
  label?: string;
  items: DashboardNavMainItem[];
}

export const dashboardSidebarGroups: DashboardNavGroup[] = [
  {
    id: 1,
    items: [
      {
        title: "Tổng quan",
        url: "/dashboard/overview",
        icon: LayoutDashboard
      },
      {
        title: "Lead",
        url: "/dashboard/leads",
        icon: Users
      },
      {
        title: "Phân tích",
        url: "/dashboard/analytics",
        icon: BarChart3
      }
    ]
  },
  {
    id: 2,
    items: [
      {
        title: "Follow-up",
        url: "/dashboard/follow-up",
        icon: ClipboardList
      },
      {
        title: "Bảo trì",
        url: "/dashboard/maintenance",
        icon: Settings2
      }
    ]
  }
];
