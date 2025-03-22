# Environment Variables Setup

This project requires several environment variables to function correctly. Follow the steps below to obtain and set them up in your `.env` file.

## Required Environment Variables

```
MONGO_URI= "your MongoDB URL"
PORT=5001
JWT_SECRET="Your JWT Token"
MAILTRAP_TOKEN="Your Mailtrap Token"
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/
CLOUDINARY_CLOUD_NAME="Your Cloudinary Name"
CLOUDINARY_API_KEY="Your Cloudinary API Key"
CLOUDINARY_API_SECRET="Your Cloudinary API Secret"
```

## How to Obtain These Keys

### 1. MongoDB URI
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) if you don’t have an account.
- Create a new cluster.
- Click on "Connect" > "Connect your application".
- Copy the connection string and replace `<username>`, `<password>`, and `<dbname>` with your credentials.

### 2. JWT Secret
- Generate a secure random string using:
  ```sh
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Copy the output and use it as `JWT_SECRET`.

### 3. Mailtrap Credentials
- Sign up at [Mailtrap](https://mailtrap.io/).
- Navigate to "API Tokens" and create a new token.
- Copy the `MAILTRAP_TOKEN` value.
- Use `https://send.api.mailtrap.io/` as the `MAILTRAP_ENDPOINT`.

### 4. Cloudinary API Keys
- Sign up at [Cloudinary](https://cloudinary.com/).
- Go to "Dashboard".
- Copy the `Cloud Name`, `API Key`, and `API Secret`.
- Use these values in the corresponding environment variables.

## Setting Up the `.env` File
1. In the `backend/` directory, create a file named `.env`.
2. Paste the above variables into the file and replace placeholder values with actual credentials.
3. Save the file. Ensure it is added to `.gitignore` to avoid exposing sensitive data.

## Verifying the Setup
- Run `npm start` in the backend to ensure all environment variables are loaded correctly.
- If any issues arise, double-check the credentials and ensure they are correctly set up.

Now your backend is configured to use external services securely! 🚀

