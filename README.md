## The dog API - Jest - Supertest
*This repository contains an example of how to write API tests using the Jest testing framework, the SuperTest library for HTTP requests, and TypeScript.*

### **Prerequisites**
```
Before you continue, ensure you meet the following requirement:
- You have installed Nodejs.
```
### **Technologies**
- Typescript: `v5.0.4`
- Jest: `v29.5.0`
- Supertest: `v6.3.3`
- Path: `v0.12.7`
- Dotenv-cli: `v7.2.1`

### **Getting Started**
- To get started with this project, first install the project dependencies:
`npm install`
- To use the API in the QA environment, add your API key to the .env.qa file in the root directory of your project:
Ex: `X_API_KEY=your-api-key-here`
This key will be used to authenticate requests to the API.

### **Running Tests**
- To run test with the specific environment (example: .env.qa)
`npm run test:qa` 
- To run test with the specific file (example: get_favourites.spect.ts)
`npm run test:qa get_favourites`
