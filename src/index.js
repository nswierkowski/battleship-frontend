import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import { Amplify }from 'aws-amplify';
import { Authenticator } from "@aws-amplify/ui-react";
import SSOPanel from './components/SSOPanel/SSOPanel'
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
      Cognito: {
          userPoolClientId: '4qevdb93e6o7nsp2m5i2h7crke',
          userPoolId: 'us-east-1_J98SHoYb8',

          loginWith: {
              oauth: {
                  domain: 'https://ztw-battleship.auth.us-east-1.amazoncognito.com',
                  scopes: [],
                  redirectSignIn: 'http://localhost:3000',
                  redirectSignOut: 'http://localhost:3000',
                  responseType: 'code',
              },
              username: 'true',
          }
      }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Authenticator.Provider>
      <Authenticator
            variation={"modal"}
            signUpAttributes={["email"]}
        >
        <SSOPanel/>
        <Router>
          <AppRoutes />
        </Router>
      </Authenticator>
    </Authenticator.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
