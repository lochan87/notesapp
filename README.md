# 📝 Notes Web App

A modern, full-featured notes application built with React and Node.js. Organize your thoughts with folders, add images to your notes, and keep everything searchable and accessible.

![Notes App Preview](https://via.placeholder.com/800x400/007bff/ffffff?text=Notes+Web+App)

## ✨ Features

### 🔐 Authentication
- **Secure Login**: Password-protected access to your notes
- **Session Management**: JWT-based authentication with auto-logout
- **Password Protection**: Special password requirement for enhanced security

### 📁 Folder Organization
- **Create Folders**: Organize notes into custom folders
- **Color Coding**: Assign colors to folders for visual organization
- **Folder Management**: Edit, delete, and manage folder properties
- **Notes Count**: See how many notes are in each folder

### 📋 Rich Note Taking
- **Rich Text Content**: Create detailed notes with formatted text
- **Image Support**: Upload and attach up to 5 images per note
- **Tagging System**: Add tags for easy categorization and search
- **Pin Important Notes**: Pin frequently accessed notes to the top
- **Auto-save**: Automatic saving of changes (when implemented)

### 🔍 Search & Filter
- **Global Search**: Search across all notes and folders
- **Tag Filtering**: Filter notes by tags
- **Sort Options**: Sort by date created, modified, or title
- **Advanced Filters**: Multiple sorting and filtering options

### 📱 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Bootstrap 5**: Clean, modern interface with consistent styling
- **Dark Mode Ready**: CSS variables for easy theme switching
- **Intuitive Navigation**: Breadcrumb navigation and clear user flows
- **Loading States**: Smooth loading animations and feedback

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Bootstrap 5** for styling
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Development Tools
- **TypeScript** for type safety
- **Nodemon** for development server
- **ESLint** for code quality
- **Prettier** for code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/notes-web-app.git
   cd notes-web-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/noteapp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   SPECIAL_PASSWORD=notesapp2024
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system

6. **Start the development servers**
   
   Backend (from the backend directory):
   ```bash
   npm run dev
   ```
   
   Frontend (from the frontend directory):
   ```bash
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Default password: `notesapp2024`

## 📖 Usage Guide

### Getting Started
1. Open the app in your browser at `http://localhost:3000`
2. Enter the special password (default: `notesapp2024`)
3. Create your first folder to organize your notes
4. Start adding notes with rich content and images

### Creating Folders
1. Click "Create Folder" on the dashboard
2. Enter a name and optional description
3. Choose a color for visual organization
4. Click "Create Folder" to save

### Adding Notes
1. Navigate to a folder
2. Click "Create Note"
3. Add a title and content
4. Upload images (up to 5 per note)
5. Add tags separated by commas
6. Optionally pin the note for quick access

### Managing Notes
- **Edit**: Click on a note to view and edit
- **Search**: Use the search bar to find specific notes
- **Filter**: Sort by date, title, or modification time
- **Pin/Unpin**: Use the pin button to prioritize notes
- **Delete**: Remove notes you no longer need

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/noteapp` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `SPECIAL_PASSWORD` | Login password | `notesapp2024` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### File Upload Limits
- Maximum file size: 5MB per image
- Maximum files per note: 5 images
- Supported formats: JPG, PNG, GIF, WebP

## 📁 Project Structure

```
noteapp/
├── backend/                 # Node.js/Express backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # Uploaded images storage
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API service layer
│   │   ├── App.tsx         # Main App component
│   │   └── index.tsx       # Entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── .github/                # GitHub-specific files
│   └── copilot-instructions.md
└── README.md               # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **File Upload Validation**: Strict file type and size validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Sanitization**: Protection against malicious input
- **Environment Variables**: Sensitive data stored securely

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop**: Full-featured experience with all functionality
- **Tablet**: Optimized touch interface with gesture support
- **Mobile**: Compact design with essential features accessible

## 🚀 Deployment

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set up production environment**
   - Update environment variables for production
   - Configure MongoDB connection for production
   - Set up file storage (local or cloud)

3. **Deploy backend**
   - Deploy to your preferred hosting service (Heroku, DigitalOcean, AWS, etc.)
   - Ensure MongoDB is accessible from production environment

4. **Deploy frontend**
   - Serve the built files from the `build` directory
   - Configure web server (Nginx, Apache) if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bootstrap team for the excellent UI framework
- React team for the powerful frontend library
- MongoDB team for the flexible database solution
- All open-source contributors who made this project possible

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/notes-web-app/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Made with ❤️ by the Notes App Team**
