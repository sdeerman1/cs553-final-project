# Part 1 — Conceptual Foundations

## 1. Authentication vs. Authorization
In short, authentication proves the identity of the user, while authorization grants the user certain permissions. Authentication answers the question "Who are you?" and accepts login credentials, providing the user with a token to stay logged in throughout the entire session. Authorization answers the question "What can you do?" and grants the user permissions based on the user's role. Authentication must happen first to establish the user's identity, and the authorization decisions depend on the information gained from the user's identity.  
If the request does not contain valid authentication credentials, the API should throw an Unauthorized error, which means the system cannot authenticate who is sending the request. This error returns a 401 HTTP status code.  
If the caller is authenticated but does not have permission to perform the requested operation, the API should throw a Forbidden error, which returns a 403 HTTP status code. One example of this error being thrown is the user is attempting to perform an operation that is above their role level.

## 2. Passwords, Sessions, and Tokens
Attackers may try to steal the password database, and having plaintext passwords stored means the attackers can access each user's password. Instead, the server should hash the password and store the password hash in the database. Then, even if the database becomes compromised, the information stays safe. Storing the password as a hash turns it into a long, random string that cannot be reverse-engineered to access the original password string. This also provides protection from insider threats. Even database engineers or software engineers working on the system cannot view users' passwords.  
A session stores the login state on the server and uses a cookie to identify the client. All future requests then include the cookie for authentication. A token is a signed credential that the client sends with API requests. After the user logs in, the server issues a token. Future requests then include the token for authentication and the API checks the token before allowing access.  
Sessions are stored on the server, making it very easy to immediately log a user out should the administrator suspect a compromised account. However, sessions are stored on the server meaning that the server has to look up the session ID coming from the user. For this reason, tokens are much better for scalability.

## 3. JSON Web Tokens
A JSON Web Token is a compact signed token commonly used to represent identity and claims. There are three parts of a JWT: the header, the payload, and the signature. JWTs are signed, not automatically encrypted. Signing a JWT serves to provide data authenticity and verify that the payload hasn’t been tampered with. Anyone can decode a signed payload using free websites. Encrypting the token produces confidentiality by scrambling the payload, and the only way to view the contents is with a decryption key.  
If the server doesn’t validate the JWT, it will be blindly trusting the data stored in there. A normal user could decode the JWT and change their role to “admin”, escalating their privileges, before encoding it again. The point of the JWT is to ensure data authenticity, but without validation, a user could change any of the information.  
Finally, JWTs should have reasonable expiration times. If a user were to get their account banned, but the JWT is still valid for a long time, they could continue to access the system using the old JWT and continue performing malicious behavior.  

## 4. OAuth
OAuth is an authorization framework. The purpose is to allow an application to access user resources from another service without the user having to share their password with the application. The resource owner is the user that owns the account. The client application is the application acting on the resource owner’s behalf in communicating with the resource server. They do this communication through the authorization server. OAuth is the authorization server here, and it is responsible for authenticating the resource owner and creating a signed access token upon approval (such as a JWT). This allows the client application to access certain information from the resource server using the verified resource owner’s account without knowing the resource owner’s login information.  
Sharing a user’s password instead of the OAuth access token gives the third-party application unrestricted access to the user’s account indefinitely, or until the user changes their password. JWTs expire after a short time (such as an hour), meaning the access is limited and the danger is minimized should the token be stolen or leaked. This also ensures the client application never has access to the user’s login credentials, meaning the credentials are safe should the client application be attacked.  

## 5. PKI and Certificates
The public key is shared with others, and is used during the secure key exchange to verify signatures. The private key is to be kept secret. It proves control of an identity and is used to create signatures. The system proves its identity through possession of the private key.  
A certificate authority verifies identities and digitally signs certificates. The CA cryptographically signs certificates, validating that a website or server is who they say they are.  
The client validates many things before trusting a certificate. The certificate must be signed by a trusted certificate authority, it must be currently valid, the hostname must match the certificate, the certificate must be allowed to identify a server, the certificate must have not been revoked, and the server must prove it owns the private key.  
Skipping certificate validation undermines the whole PKI process and means there is no real security. An attacker could present their own certificate to intercept all traffic to and from the server. They would be able to see everything, including passwords, JWTs, and other sensitive data.

## 6. Databases, Messages, and Asynchronous Processing
If producing the report takes several minutes, keeping the HTTP requests open will exhaust the system resources and make the API unresponsive. Additionally, some APIs enforce request timeouts, so the request will end abruptly before finishing if it exceeds the timeout limit.  
A reasonable design would be to immediately create a database record that represents the requested job and generate a job ID that can be queried for status later. This record is inserted into the database with an initial status of “pending” and the API returns HTTP status code 202 Accepted. This alerts the user that the system has begun processing the request but the report has not yet been generated. The API then publishes a message containing the job ID to a message queue to ensure that each request is handled. The background worker then reads the message off the queue to begin processing the report, changing the database entry status to “processing”. Once the background worker finishes producing the report, it saves the report, updates the status to “completed”, and saves the file’s download URL. If the process fails, the background worker updates the status to “failed”. The client can check the job status through “GET /reports/{jobID}”. This returns HTTP status code 200 OK, and also returns the request’s status. Once the background worker has completed, checking the job status will return the download URL as well.  
For submitting the job, the HTTP status code is 202 Accepted. For retrieving its current status, the HTTP status code is 200 OK.  

