import { Amplify } from 'aws-amplify';

const awsConfig: any = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID || '',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: false,
        username: false
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_AWS_APPSYNC_API_URL || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool'
    }
  }
};

export const configureAmplify = () => {
  Amplify.configure(awsConfig);
}; 