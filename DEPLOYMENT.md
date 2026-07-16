# 24hours.lk - Deployment Guide

## Pre-Deployment Checklist

### Environment Variables
Ensure the following environment variables are set in your hosting platform:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration (if using authentication)
NEXTAUTH_URL=https://24hours.lk
NEXTAUTH_SECRET=your_secret_key

# Other configurations
NODE_ENV=production
```

### Build and Test Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test the production build
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)
Vercel is the easiest option for Next.js apps:

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

```bash
# Or use Vercel CLI
npm install -g vercel
vercel --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

### Option 3: Self-Hosted (VPS/Docker)

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "24hours-lk" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Using Docker
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t 24hours-lk .
docker run -p 3000:3000 24hours-lk
```

## Post-Deployment

### 1. DNS Configuration
Point your domain to the hosting provider:

```
A Record: @ -> Your server IP
CNAME: www -> 24hours.lk
```

### 2. SSL Certificate
- **Vercel/Netlify**: Automatic SSL
- **Self-hosted**: Use Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d 24hours.lk -d www.24hours.lk
```

### 3. Set Up Monitoring
- Add Google Analytics
- Set up error tracking (Sentry)
- Configure uptime monitoring

### 4. Performance Optimization
- Enable CDN
- Configure caching headers
- Optimize images
- Enable gzip compression

## Database Setup

### MongoDB Atlas (Recommended)
1. Create a cluster at mongodb.com/cloud/atlas
2. Whitelist your server IP
3. Create a database user
4. Get connection string
5. Add to environment variables

### Self-Hosted MongoDB
```bash
# Install MongoDB
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Enable on boot
sudo systemctl enable mongodb
```

## Backup Strategy

### Database Backups
```bash
# Backup MongoDB
mongodump --uri="your_connection_string" --out=/backups/$(date +%Y%m%d)

# Automate with cron
0 2 * * * /usr/bin/mongodump --uri="..." --out=/backups/$(date +\%Y\%m\%d)
```

### Code Backups
- Use GitHub for version control
- Tag releases for easy rollback
- Keep environment variables secure

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx/HAProxy)
- Deploy multiple instances
- Use Redis for session storage

### Database Scaling
- Enable MongoDB replica sets
- Use read replicas
- Implement caching (Redis)

### CDN Integration
- CloudFlare
- AWS CloudFront
- Vercel Edge Network

## Monitoring & Maintenance

### Health Checks
Create an API endpoint for health checks:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
```

### Log Management
```bash
# View PM2 logs
pm2 logs

# Clear logs
pm2 flush
```

### Regular Maintenance
- Weekly security updates
- Monthly dependency updates
- Quarterly performance audits
- Database optimization

## Rollback Plan

### Quick Rollback
```bash
# Using PM2
pm2 stop 24hours-lk
# Deploy previous version
pm2 start 24hours-lk
```

### Using Git
```bash
# Revert to previous commit
git revert HEAD
git push

# Redeploy
```

## Security Checklist

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ Database credentials encrypted
- ✅ Rate limiting configured
- ✅ CORS properly configured
- ✅ Security headers set
- ✅ Regular security audits
- ✅ Dependency vulnerability scanning

## Support & Troubleshooting

### Common Issues

**Build Fails**
- Check Node.js version (>=18)
- Clear node_modules and reinstall
- Check for TypeScript errors

**Database Connection Issues**
- Verify MongoDB URI
- Check IP whitelist
- Ensure network connectivity

**Performance Issues**
- Enable caching
- Optimize images
- Use CDN
- Check database queries

### Getting Help
- GitHub Issues: [Your repo URL]
- Email: support@24hours.lk
- Documentation: [Your docs URL]

## Update Procedure

1. Test changes locally
2. Push to staging branch
3. Test on staging environment
4. Create pull request
5. Review and merge
6. Deploy to production
7. Monitor for issues
8. Rollback if needed

---

**Last Updated**: January 2025
**Maintained by**: HABB PVT LTD