# Part 2 - Secure API Design

## 1. Authentication and Authorization
| Request | Decision and Status Code |
|---|---|
| A request contains no access token | Rejected, 401 Unauthorized |
| A request contains an expired JWT | Rejected, 401 Unauthorized |
| A student requests one of their own tasks | Allowed |
| A student requests another student's task | Rejected, 403 Forbidden | 
| An instructor requests a task belonging to any student | Allowed |
Authentication covers the JWT and access token behavior, to verify that the user has a registered account before allowing the user to access the protected routes. The behavior that requires the user’s role is where authorization begins. Depending on their role, the user may not be allowed to complete certain tasks. In our example, students cannot access another student’s task or delete any tasks at all. Requesting another student’s task blends authorization with authentication, as the user will be allowed to perform this behavior if their role is instructor or if their JWT token identifies them as the user that the task belongs to.  

## 2. OAuth, JWT, and PKI Design
The access token is first issued by OAuth, which will authenticate the user and sign the token. This token is a JWT, and is returned to the user after they successfully login. The client sends the token to the API in the request header, and they must send this token each time they want to access a protected route. This can be achieved by using the “Authorization” header with the keyword “Bearer”.   
```bash
curl -X GET http://localhost:3000/tasks/task-001 \
  -H "Authorization: Bearer <<TOKEN>>"
```
Before trusting the JWT, the API must validate that it is a valid JWT and it has been cryptographically signed. The API uses PKI to verify the header and payload, which ensures that the token was created by OAuth and has not been edited or changed.  
The server presents a certificate that has been signed by a certificate authority to the client, and the client verifies this certificate using PKI.  HTTPS helps to encrypt the request body, including the JWT, so no malicious actor can eavesdrop and gain useful information (such as a valid Bearer token).  
If the client were to accept roles from the request body, an attacker could include “role”: “instructor” in the request body and escalate their privileges. This would be easy for them to figure out as well, as one of the 403 Unauthorized error messages is “This action requires one of these roles: instructor”.   

## 3. Database and Asynchronous Report Processing
To request a new report, the route is POST /reports. The user must include their JWT token in the header for authentication. The server then gives the report job a unique job ID. It extracts the student ID from the JWT, and sets the status of the report to “pending”. This information is inserted into the report jobs database table. The server then places a message on the queue containing the job ID and the student’s ID. The immediate HTTP status code response is 202 Accepted with the response body containing the job ID, status, and status URL: “{"jobId":"227bebab-fbc5-435a-9b4d-a0f21e440590","status":"pending","statusUrl":"/reports/227bebab-fbc5-435a-9b4d-a0f21e440590"}”
	To check the report’s status, use “GET /reports/{jobID}” and include the JWT token in the header. For this example, the request would be 
```bash
GET /reports/227bebab-fbc5-435a-9b4d-a0f21e440590
```
Checking the status returns HTTP code 200 OK.  
The background worker reads the message off the queue and immediately changes the status to “processing”. If processing succeeds, the background worker changes the status to “completed” and places the download URL into the database object. If processing fails, the background worker changes the status to “failed”.  


# Part 3 — Authentication and Authorization Implementation

## 4. Error Classification 
| Situation | Status Code |
|---|---|
| No access token was provided | 401 Unauthorized |
| The JWT has expired | 401 Unauthorized |
| The JWT signature is invalid | 401 Unauthorized |
| A validly authenticated student attempts an instructor-only operation | 403 Forbidden |


# Part 4 — Database Integration and Async/Await

## 2. Database and Asynchronous Behavior
Allowing user input to be put directly into an SQL query can result in SQL injection. Attackers could pass a malicious string that contains SQL code to access information they otherwise wouldn’t be able to access. This could potentially give attackers unbridled access to the database. Using parameterized SQL protects from injection by treating the query parameter strictly as string input, not SQL.  
Querying into the database is inherently asynchronous, and these query calls return a JavaScript promise first, instead of the result of the query. Leaving out the “await” keyword will cause the next line of code to execute immediately, which will usually reference the data returned from the query. This reference will be a promise object until the query finishes executing, which will return an empty JSON object. Using “await” will wait until the query finishes before continuing, ensuring the code works as intended.  


# Part 5 — Message Queues and Background Processing

## 3. Queue Behavior
The API returns 202 Accepted because, at that moment, the request has not been completed. It has been accepted and will execute eventually, but 200 OK and 201 Created insinuate that the report has been generated and is already available for download.  
Utilizing a background worker to create the report will allow the API to continue processing user requests without being weighed down by heavy report generation traffic. Background workers avoid spiking memory usage and triggering an HTTP timeout.  


# Part 7 — Reflection

