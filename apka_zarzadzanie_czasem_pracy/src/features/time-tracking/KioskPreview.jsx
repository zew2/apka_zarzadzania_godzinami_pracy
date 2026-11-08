
import React from 'react';
import WelcomeKiosk from './WelcomeKiosk';

export default function KioskPreview() {
  return (
    <WelcomeKiosk
      onQuickAction={() => false}
      onOpenLogin={() => alert('Podgląd: logowanie podłączy Marcin')}
    />
  );
}
