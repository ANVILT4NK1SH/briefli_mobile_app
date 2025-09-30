import { defineBoot } from '@quasar/app-vite/wrappers';
import { type AuthorizationParams, createAuth0 } from '@auth0/auth0-vue';
export default defineBoot(({ app, router }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const isSignup = urlParams.get('isSignup');
  const signupEmail = urlParams.get('email');
  const authParams: AuthorizationParams = {
    redirect_uri: `${window.location.origin}/callback`,
    audience: 'https://demo-api.project-onyx-test.com',
    prompt: 'login',
  };
  if (isSignup) authParams.screen_hint = 'signup';
  if (signupEmail) authParams.login_hint = signupEmail;
  const authClient = createAuth0(
    {
      domain: 'login.project-onyx-test.com',
      clientId: 'BfaEP7wp9fS2BilCBDglF5ZjpbWcWA5U',
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      authorizationParams: {
        ...authParams,
      },
    },
    {
      skipRedirectCallback: window.location.pathname === '/sharepoint/redirect',
    },
  );
  // see: https://github.com/auth0/auth0-vue/issues/258#issuecomment-1773724878
  app.config.globalProperties.$router = router;
  console.log('Using authclient')
  app.use(authClient);
});
