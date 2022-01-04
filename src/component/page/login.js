import { Auth } from 'aws-amplify';

const LoginPage =() =>{
    return(
        <div className="app" style={{height:"250px"}}>
            <div className="header">
                <div className="menu-circle"></div>
                <div className="header-menu">
                <button href="#" className="menu-link is-active">Login</button>
                </div>
            </div>
            <div className="desc">Please Login your google account!</div>
            <button id="loginViaGoogle" onClick={() => Auth.federatedSignIn( {provider: "Google"})}>
                <div className="google-btn">
                    <div className="google-icon-wrapper">
                        <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="logo" />
                    </div>
                    <p className="btn-text"><b>Sign in with google</b></p>
                </div>
            </button>
        </div>
    )
}

export default LoginPage;