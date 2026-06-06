export default {
  input: 'http://localhost:5000/swagger/v1/swagger.json',
  output: 'src/api/generated',
  plugins: ['@hey-api/typescript'],
}
