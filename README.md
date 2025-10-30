# AgriConnect - Agricultural Platform

> Connecting African Agriculture through Modern Technology

## African Context

AgriConnect addresses the critical need for digital transformation in African agriculture. With over 60% of Africa's population engaged in agriculture, there's a massive opportunity to improve productivity, market access, and sustainability through technology. This platform empowers farmers with tools for better crop management, weather forecasting, market connections, and community support.

## Team Members

- [Name] - Authentication & User Management - [Student ID]
- [Name] - [Role] - [Student ID]
- [Name] - [Role] - [Student ID]

## Project Overview

AgriConnect is a comprehensive agricultural platform designed specifically for African farmers. The application provides a digital ecosystem where farmers can access weather information, market prices, farming techniques, and connect with agricultural experts and fellow farmers. The platform focuses on sustainability, community building, and economic empowerment.

### Target Users
- Small to medium-scale farmers across Africa
- Agricultural cooperatives and organizations
- Agricultural extension workers and consultants
- Agricultural product buyers and suppliers

### Core Features
- **User Authentication**: Secure login and registration system with validation
- **Farm Management**: Track crops, livestock, and farm activities
- **Weather Integration**: Real-time weather forecasts and alerts
- **Marketplace**: Buy and sell agricultural products
- **Community Forum**: Connect with other farmers and experts
- **Educational Resources**: Access to farming best practices and techniques

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Authentication**: Custom JavaScript authentication system
- **Storage**: Local Storage for user data and sessions
- **Styling**: Modern CSS with agricultural theme
- **Icons**: Font Awesome
- **Responsive Design**: Mobile-first approach

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd Group8-devops
```

2. Open the project in your browser
```bash
# Option 1: Open index.html directly in your browser
# Option 2: Use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

### Usage

#### For New Users:
1. Click "Sign Up" button
2. Fill in the registration form with your details
3. Select your farm type and location
4. Create a strong password
5. Agree to terms and conditions
6. Click "Create Account"

#### For Existing Users:
1. Click "Login" button
2. Enter your email and password
3. Click "Sign In"

#### Sample Accounts (for testing):
- Email: `john@example.com`, Password: `Password123!`
- Email: `jane@example.com`, Password: `Password123!`

### Features Implemented

#### Authentication System:
- ✅ User registration with comprehensive validation
- ✅ Secure login system
- ✅ Password strength indicator
- ✅ Form validation with real-time feedback
- ✅ Session management with local storage
- ✅ Responsive design for mobile and desktop
- ✅ Modern UI with agricultural theme

#### Security Features:
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Strong password requirements
- ✅ Password confirmation matching
- ✅ Terms and conditions agreement
- ✅ Input sanitization

#### User Experience:
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive design
- ✅ Loading states for form submissions
- ✅ Success/error notifications
- ✅ Password visibility toggle
- ✅ Modal-based forms

## Project Structure
```
Group8-devops/
├── index.html          # Main HTML file with forms and UI
├── styles.css          # CSS styling with agricultural theme
├── auth.js            # JavaScript authentication system
└── README.md          # Project documentation
```

## Technical Implementation

### Authentication Flow:
1. **Registration**: Validates all fields, checks for existing users, creates new account
2. **Login**: Authenticates credentials, manages user session
3. **Session Management**: Uses localStorage for persistent login
4. **Validation**: Real-time form validation with error messages
5. **Security**: Password strength checking and input sanitization

### Key JavaScript Classes:
- `AuthSystem`: Main authentication class handling all auth operations
- Form validation methods for email, phone, password strength
- Local storage management for user data and sessions
- UI state management for login/logout states

## Future Enhancements

- [ ] Password hashing for enhanced security
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Social media login integration
- [ ] Multi-language support for African languages
- [ ] Offline functionality for rural areas

## Links

- [Project Board](link-to-github-projects)
- [Live Demo](http://localhost:8000)

## License

MIT License - Feel free to use this project for educational purposes