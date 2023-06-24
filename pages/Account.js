import { getSession } from 'next-auth/react';
import AccountPage from '../components/AccountPage'

export default function Account({ user }) {
  return <AccountPage user={user} />;
}

export async function getServerSideProps(context) {
  const {session} = await getSession(context);
  const user = session?.user || null;

  if (!user) {
    return {
      redirect: {
        destination: '/login', // Redirect to the login page if user is not authenticated
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
