import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import { AppSidebar } from './_component/AppSidebar';
import AppHeader from './_component/AppHeader';

const WorkspaceLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider>

      <AppSidebar />

      <div className='w-full'>
        <AppHeader />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceLayout;
