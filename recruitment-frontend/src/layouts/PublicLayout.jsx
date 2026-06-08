import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/public-theme.css';
import LandingNav from '../components/landing/LandingNav';
import LandingFooter from '../components/landing/LandingFooter';

export default function PublicLayout() {
  const [, setLive] = useState(false);

  return (
    <div className="public-theme min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-grow">
        <Outlet context={{ setLive }} />
      </main>
      <LandingFooter />
    </div>
  );
}
