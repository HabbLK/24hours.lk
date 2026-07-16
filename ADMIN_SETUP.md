# Admin Panel Setup Guide

## Overview
The admin panel is now fully functional with a beautiful login page and protected routes.

## Accessing the Admin Panel

### 1. Admin Login Page
Navigate to: `http://localhost:3000/admin/login`

### 2. Default Credentials
Check your `.env.local` file for the admin credentials:
- **Email**: admin@24hours.lk (or as set in ADMIN_EMAIL)
- **Password**: password123 (or as set in ADMIN_PASSWORD)

## Creating Admin Users

### Using the Seed Script
Run the seed script to create an initial admin user:

```bash
npx tsx scripts/seed.ts
```

### Manual Creation via MongoDB
You can also create admin users directly in MongoDB:

```javascript
// Example admin user document
{
  name: "Admin User",
  email: "admin@24hours.lk",
  password: "$2b$10$hashedpassword", // Use bcrypt to hash the password
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### Hashing Passwords
To hash a password for manual insertion:

```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash('yourpassword', 10);
console.log(hashedPassword);
```

## Admin Panel Features

### Dashboard (`/admin`)
- Overview of all statistics
- Quick access links to main sections
- Welcome message with user info

### Available Sections
1. **Services** - Manage all services
2. **Categories** - Manage service categories
3. **Task Guides** - Create step-by-step guides
4. **Site Settings** - Configure site-wide settings
5. **Admin Users** - Manage admin accounts

## Security Features

### Session Management
- Uses NextAuth.js for secure authentication
- JWT-based session strategy
- Secure cookie storage

### Route Protection
- Admin pages automatically redirect to login if not authenticated
- Session validation on page load
- Secure sign-out functionality

### Environment Variables
Required environment variables in `.env.local`:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Admin Default Credentials (for seeding)
ADMIN_EMAIL=admin@24hours.lk
ADMIN_PASSWORD=password123
```

## Login Page Features

### Design Elements
✅ Beautiful gradient background with animated elements
✅ Brand logo and colors
✅ Secure password input with show/hide toggle
✅ Loading states with spinner
✅ Error messages with clear feedback
✅ Responsive design for all devices
✅ Smooth animations

### User Experience
- Clear error messages for invalid credentials
- Loading indicator during authentication
- Automatic redirect after successful login
- Remember callback URL for proper navigation
- Link back to main site

## Troubleshooting

### "Invalid email or password" Error
1. Check that the admin user exists in MongoDB
2. Verify the email and password match exactly
3. Ensure the password is properly hashed with bcrypt
4. Check MongoDB connection in `.env.local`

### Session Not Persisting
1. Verify `NEXTAUTH_SECRET` is set in `.env.local`
2. Clear browser cookies and try again
3. Check that `NEXTAUTH_URL` matches your current URL

### Login Page Not Loading
1. Ensure the file exists at `src/app/admin/login/page.tsx`
2. Restart the development server
3. Check for any build errors in the console

## Production Deployment

### Security Checklist
- [ ] Change default admin credentials
- [ ] Use a strong, random `NEXTAUTH_SECRET`
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set proper CORS policies
- [ ] Enable rate limiting on auth endpoints
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Environment Variables for Production
```env
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://yourdomain.com
MONGODB_URI=<production-mongodb-uri>
```

## Next Steps

1. **Seed Initial Data**: Run the seed script to populate initial admin users
2. **Test Login**: Try logging in with the default credentials
3. **Add Content**: Start adding services, categories, and guides
4. **Customize Settings**: Configure site settings from the admin panel
5. **Create More Admins**: Add additional admin users as needed

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Check NextAuth.js documentation for advanced configuration

---

**Last Updated**: January 2025
**Version**: 1.0.0
