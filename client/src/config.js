let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://project-elixir-server.herokuapp.com';
} else {
  BASE_URL = 'http://0.0.0.0:80';
}

export default BASE_URL;
