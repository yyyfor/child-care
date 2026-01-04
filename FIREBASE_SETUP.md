# Firebase Setup Instructions

This document contains the security rules and setup instructions for your Firebase project.

## Important: Firebase Configuration File

**Before proceeding**, ensure you have created your `firebase-config.js` file:

1. Copy the example file: `cp firebase-config.example.js firebase-config.js`
2. Add your Firebase credentials from Firebase Console
3. **Never commit `firebase-config.js` to git** - it's already in `.gitignore`

The configuration file contains your Firebase project credentials. While Firebase API keys are designed to be used in client-side code, it's best practice to keep the full configuration file private.

## Firestore Security Rules

Copy and paste these rules into your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **child-care-c5a10**
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // User notes collection
    match /users/{userId}/notes/{noteId} {
      // Users can only read, write, update, and delete their own notes
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Ensure notes have required fields when creating/updating
      allow create: if request.auth != null
        && request.auth.uid == userId
        && request.resource.data.keys().hasAll(['title', 'content', 'category', 'timestamp'])
        && request.resource.data.title is string
        && request.resource.data.content is string
        && request.resource.data.category is string;

      allow update: if request.auth != null
        && request.auth.uid == userId
        && request.resource.data.keys().hasAll(['title', 'content', 'category', 'timestamp'])
        && request.resource.data.title is string
        && request.resource.data.content is string
        && request.resource.data.category is string;
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish** to save the rules

## Authentication Setup

Email/Password authentication is already enabled in your Firebase project. If you need to verify:

1. Go to **Authentication** → **Sign-in method**
2. Ensure **Email/Password** is enabled
3. (Optional) Configure email templates in **Templates** tab

## Testing Your Setup

After deploying the rules:

1. Open your app in a browser
2. Navigate to the Notes tab
3. Create an account using the Sign Up form
4. Add, edit, and delete notes to verify functionality
5. Try signing out and signing back in to verify authentication persistence
6. (Optional) Test on another device to verify cloud sync

## Data Structure

Notes are stored with the following structure:

```
users/{userId}/notes/{noteId}
  - title: string
  - content: string
  - category: string (general|health|feeding|sleep|development|milestone)
  - timestamp: Firestore timestamp
```

## Security Features

- Users can only access their own notes
- All operations require authentication
- Data validation ensures proper field types
- Timestamps are server-generated to prevent tampering

## Troubleshooting

If you encounter issues:

1. Check browser console for error messages
2. Verify Firestore rules are published
3. Ensure Email/Password authentication is enabled
4. Check that your app is using the correct Firebase configuration
5. Try clearing browser cache and signing out/in again

## Next Steps

- Consider setting up email verification for new accounts
- Configure password reset emails in Authentication templates
- Set up Firebase Hosting for production deployment
- Add indexes if you plan to add sorting/filtering features
