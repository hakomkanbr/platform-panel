"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setSiteSlug } from '@repo/store';
import { getCookie } from '@/app/actions/set-cookie';
import { SiteSlug } from '@repo/shared-types';
import { IModule, IUserProps } from '@repo/shared-types';
import { AdminShell } from '@repo/shell';
import siteRequiredPaths from '@/utils/site-required-paths';
import ModernSiteSelect from './header/ModernSiteSelect';
import RedirectWebsite from './header/RedirectWebsite';
import MigrateDatabase from './header/MigrateDatabase';

interface ModernLayoutProps {
  children: React.ReactNode;
  modules: IModule[];
  user: IUserProps;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children, modules, user }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user]);

  const handleLogout = () => {
    document.cookie = "AuthToken=; path=/; max-age=0";
    location.href = "/auth/login";
  };

  return (
    <AdminShell
      modules={modules}
      user={user}
      siteRequiredPaths={siteRequiredPaths}
      onLogout={handleLogout}
      headerComponents={{
        siteSelect: user?.userId && <ModernSiteSelect />,
        redirectWebsite: <RedirectWebsite />,
        migrateDatabase: process.env.NODE_ENV === 'development' ? <MigrateDatabase /> : undefined,
      }}
    >
      {children}
    </AdminShell>
  );
};

export default ModernLayout;
