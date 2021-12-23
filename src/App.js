import React, { useState, useEffect, useRef } from 'react';
import Amplify from '@aws-amplify/core';
import { Auth, Storage } from 'aws-amplify';
import avatar from './asset/default_avatar.jpg';
import './App.css';

const whiteList = JSON.parse(process.env.REACT_APP_WHITE_LIST)

function App() {

  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState();
  const [msg, setMsg] = useState();
  const [msgType, setMsgType] = useState('success');
  var currentTime = new Date();
  var year = currentTime.getFullYear();
  var month = ''+(currentTime.getMonth() + 1);
  var day = ''+currentTime.getDate();

  if (month.length < 2){
    month = '0' + month;
  }
  if (day.length < 2){
    day = '0' + day;
  }
  const folderName = year+"/"+month+"/"+day+"/";

  useEffect(() => {

    Amplify.configure({
        Storage: {
            AWSS3: {
                bucket: 'kenny-react-bucket-ca', //REQUIRED -  Amazon S3 bucket name
                region: 'ca-central-1', //OPTIONAL -  Amazon service region
            }
        }
    });

  }, []);

  useEffect(() => {

    checkUser();

  }, []);

  async function checkUser() {
    try {
      const currentUser = await Auth.currentUserPoolUser();
      setUser({username: currentUser.username, ...currentUser.attributes})
      console.log(currentUser);     
    } catch (error) {
      console.log(error);
    }
  }

  function logOff() {
    Auth.signOut();
  }

  const ref = useRef(null);

  const loadList = () => {
    if(user) {
      Storage.list('',{
        level: '',
      }).then(files => { // file name filter, if listing all files without prefix, pass '' instead
        setFiles(files);
      }).catch(err => { 
        console.log(err);
      });
    }
    else{
      console.log("need login to show list");
    }
  }

  useEffect(() => {
    loadList();
  });

  const handleFileLoad = (e) => {
    const filename = ref.current.files[0].name;
    const fileSize = e.target.files[0].size;
    console.log(filename);
    console.log(fileSize);
    if(filename){
      if(fileSize>8000000){
        setMsg('The Maximum size you can upload is 8MB!');
        setMsgType('error');
        return(false);
      }
      Storage.put(folderName+filename, ref.current.files[0], {
        progressCallback: (progress) => {
          setProgress('Uploading: '+ Math.round((progress.loaded / progress.total) * 100) + '%');
          setTimeout(() => {
            setProgress();
          }, 1000);
        },
        acl: "public-read", // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
        contentType: "video/mp4",
      }).then(resp => {
        console.log(resp);
        loadList();
        setMsg(user.email+' uploaded '+filename+' successful!');
        setMsgType('success');
        console.log(user.email,'uploaded', filename, 'successful!');
      }).catch(err => {console.log(err);});
    }
    else {
      return(false);
    }
  }

  if(user) {

    var whitelistpass = false;


    for (var i=0;i<(whiteList.length);i++){

      //console.log(i+" "+user.email+" "+whiteList[i]);
      if(user.email===whiteList[i]){
        // console.log('you are whitelist user!');
        whitelistpass = true;
      }
    }
    if (whitelistpass){
      return(
        <div className="app">
          <div className="header">
            <div className="menu-circle"></div>
            <div className="header-menu">
              <button href="#" className="menu-link is-active">Upload Files</button>
              {/*<button href="#" className="menu-link notify">Your History</button>
              <button href="#" className="menu-link">Remarks</button>*/}
            </div>
            {/*<div className="search-bar">
              <input type="text" placeholder="Search" />
            </div>*/}
            <div className="header-profile">
              <h6>Welcome! { user.email }</h6>
              <div className="dropdown profilePic">
                <img className="profile-img" src={avatar} alt="" />
              </div>
            </div>
          </div>
          <div className="desc2">Please upload your video: </div>
          <input className="uploadBtn" ref={ref} type="file" accept=".mp4" onChange={handleFileLoad} />
          <div className="progressBar">{ progress }</div>
          <div className={"msgBar "+msgType}>{ msg }</div>
          <table id="videoList">
            <thead>
              <tr>
                <td>#</td>
                <td>File Name</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {files.map((file,i) =>(
                <tr key={file.key}>
                  <td>{i+1}</td>
                  <td>{file.key}</td>
                  <td>
                    <button onClick={ ()=> window.open("https://kenny-react-bucket-ca.s3.ca-central-1.amazonaws.com/public/"+file.key, "_blank") }>Open Link</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="logOut" onClick = { logOff} > Log Out</button>
        </div>
      );
    }
    else{
      return(
        <div className="app" style={{height:"250px"}}>
          <div className="header">
            <div className="menu-circle"></div>
            <div className="header-menu">
              <button href="#" className="menu-link is-active">Login</button>
            </div>
          </div>
          <div className="desc">{user.email} <br></br>You have no access! Please Login another google account!</div>
              <button className="logOut" onClick = { logOff} > Logout</button>
        </div>
      );
    }
  } else {
    return (
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
    );
  } 
}

export default App;