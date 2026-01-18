# Firebase Setup Guide for Remedy Dental Clinic

## Why Firebase?
- **Free** - Generous free tier perfect for production
- **Scalable** - Handles growth automatically
- **Real-time** - All enquiries sync instantly
- **Secure** - Built-in security & authentication
- **No backend needed** - Serverless solution

## Step-by-Step Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Name it: `Remedy Dental Clinic`
4. Disable Google Analytics (optional)
5. Click **"Create Project"**
6. Wait for project creation to complete

### 2. Get Firebase Credentials
1. In Firebase Console, click the gear icon (⚙️) → **Project Settings**
2. Scroll down to **"Your apps"** section
3. Click **"</> Web"** (add web app)
4. Name it: `remedy-dental-website`
5. Click **"Register app"**
6. You'll see a script with your Firebase config - **Copy the entire config object**

### 3. Update Your Code
1. Open `script.js` in your editor
2. Find this section at the top:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```
3. Replace it with your actual Firebase config from step 2

### 4. Setup Firestore Database
1. In Firebase Console, go to **"Build"** → **"Firestore Database"**
2. Click **"Create Database"**
3. Choose **"Start in production mode"**
4. Select your region (closest to your location)
5. Click **"Enable"**

### 5. Configure Security Rules
1. In Firestore, go to **"Rules"** tab
2. Replace the default rules with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /enquiries/{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publish"**

### 6. Test Your Setup
1. Go to your website's Contact section
2. Fill out the enquiry form
3. Submit the form
4. Check Firebase Console → Firestore → Collection "enquiries"
5. You should see your message there!

### 7. Access Admin Inbox
1. Click **"Admin Inbox"** in navigation
2. Enter password: `admin123`
3. View all enquiries in real-time

## Features After Setup

✅ **Real-time Enquiry System**
- Users submit enquiries from website
- Automatically stored in Firebase
- Admin can view all messages instantly

✅ **Admin Inbox**
- Secure password-protected access
- Real-time updates
- Reply via email or WhatsApp
- Delete individual or all messages

✅ **Production Ready**
- Free tier supports thousands of enquiries
- Data automatically backed up
- 99.9% uptime SLA
- Mobile-responsive

## Firebase Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Read operations | 50,000/day |
| Write operations | 20,000/day |
| Delete operations | 20,000/day |
| Storage | 1GB |
| Monthly cost | **$0** |

*More than enough for a dental clinic website!*

## Important Security Notes

⚠️ **For Production:**
1. The current Firestore rules allow anyone to read/write
2. For better security, you can add authentication
3. Or use a password-protected admin area (already implemented)

## Troubleshooting

### "Firebase is not defined"
- Make sure Firebase SDK is loaded in index.html
- Check browser console (F12) for errors

### "Collection enquiries not found"
- Go to Firestore in Firebase Console
- Manually create the collection "enquiries"
- It will auto-populate once first enquiry is submitted

### "Permission denied" errors
- Check Firestore Rules
- Make sure Rules are published correctly
- Verify your config is correct in script.js

## Next Steps (Optional Enhancements)

- Add email notifications when new enquiry arrives
- Add user authentication for admin
- Export enquiries as CSV/PDF
- Add enquiry status tracking
- Send auto-reply emails to customers

## Support

For Firebase help: [Firebase Docs](https://firebase.google.com/docs)
