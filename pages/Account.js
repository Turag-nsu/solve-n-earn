import { useSession } from 'next-auth/react';
import AccountPage from '../components/AccountPage';
import { useRouter } from 'next/router';

export default function Account() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    // return <Redirect to="/login" />;
    router.replace('/login');
  }
console.log(session)

  return <AccountPage user={session?.session?.user} id={session.token.sub} />;
}
