import Amplify from '@aws-amplify/core';

const S3Config =() =>{ 
    Amplify.configure({
        Storage: {
            AWSS3: {
                bucket: 'kenny-react-bucket-ca', //REQUIRED -  Amazon S3 bucket name
                region: 'ca-central-1', //OPTIONAL -  Amazon service region
            }
        }
    });
}

export default S3Config;