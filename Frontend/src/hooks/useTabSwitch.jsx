import { useEffect } from 'react';

const useTabSwitchReload = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

export default useTabSwitchReload;
