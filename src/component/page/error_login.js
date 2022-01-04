import { Auth } from 'aws-amplify';

function logOff() {
    Auth.signOut();
}

const ErrorLoginPage =(user) =>{
    return(
        <div className="app" style={{height:"250px"}}>
          <div className="header">
            <div className="menu-circle"></div>
            <div className="header-menu">
              <button href="#" className="menu-link is-active">Login</button>
            </div>
          </div>
          <div className="desc">{user.email} <br></br>You have no access! Please Login another google account!</div>
              { <button className="logOut" onClick = { logOff} > Logout</button> }
        </div>
    )
}

export default ErrorLoginPage;