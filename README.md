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

### 1. Firebase Setup

The notes feature requires Firebase to be configured. Follow these steps:

1. **Set up Firestore Security Rules**:
   - Open `FIREBASE_SETUP.md` in this repository
   - Follow the instructions to add security rules to your Firebase Console
   - This ensures users can only access their own notes

2. **Enable Authentication**:
   - Email/Password authentication should already be enabled in your Firebase project
   - Verify in Firebase Console → Authentication → Sign-in method

### 2. Local Development

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
├── index.html              # Main HTML file
├── styles.css              # All styling
├── script.js               # Main JavaScript functionality
├── translations.js         # UI translations
├── content-translations.json # Detailed content translations
├── firebase-config.js      # Firebase initialization
├── FIREBASE_SETUP.md       # Firebase setup instructions
└── README.md              # This file
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

- User authentication required for notes
- Firestore security rules prevent unauthorized access
- Each user can only read/write their own data
- No API keys exposed in client code (Firebase SDK handles this securely)

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
