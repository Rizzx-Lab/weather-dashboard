import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://api.openweathermap.org/data/2.5/graphql', // Note: OpenWeather doesn't have GraphQL
});

const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_WEATHER_API_KEY;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});