import { useAuth0 } from '@auth0/auth0-vue';

const auth0 = useAuth0();

export const login = async () => {
  await auth0.loginWithRedirect({
    authorizationParams: {
      audience: 'https://demo-api.project-onyx-test.com',
      scope: 'openid profile email offline_access',
    },
  });
};

export const getBearerToken = async () => {
  const bearerToken = await auth0.getAccessTokenSilently();
  console.log('authService', bearerToken);

  return bearerToken;
};
