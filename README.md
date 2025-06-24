# 📰 Article Feeds Web Application - ARTICLIO

An interactive and responsive web application that allows users to register, log in, manage their article preferences, and create or engage with content in multiple categories like Sports, Politics, Space, and more.

---

## 🔗 Live Link: (https://articlio.vercel.app/)

**Coming Soon** (Deploy to Vercel/Netlify & Render/Railway)

---

## 📦 Repository

GitHub: [https://github.com/ajaypalamkunnel/ARTICLIO](https://github.com/ajaypalamkunnel/ARTICLIO)

---

## ⚙️ Project Architecture

### Backend: Node.js + Express.js + MongoDB (MVC + Repository Pattern)

```
backend/
├── controllers/
│   └── userController.js
│   └── articleController.js
├── routes/
│   └── userRoutes.js
│   └── articleRoutes.js
├── services/
│   └── userService.js
│   └── articleService.js
├── repositories/
│   └── userRepository.js
│   └── articleRepository.js
├── models/
│   └── User.js
│   └── Article.js
├── middlewares/
│   └── authMiddleware.js
├── utils/
│   └── db.js
├── app.js
└── server.js
```

### Frontend: React.js + Axios + Tailwind/Bootstrap

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.js
│   └── index.js
```

---

## ✅ Features

- 🔐 Secure signup/login (email or phone)
- 🎯 Dashboard based on user preferences
- ✍️ Users can create, edit, delete articles
- ❤️ Like, ❌ Dislike, 🚫 Block articles
- ⚙️ Profile & password management
- 📱 Fully responsive and interactive UI

---

## 📑 Pages

| Page                | Description                                                         |
|---------------------|---------------------------------------------------------------------|
| Registration        | Signup form with preferences                                       |
| Login               | Login via email or phone                                           |
| Dashboard           | Feed of articles matching preferences                              |
| Article View        | Full article with like/dislike/block options (popup or page)       |
| Settings            | Update personal info & preferences                                |
| Article Creation    | Add article with title, content, image, tags, and category         |
| My Articles         | List of user's articles with edit/delete/analytics                 |
| Article Edit        | Modify an existing article                                         |

---

## 📚 Technologies

### Frontend
- React.js
- Axios
- React Router
- Tailwind CSS or Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for auth
- bcrypt for password hashing

---

## 🧠 Schema

### User Schema
```js
{
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  dob: Date,
  password: String,
  preferences: [String],
  createdArticles: [ObjectId]
}
```

### Article Schema
```js
{
  title: String,
  description: String,
  image: String,
  tags: [String],
  category: String,
  createdBy: ObjectId,
  likes: Number,
  dislikes: Number,
  blocks: Number
}
```

---

## 🚀 Setup Instructions

### 📥 Clone the Repository

```bash
git clone https://github.com/ajaypalamkunnel/ARTICLIO.git
cd ARTICLIO
```

---

### 🔧 Backend Setup

```bash
cd backend
npm install
touch .env
```

#### Sample .env
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🧪 Testing

- API tested via Postman
- Manual browser testing
- Optional: Jest or Mocha for unit tests (not yet implemented)

---

## 🌍 Deployment

- **Frontend:** Vercel / Netlify
- **Backend:** Render / Railway / Heroku
- **Database:** MongoDB Atlas

---

## 📄 License

MIT License - Feel free to use and contribute.

---

## 👨‍💻 Developer

**Ajay PS**

- GitHub: [ajaypalamkunnel](https://github.com/ajaypalamkunnel)
- Email: your.email@example.com

---

## 🙌 Contributions

Pull requests and feedback are welcome!

