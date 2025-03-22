## Project Name

### Description

This project is a test management system that allows teachers to create multiple-choice questions and other types of exams, students to take exams, and admins to manage the system. It includes authentication, profile management, and performance reporting features.

### Features

- User authentication (Admin, Teacher, Student)
- Multiple-choice and coding question management
- Automated evaluation of student answers
- Performance report generation
- Profile management with cloud storage for profile images
- Email verification and password reset

### Technologies Used

#### Backend:

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Multer (for file uploads)
- Mailtrap (for email services)

#### Frontend:

- React.js
- Vite
- Tailwind CSS
- Zustand (for state management)
- ESLint (for code quality)

### Project Structure

```
.vscode/
backend/
    controllers/
    db/
    mailtrap/
    middleware/
    models/
    routes/
    utils/
frontend/
    public/
    src/
        components/
        pages/
        store/
        utils/
        styles/
```

### Installation

#### Backend Setup

1. Navigate to the `backend/` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `backend/` directory and add the necessary environment variables:
   ```sh
   touch .env
   ```
   `.env` file content:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   MAILTRAP_TOKEN="Your Mailtrap token"
   MAILTRAP_ENDPOINT= https://send.api.mailtrap.io/
   CLOUDINARY_CLOUD_NAME="Your Cloudinary Cloud name"
   CLOUDINARY_API_KEY="Cloudinary API Key"
   CLOUDINARY_API_SECRET="Cloudinary API Key"
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

#### Frontend Setup

1. Navigate to the `frontend/` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### API Endpoints

#### Authentication

- `POST /api/auth/signup` - Register a user
- `POST /api/auth/login` - Login a user

#### Question Management

- `POST /api/question` - Add a question
- `GET /api/question` - Fetch all questions

#### Exam Management

- `POST /api/exam/submit` - Submit exam answers
- `GET /api/exam/results/:studentId` - Fetch exam results

### Contribution

Contributions are welcome! Feel free to fork this repository and submit a pull request.

### License

This project is licensed under the MIT License.

