
import { Auth, Storage } from 'aws-amplify';
import avatar2 from '../../asset/default_avatar.jpg';
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

const ListPage =(user) =>{


    function logOff() {
        Auth.signOut();
    }

    const ref = useRef(null);
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState();
    const [msg, setMsg] = useState();
    const [msgType, setMsgType] = useState('success');
    const folderName = format(new Date(), 'yyyy/MM/dd');

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
        if(filename&&user){
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
    
    return(
        <div className="app">
          <div className="header">
            <div className="menu-circle"></div>
            <div className="header-menu">
              <button href="#" className="menu-link is-active">Upload Files</button>
            </div>
            <div className="header-profile">
              <h6>Welcome! { user.email }</h6>
              <div className="dropdown profilePic">
                <img className="profile-img" src={avatar2} alt="" />
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
          <button className="logOut" onClick = { logOff } > Log Out</button>
        </div>
    )
}

export default ListPage;