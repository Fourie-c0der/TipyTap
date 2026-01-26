import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import authService from '../src/services/authService';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const authenticated = await authService.isAuthenticated();
        if (!mounted) return;
        if (authenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)');
        }
      } catch (e) {
        // fallback to auth
        if (mounted) router.replace('/(auth)');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return null;
}
