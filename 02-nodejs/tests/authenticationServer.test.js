const http = require('http');
const server = require('../authenticationServer');
const fs = require("fs")
const path = require("path")

const email = 'testuser@gmail.com';
const password = 'testpassword';
const firstName = "kirat"
const lastName = "kirat"


describe('API Tests', () => {
  let globalServer;
  beforeAll((done) => {
      if (globalServer) {
        globalServer.close();
      }
    globalServer = server.listen(3000);
    done()
  });

  afterAll((done) => {
    globalServer.close(done);
    data = fs.readFileSync(path.join(__dirname, "../files/users.json"), "utf-8")
    console.log(data);
    let users = JSON.parse(data)
    delete users[email]
    fs.writeFileSync(path.join(__dirname, "../files/users.json"), JSON.stringify(users))
  });

  it('should allow a user to sign up', async () => {
    const requestBody = JSON.stringify({ email, password, firstName, lastName });

    const options = {
      method: 'POST',
      path: '/signup',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestBody.length,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toBe('Signup successful');
  });

  it('should allow a user to login', async () => {
    const requestBody = JSON.stringify({ email, password });

    const options = {
      method: 'POST',
      path: '/login',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestBody.length,
      },
    };

    const response = await sendRequest(options, requestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();

    // expect(response.body.data).toBe(email);
    expect(response.body.data.firstName).toBe(firstName);
    expect(response.body.data.lastName).toBe(lastName);

    // authToken = responseBody.authToken;
  });

  it('should return unauthorized for accessing protected data without authentication', async () => {
    const options = {
      method: 'GET',
      path: '/data',
      headers: {
        email,
        password: "",
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(401);
    expect(response.body.data).toBe('Unauthorized');
  });

  it('should return the users for accessing protected data with authentication', async () => {
    const options = {
      method: 'GET',
      path: '/data',
      headers: {
        email,
        password
      },
    };

    const response = await sendRequest(options);

    expect(response.statusCode).toBe(200);

    expect(response.body.length).toBe(1);
  });
});

function sendRequest(options, requestBody) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        ...options,
        host: 'localhost',
        port: 3000,
      },
      (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body),
          });
        });
      }
    );

    req.on('error', (err) => {
      reject(err);
    });

    if (requestBody) {
      req.write(requestBody);
    }

    req.end();
  });
}
