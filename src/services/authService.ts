import { useAuth0 } from '@auth0/auth0-vue';
import { ref } from 'vue';

export const login = async () => {
  const auth0 = useAuth0();

  await auth0.loginWithRedirect({
    authorizationParams: {
      audience: `${process.env.API_URL}`,
      scope: 'openid profile email offline_access',
    },
  });
};

export const authService = {
  // Reactive reference to store the bearer token
  bearerToken: ref<string>(''),

  // Function to initialize and fetch the bearer token
  async initializeBearerToken(): Promise<string> {
    const auth0 = useAuth0();
    // Check if user is authenticated
    if (!auth0.isAuthenticated.value) {
      throw new Error('User is not authenticated');
    }

    try {
      // Fetch the access token silently
      this.bearerToken.value = await auth0.getAccessTokenSilently();
      return this.bearerToken.value;
    } catch (error) {
      console.error('Error fetching bearer token:', error);
      throw new Error('Failed to fetch bearer token');
    }
  },

  // Function to get the bearer token (returns cached token if available)
  async getBearerToken(): Promise<string> {
    // Return cached token if it exists
    if (this.bearerToken.value) {
      return this.bearerToken.value;
    }

    // Otherwise, initialize and fetch the token
    return await this.initializeBearerToken();
  },
};
