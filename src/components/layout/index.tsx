import React from "react";
import { Outlet } from "react-router";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
