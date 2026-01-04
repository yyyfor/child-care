# Maternal & Infant Care Guide

A comprehensive bilingual (English/Chinese) web application for parents from late pregnancy through baby's first 6 months.

## Features

- **5 Development Phases**: From pre-delivery through 6 months postpartum
- **Bilingual Support**: Full English and Chinese translations
- **Cloud-Synced Notes**: Personal notes with Firebase authentication and Firestore storage
- **Comprehensive Guidance**:
  - Mother's and Father's responsibilities
  - Safety considerations
  - Required materials and preparations
  - Developmental activities for babies
  - English language development
  - Physical & motor development
  - Brain & cognitive development
- **Responsive Design**: Optimized for mobile and desktop
- **Quick Navigation**: Easy access to all sections

## Getting Started

### 1. Using the Deployed App

The app is deployed and ready to use at:
**https://yyyfor.github.io/child-care/**

Simply visit the link and:
1. Click the **Notes** tab
2. Create an account or sign in
3. Start adding notes!

### 2. Running Locally (For Development)

If you want to run the app locally or fork the project:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yyyfor/child-care.git
   cd child-care
   ```

2. **Open in browser**:
   ```bash
   open index.html
   ```

   Or simply double-click `index.html`

### 3. Setting Up Your Own Firebase Project

If you want to create your own version with your own Firebase project:

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Get your Firebase credentials**:
   - Project Settings → Your apps → Web app
   - Copy the configuration object

3. **Update firebase-config.js**:
   - Replace the configuration in `firebase-config.js` with your credentials
   - Or use `firebase-config.example.js` as a template

4. **Set up Firestore and Authentication**:
   - See `FIREBASE_SETUP.md` for detailed instructions
   - See `DEPLOYMENT.md` for deployment guide

### 4. Firestore Database Setup

The notes feature requires Firestore to be configured:

1. **Create Firestore Database**:
   - Go to Firebase Console → **Firestore Database**
   - Click **Create database**
   - Choose **Start in test mode** → **Next**
   - Select a location → **Enable**

2. **Set up Security Rules**:
   - Open `FIREBASE_SETUP.md` in this repository
   - Follow the instructions to add security rules to your Firebase Console
   - This ensures users can only access their own notes

3. **Enable Authentication**:
   - Go to Firebase Console → **Authentication** → **Sign-in method**
   - Enable **Email/Password** authentication

### 3. Local Development

Simply open `index.html` in a modern web browser. The app works entirely client-side.

For best results, use:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

### 3. Using the App

1. **Navigation**: Click the phase buttons at the top to switch between different time periods
2. **Language**: Toggle between English and Chinese using the language switcher in the header
3. **Notes**:
   - Click the Notes tab (with notepad icon)
   - Create an account or sign in
   - Add, edit, search, and delete personal notes
   - Notes sync across all your devices

## File Structure

```
child-care/
├── index.html                 # Main HTML file
├── styles.css                 # All styling
├── script.js                  # Main JavaScript functionality
├── translations.js            # UI translations
├── content-translations.json  # Detailed content translations
├── firebase-config.js         # Firebase configuration (included for deployment)
├── firebase-config.example.js # Firebase config template (for creating your own)
├── .gitignore                 # Git ignore file
├── FIREBASE_SETUP.md          # Firebase setup instructions
├── DEPLOYMENT.md              # Deployment guide
└── README.md                  # This file
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Firebase**:
  - Authentication (Email/Password)
  - Firestore Database (Cloud storage)
- **ES6 Modules** - Modular JavaScript architecture

## Features in Detail

### Authentication System
- Email/Password registration and login
- Secure session management
- User-specific data isolation
- Sign out functionality

### Notes Management
- **CRUD Operations**: Create, Read, Update, Delete
- **Categories**: General, Health, Feeding, Sleep, Development, Milestone
- **Real-time Search**: Filter notes by title, content, or category
- **Cloud Sync**: Notes stored in Firestore for access from any device
- **Timestamps**: Automatic date tracking

### Bilingual Support
- Complete English/Chinese translation
- Persistent language preference (localStorage)
- Translates all UI elements and content
- Real-time language switching

### Responsive Design
- Mobile-optimized navigation
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized for iPhone and Android devices

## Security

### Firebase Configuration Security Model

**Important**: `firebase-config.js` **IS** included in this public repository. This is safe because:

1. **Firebase API keys are not secret keys** - they're designed for client-side apps
2. **They only identify your Firebase project**, they don't authenticate it
3. **Real security comes from**:
   - ✅ Firestore Security Rules (users can only access their own data)
   - ✅ Firebase Authentication (must be logged in)
   - ✅ Authorized Domains (only approved domains can use the project)

**Google's official documentation states**: "Unlike how API keys are typically used, API keys for Firebase services are not used to control access to backend resources... They are just used to identify your Firebase project."

### Application Security
- User authentication required for notes (Email/Password)
- Firestore security rules prevent unauthorized access
- Each user can only read/write their own data
- Server-side validation ensures data integrity

### Firebase API Keys
**Note**: Firebase API keys in client-side code are not secret keys. They identify your Firebase project to Google servers. Real security comes from:
1. **Firestore Security Rules** (user can only access their own data)
2. **Firebase Authentication** (users must be logged in)
3. **Authorized Domains** (restrict your app to specific domains)

### Additional Security Measures
To further secure your Firebase project:
1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" → "Public-facing name"
3. Under your web app, configure **Authorized domains**
4. Add only your production domain (e.g., `yyyfor.github.io`)
5. Remove `localhost` in production if desired

## Browser Compatibility

- Modern browsers with ES6 module support required
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+

## Development Notes

### Adding New Content

1. **English Content**: Edit `index.html` directly
2. **Chinese Translations**:
   - UI translations: Edit `translations.js`
   - Detailed content: Edit `content-translations.json`

### Customizing Styles

All styles are in `styles.css`. Key CSS custom properties:
- `--color-primary`: Main theme color
- `--color-secondary`: Secondary theme color
- `--spacing-*`: Consistent spacing scale
- `--font-display`: Display/heading font
- `--font-body`: Body text font

## Future Enhancements

Potential additions:
- Photo uploads for milestone tracking
- Pediatrician appointment scheduling
- Growth chart tracking
- Vaccination reminders
- Baby feeding/sleep logs
- Export notes to PDF
- Share notes with partner

## Support

For issues or questions:
1. Check browser console for errors
2. Review `FIREBASE_SETUP.md` for setup issues
3. Ensure internet connection for Firebase features

## License

This is a personal project. All rights reserved.

---

**Note**: This guide provides general information based on professional medical knowledge. Always consult your healthcare provider for advice specific to your situation. In case of emergency, call 911 or your local emergency services.
