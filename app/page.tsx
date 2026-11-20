'use client';

import React, { useState, useEffect } from 'react';
import { DashboardRoadmap } from '@/components/DashboardRoadmap';
import { userProfileStore } from '@/lib/store';
import { UserProfile } from '@/types';

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile>(userProfileStore.get());

  useEffect(() => {
    setProfile(userProfileStore.get());
  }, []);

  return <DashboardRoadmap profile={profile} />;
}
