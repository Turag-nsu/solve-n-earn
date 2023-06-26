import React from 'react';
import { useSession } from 'next-auth/react';
const helloWorld = () => {

    const { data: session } = useSession();
    console.log(session);
    return (
        <div>
            <img src={session?.session?.user?.image} alt="user profile picture" />
        </div>
    );
};

export default helloWorld;