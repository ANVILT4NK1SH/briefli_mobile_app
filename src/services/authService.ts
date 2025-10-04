import { useAuth0 } from '@auth0/auth0-vue';

const auth0 = useAuth0();

export const login = async () => {
  await auth0.loginWithRedirect({
    authorizationParams: {
      audience: `${process.env.API_URL}`,
      scope: 'openid profile email offline_access',
    },
  });
};

// Couldn't get this to work?????
// export const getBearerToken = async () => {
//   const bearerToken = await auth0.getAccessTokenSilently();
//   console.log('authService', bearerToken);

//   return bearerToken;
// };
