import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './SSOPanel.css'

const SSOPanel = () => {
    const { user, signOut } = useAuthenticator((context) => [context.user]);

    return (
        <div class='SSOPanel'>
          <h1>Welcome, {user.username}</h1>
          <button onClick={signOut}>Sign Out</button>
        </div>
      );
};

export default SSOPanel;