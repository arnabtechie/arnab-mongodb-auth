# Building a Scalable Node.js and MongoDB Application with Express

A brief description of the project.

## Requirements

- Node.js (16.x or above)
- Express.js
- MongoDB
- Mongoose
- Chai (Assertion library used)
- Mocha (Test framework used)
- MongoDB In Memory (For unit testing only)

## Installation

1. Clone the repository: `git clone https://github.com/arnabtechie/arnab-mongodb-auth.git`
2. Install dependencies: `npm install`
3. Copy `config.json` and update the values with your MySQL database information.
4. Start the application: `npm start`
5. Start the application on dev mode: `npm run dev`
6. Run the unit test cases on: `npm run test or npm test`
7. Test the lint on: `npm run lint`

## Configuration

The `config.json` file contains the configuration options for the application. Here is an example configuration:

Configure prettier for VS Code for better formatting, please follow the .prettierrc to review the configuration

Configure ESLint for linting and catching bad code, please follow the .eslintrc.json review the configuration

```json
{
  "PORT": 4000,
  "JWT_SECRET": "any-random-string",
  "DB_CONNECTION_STRING": "mongodb://localhost:27017/test"
}
```

## License

This project is licensed under the ISC License, which means it is free to use, modify, and distribute.

### ISC License

This section communicates that the project is under the ISC License, emphasizing its permissive nature and that it's free to use.
