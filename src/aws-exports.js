/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
    "aws_project_region": "ca-central-1",
    "aws_cognito_identity_pool_id": "ca-central-1:b261939b-8c4f-4fee-a5c6-dd4dca699712",
    "aws_cognito_region": "ca-central-1",
    "aws_user_pools_id": "ca-central-1_JlqL8UOdB",
    "aws_user_pools_web_client_id": "7hecr3sqlkrkdj7ugim714iqf8",
    "oauth": {
        "domain": "reactoauth3847574a-3847574a-dev.auth.ca-central-1.amazoncognito.com",
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "redirectSignIn": "http://localhost:3000/",
        "redirectSignOut": "http://localhost:3000/",
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_POOLS",
    "aws_cognito_login_mechanisms": [
        "PREFERRED_USERNAME"
    ],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ]
};


export default awsmobile;
