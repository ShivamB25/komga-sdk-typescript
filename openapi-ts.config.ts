export default {
  input: 'https://raw.githubusercontent.com/gotson/komga/master/komga/docs/openapi.json',
  output: {
    clean: false,
    entryFile: false,
    path: './.tmp/generated',
  },
  plugins: ['@hey-api/client-fetch'],
};
