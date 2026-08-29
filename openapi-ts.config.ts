export default {
  input: 'https://raw.githubusercontent.com/gotson/komga/1.26.3/komga/docs/openapi.json',
  output: {
    clean: true,
    entryFile: false,
    importFileExtension: '.js',
    path: './.tmp/generated',
  },
  plugins: [
    {
      name: '@hey-api/client-fetch',
      throwOnError: false,
    },
    '@hey-api/typescript',
    {
      name: '@hey-api/sdk',
      client: '@hey-api/client-fetch',
      operations: 'flat',
      paramsStructure: 'flat',
      responseStyle: 'fields',
    },
  ],
};