## 1. Following a Request Through the System
The operation I am going to trace is “DELETE tasks/:id”. The client’s request will be formatted like:
```bash
curl -X DELETE http://localhost:3000/tasks/task-001 \
  -H "Authorization: Bearer <<TOKEN>>"
```
where “task-001” is the ID of the task to be deleted. The user must pass their JWT token in the header for authentication purposes. The route in the server first calls “authenticateToken” for authentication purposes. This is a helper function that reads the JWT token and calls “jwt.verify(token, jwtSecret)” to verify the user’s token. If the token is valid and authenticated, the process continues. If the token is invalid, malformed, expired, or missing, the server returns HTTP status code 401 with a message declaring why the user could not be authenticated. Next, the route handler calls “requireRole(“instructor”) for authorization purposes. This function checks the user’s role, which is given in the JWT, and allows the process to continue if the user is an instructor. If not, the server returns HTTP status code 403 Forbidden with the message stating that the route requires the role of instructor. Once the user is authenticated and authorized to delete a task, the server queries the database to delete the task where the task ID matches what the user included in the route URI. The query uses parameterized SQL to avoid SQL injection attacks. If the requested task does not exist in the database, the server returns HTTP status code 404 Not Found. If the task was successfully deleted, the server returns status 204, noting the request was successful but nothing needs to be returned in the response body. The whole route handler is enclosed in a try / catch block, which is able to catch any of the errors previously noted or a 500 Internal Server Error. This ensures that every error is caught and handled gracefully.  

## 2. Synchronous vs. Asynchronous Processing
An update task operation (“PATCH /tasks/:id”) should be completed directly in an HTTP request. This operation executes virtually instantly, so there is no reason to push it off to a background worker. All the request is doing is updating one field of a database entry, which only requires a fast SQL UPDATE statement. Utilizing a message queue and background worker for simple requests like this creates unnecessary overhead. The client will receive an HTTP status code 200 OK and will provide the updated task in the response body. If the request body input was invalid, the client will receive code 400 Bad Request. If the task ID does not exist in the database, the client will receive code 404 Not Found. If the user is unauthorized or there is an issue with the JWT, the client will receive code 401 Unauthorized. If the user attempts to update a task that does not belong to them, they will receive code 403 Forbidden. All other errors would route to code 500 Internal Server Error. Upon success, the database entry will be updated with whatever the user specified in the request body. The database entry will also update the column “updated_at” with the time the request was executed. This will track that the entry was updated after its creation.  
Report generation (“POST /reports”) should be handled using a message queue and background worker. This method is better for requests that take a long time to complete or are resource-intensive. Completing this request within the route handler would risk timeouts and exhaust memory resources if there were to be many concurrent requests. Using the background worker, the client receives an immediate 202 Accepted response and a JSON object containing the job ID, the status (“pending”), and the status URL (“/reports/{jobID}”). If a failure occurs with this method, the background worker updates the status to “failed” but does not crash the application. This is a graceful error handling method that allows the server to continue working on other jobs. The database is used to track the result through the “status” and “download_url” columns. The status starts as “pending”, is changed to “processing” once the background worker reads the message off the queue, and is changed to “completed” upon successful report generation. Upon success, the database_url object is updated from “null” to the location where the report was downloaded to.  

## 3. Lessons Learned
A web API simply will not be useful without database integration. A database provides persistence, meaning the data that is changed or updated will stay that way even if the server crashes or is taken down intentionally. When the server session is concluded, the state of the data is saved in the database so that if another server session is started, a user can continue to work on the data. Without it, the data will reset each time the program is run. Real-world applications will always be database-backed, as there is no point in making changes if they are not integrated to become part of the system. It is also crucial to have a database in the case of a crash or other server fail. Whatever work the user completed before the crash will be saved in the database and the state can be restored upon server restart.  
Authentication and authorization are also crucial and, once again, real-world applications ensure they have strong security in these ways. Authentication validates login credentials to prove the identity of the user. This allows the application to stay safe from attackers by banning accounts that have initiated attacks on the system. This also allows developers the knowledge of who is doing what on the system by checking the user credentials, which is especially needed after suspicious activity or an attack happens. Authorization grants the user certain permissions based on their roles, which they can gather through authenticated user accounts. Authorization is crucial if there are certain routes in the system that only administrators should be able to access. This ensures that users cannot escalate their privileges and gain unwarranted knowledge over the inner workings of the system.  
If your system implements authentication through a user login, secure password storage is essential. Passwords absolutely cannot be stored as plaintext. Attackers may try to steal the system’s password database, and if they are successful, they would be able to access every user’s password stored in plaintext. There must be storage of passwords, however, because the system must be able to authenticate user accounts. Passwords must be hashed before they are stored. Hashing a password changes it into a long, seemingly random string that cannot be reverse-engineered to reveal the original password. The system can then store the hash in the user database, so that even if the system becomes compromised, the information stays safe. This also provides your safety from any insider threats coming from the development team. Even if a developer has complete access to the password database, they still cannot view user passwords.  


