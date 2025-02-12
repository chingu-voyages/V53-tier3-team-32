import React from "react";
import Sidebar from "./Sidebar.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 overflow-hidden">{children}</main>
    </div>
  );
};

export default Layout;
