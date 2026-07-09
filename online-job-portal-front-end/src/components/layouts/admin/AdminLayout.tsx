import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const tabTitles = {
  dashboard: "Dashboard",
  users: "User Management",
  packages: "Package Management",
  posts: "Post Management",
  notifications: "Notifications",
  reports: "Reports",
  refunds: "Refund Management",
  companies: "Company Management",
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path (e.g. /admin/users -> users)
  const pathParts = location.pathname.split("/");
  const activeTab = pathParts[2] || "dashboard";

  const handleTabChange = (tab: string) => {
    navigate(`/admin/${tab}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title={tabTitles[activeTab as keyof typeof tabTitles] || "Admin"}
          onTabChange={handleTabChange}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
