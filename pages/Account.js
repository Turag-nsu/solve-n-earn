import { useSession } from 'next-auth/react';
import AccountPage from '../components/AccountPage';

export default function Account() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Redirect to="/login" />;
  }
console.log(session.session.user)
  return <AccountPage user={session.session.user} />;
}
