import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function AuthIndex() {
  const router = useRouter();
  useEffect(() => {
    // Check if logged in before, then just give pin instead of login page
    // if logged == TRUE { router.replace('/pin') }
    // else { router.replace('/login') }
    router.replace('/(tabs)');
  }, []);
  return null;
}
