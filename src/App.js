import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import LoginPage from './component/page/login';
import ErrorLoginPage from './component/page/error_login';
import ListPage from './component/page/list';
import S3Config from './s3Config';
import * as R from 'ramda'
import './App.css';

const whiteList = JSON.parse(process.env.REACT_APP_WHITE_LIST);

function App() {
  S3Config();
  //console.log('out: '+Checkuser().username);   
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await Auth.currentUserPoolUser();
        setUser({username: currentUser.username, ...currentUser.attributes});
        console.log(currentUser);     
      } catch (error) {
        console.log(error);
      }
    }
    checkUser();
  }, []);

  if(user) {
    
    console.log(R.includes(user.email, whiteList));
    var whitelistpass = R.includes(user.email, whiteList);

    if (whitelistpass){
      return(
        <ListPage></ListPage>
      );
    }
    else{
      return(
        <ErrorLoginPage user={user}></ErrorLoginPage>
      );
    }
  } else {
    return (
      <LoginPage user={user}></LoginPage>
    );
  }
}

export default App;