import React from "react";
import Sidebar from "./Sidebar.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow bg-gray-100 p-6">{children}</main>
    </div>
  );
};

export default Layout;
