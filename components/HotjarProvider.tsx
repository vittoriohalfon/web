'use client';

import { useEffect } from 'react';
import Hotjar from '@hotjar/browser';

const HotjarProvider = () => {
  useEffect(() => {
    const hotjarSiteId = 5228160;
    const hotjarVersion = 6;
    
    Hotjar.init(hotjarSiteId, hotjarVersion, {
      debug: true
    });
  }, []);

  return null;
};

export default HotjarProvider; 