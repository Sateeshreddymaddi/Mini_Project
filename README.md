# **📘 Test Management System**  

## **🚀 Description**  

A powerful **Test Management System** designed for **teachers, students, and admins** to create, manage, and evaluate exams. It supports multiple-choice and coding questions, automated grading, and detailed performance reporting.  

## **✨ Features**  

✅ **User Roles:** Admin, Teacher, and Student authentication  
✅ **Question Management:** Create and manage multiple-choice & coding questions  
✅ **Automated Evaluation:** Instant grading of student answers  
✅ **Performance Reports:** Generate detailed student analytics  
✅ **Cloud Profile Management:** Store profile images securely  
✅ **Email Services:** Email verification & password reset  

## **🛠️ Technologies Used**  

### **Backend**  
🚀 **Node.js** – Server-side JavaScript runtime  
⚡ **Express.js** – Web framework for APIs  
🗄️ **MongoDB Atlas** – Cloud database for scalability  
📂 **Mongoose** – ODM for MongoDB  
📦 **Multer** – File upload handling  
📧 **Mailtrap** – Email services for testing  

### **Frontend**  
⚛️ **React.js** – Fast and modern UI framework  
⚡ **Vite** – Lightning-fast build tool  
🎨 **Tailwind CSS** – Utility-first styling framework  
🗄️ **Zustand** – Simple state management  
🔍 **ESLint** – Ensuring clean and structured code  

## **📁 Project Structure**  

```plaintext
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

## **⚙️ Installation Guide**  

### **🔹 Backend Setup**  

1️⃣ Navigate to the `backend/` folder:  
   ```sh
   cd backend
   ```  
2️⃣ Install dependencies:  
   ```sh
   npm install
   ```  
3️⃣ Create a **`.env`** file and add the following environment variables:  
   ```sh
   touch .env
   ```  
   ** Add the mentioned `.env` file:**  
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   MAILTRAP_TOKEN=your_mailtrap_token
   MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```  
4️⃣ Start the backend server:  
   ```sh
   npm start
   ```  

### **🔹 Frontend Setup**  

1️⃣ Navigate to the `frontend/` folder:  
   ```sh
   cd frontend
   ```  
2️⃣ Install dependencies:  
   ```sh
   npm install
   ```  
3️⃣ Start the frontend development server:  
   ```sh
   npm run dev
   ```  

## **📡 API Endpoints**  

### **🛂 Authentication**  
🔹 `POST /api/auth/signup` – Register a new user  
🔹 `POST /api/auth/login` – Login with credentials  

### **❓ Question Management**  
🔹 `POST /api/question` – Add a new question  
🔹 `GET /api/question` – Retrieve all questions  

### **📊 Exam Management**  
🔹 `POST /api/exam/submit` – Submit exam answers  
🔹 `GET /api/exam/results/:studentId` – Fetch exam results  

## **🤝 Contribution**  

Contributions are **welcome**! Feel free to fork this repository and submit a pull request. 🚀  

## **📜 License**  

This project is licensed under the **MIT License**.  
