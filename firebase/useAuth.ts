import { useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';

export default function useToken() {
  const router = useRouter();
  const cookies = parseCookies();
  const token = cookies['token'];
  const decodedToken = token ? jwtDecode(token) : null;

  useEffect(() => {
    // if (!token) {
    //   router.push('/login');
    // }
  }, [token, router]);

  return decodedToken;
}
