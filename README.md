# Kagal Voter Information System

A modern web application for searching and managing voter information for Kagal Assembly Constituency. Built with React frontend and Node.js backend.

## Features

- 🔍 **Advanced Search** - Search by name, EPIC number, mobile, address, booth, or serial number
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 📄 **PDF Generation** - Download voter information as professional PDF documents
- 📤 **Share Functionality** - Generate and share voter info images to any app
- 🖼️ **Poster Integration** - Display constituency poster on homepage and PDFs
- 🌐 **Multilingual** - Supports English and Marathi text

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- React Icons
- CSS3 with modern features

### Backend
- Node.js with Express
- PostgreSQL database with Knex ORM
- Puppeteer for PDF and image generation
- Node Validator for input validation
- CORS enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kagal-voter-system
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run migrations and seed data
   npm run migrate
   npm run seed
   
   # Start backend server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Start frontend development server
   npm start
   ```

4. **Add Poster Image (Optional)**
   - Place your poster image in `frontend/public/images/`
   - Supported formats: JPG, JPEG, PNG, GIF, WEBP
   - Recommended size: 1200x250 pixels

### Environment Configuration

**Backend (.env)**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=kolhapur_assembly

# Server
PORT=3000
NODE_ENV=development
```

**Frontend (.env)**
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3000/api
PORT=3001
```

## API Endpoints

- `POST /api/search` - Search voters
- `GET /api/download-pdf/:id` - Generate PDF for voter
- `GET /api/share/:id` - Generate share image for voter
- `GET /api/poster` - Check poster availability
- `GET /api/health` - Health check

## Project Structure

```
kagal-voter-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── migrations/      # Database migrations
│   ├── seeds/           # Sample data
│   ├── images/          # Poster images for PDFs
│   └── server.js        # Main server file
├── frontend/
│   ├── public/
│   │   └── images/      # Poster images for homepage
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
