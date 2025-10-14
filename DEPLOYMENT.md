# Deployment Guide

This guide walks you through deploying the X.com social network application.

## Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [VPS Server Setup](#vps-server-setup)
3. [GitHub Repository Setup](#github-repository-setup)
4. [Cloudflare Configuration](#cloudflare-configuration)
5. [Testing](#testing)

## Firebase Setup

### Step 1: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `xcom-social` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In your Firebase project, click **"Authentication"** in the left menu
2. Click **"Get started"**
3. Click on **"Email/Password"** provider
4. Enable **"Email/Password"**
5. Click **"Save"**

### Step 3: Create Firestore Database

1. Click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose your preferred location (closest to your users)
5. Click **"Enable"**

### Step 4: Configure Security Rules

1. In Firestore Database, click the **"Rules"** tab
2. Replace the default rules with the content from `firestore.rules` file
3. Click **"Publish"**

### Step 5: Get Firebase Configuration

1. Click the **gear icon** (Project Settings)
2. Scroll down to **"Your apps"**
3. Click the **web icon** (</>)
4. Register app with nickname: `xcom-web`
5. Copy the `firebaseConfig` object values
6. Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=xcom-social.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xcom-social
VITE_FIREBASE_STORAGE_BUCKET=xcom-social.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## VPS Server Setup

### Step 1: Choose a VPS Provider

Popular options:
- **DigitalOcean** - $5/month droplet
- **Linode** - $5/month Nanode
- **AWS EC2** - t2.micro (free tier eligible)
- **Vultr** - $5/month instance

Create an Ubuntu 22.04 LTS server with at least:
- 1 GB RAM
- 1 CPU
- 25 GB SSD

### Step 2: Initial Server Setup

SSH into your server:
```bash
ssh root@YOUR_VPS_IP
```

Update the system:
```bash
apt update && apt upgrade -y
```

### Step 3: Install Nginx

```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### Step 4: Configure Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### Step 5: Create Deployment Directory

```bash
mkdir -p /var/www/xcom
chown -R $USER:$USER /var/www/xcom
chmod -R 755 /var/www/xcom
```

### Step 6: Configure Nginx

Create Nginx configuration:
```bash
nano /etc/nginx/sites-available/xcom
```

Paste the content from `nginx.conf` (update `yourdomain.com` with your actual domain)

Enable the site:
```bash
ln -s /etc/nginx/sites-available/xcom /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 7: Generate SSH Key for GitHub Actions

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions -N ""
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github-actions
```

Copy the private key output (you'll need it for GitHub Secrets).

## GitHub Repository Setup

### Step 1: Initialize Git Repository

```bash
cd /Users/lijietu/python/cursor/projects/Xcom
git init
git add .
git commit -m "Initial commit: X.com social network"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New repository"**
3. Name it: `xcom-social`
4. Make it **Public** or **Private**
5. Don't initialize with README (we already have one)
6. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/xcom-social.git
git branch -M main
git push -u origin main
```

### Step 4: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add each of these:

| Secret Name | Value |
|------------|-------|
| `VPS_HOST` | Your VPS IP address |
| `VPS_USERNAME` | Your VPS username (usually `root`) |
| `VPS_SSH_KEY` | The private key from Step 7 above |
| `VITE_FIREBASE_API_KEY` | From Firebase config |
| `VITE_FIREBASE_AUTH_DOMAIN` | From Firebase config |
| `VITE_FIREBASE_PROJECT_ID` | From Firebase config |
| `VITE_FIREBASE_STORAGE_BUCKET` | From Firebase config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From Firebase config |
| `VITE_FIREBASE_APP_ID` | From Firebase config |

### Step 5: Test Deployment

Make a small change and push:
```bash
echo "# Test deployment" >> README.md
git add .
git commit -m "Test: Trigger GitHub Actions deployment"
git push origin main
```

Go to **Actions** tab in GitHub to watch the deployment progress.

## Cloudflare Configuration

### Step 1: Add Domain to Cloudflare

1. Sign up at [Cloudflare](https://www.cloudflare.com/)
2. Click **"Add a Site"**
3. Enter your domain name
4. Choose the **Free** plan
5. Cloudflare will scan your DNS records

### Step 2: Update Nameservers

1. Cloudflare will show you 2 nameservers
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Update nameservers to the ones Cloudflare provided
4. Wait for DNS propagation (can take up to 24 hours, usually much faster)

### Step 3: Configure DNS

1. In Cloudflare, go to **DNS** → **Records**
2. Add an A record:
   - **Type**: `A`
   - **Name**: `@` (for root domain) or `www`
   - **IPv4 address**: Your VPS IP
   - **Proxy status**: ✅ Proxied (orange cloud icon)
   - **TTL**: Auto

### Step 4: Configure SSL/TLS

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **"Full"**
3. Go to **SSL/TLS** → **Edge Certificates**
4. Enable:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites
   - ✅ Minimum TLS Version: 1.2

### Step 5: (Optional) Origin Certificate

For Full (strict) SSL mode:

1. Go to **SSL/TLS** → **Origin Server**
2. Click **"Create Certificate"**
3. Leave defaults, click **"Create"**
4. Copy both the **Origin Certificate** and **Private Key**

On your VPS:
```bash
nano /etc/ssl/cloudflare-origin.pem
# Paste the Origin Certificate

nano /etc/ssl/cloudflare-origin-key.pem
# Paste the Private Key

chmod 600 /etc/ssl/cloudflare-origin-key.pem
```

Update Nginx config to uncomment the HTTPS server block and use these certificates.

### Step 6: Optimize Performance

1. **Speed** → **Optimization**
   - Enable Auto Minify (JavaScript, CSS, HTML)
   - Enable Brotli

2. **Caching** → **Configuration**
   - Set Browser Cache TTL to "Respect Existing Headers"

## Testing

### Test Locally First

```bash
npm install
npm run dev
```

Visit http://localhost:5173 and test:
- ✅ Register a new user
- ✅ Login
- ✅ Create a post
- ✅ Edit your post
- ✅ Delete your post
- ✅ Logout

### Test Production Deployment

1. Visit your domain (e.g., https://yourdomain.com)
2. Repeat all the tests above
3. Check that real-time updates work (open in 2 browsers)
4. Verify HTTPS is working (lock icon in browser)

### Verify GitHub Actions

1. Go to **Actions** tab in your GitHub repository
2. Check that the latest workflow run succeeded
3. Review the deployment logs

## Troubleshooting

### Build fails in GitHub Actions
- Check that all Firebase secrets are correctly set
- Verify `.env` variables match the secret names

### Cannot SSH from GitHub Actions
- Verify `VPS_SSH_KEY` is the complete private key
- Check VPS firewall allows SSH (port 22)
- Ensure the public key is in `~/.ssh/authorized_keys`

### 502 Bad Gateway from Nginx
- Check Nginx config: `nginx -t`
- Verify files are in `/var/www/xcom`
- Check Nginx error logs: `tail -f /var/log/nginx/error.log`

### Firebase errors on website
- Verify all Firebase environment variables are set correctly
- Check browser console for specific errors
- Ensure Firestore security rules are published

### Domain not resolving
- Wait for DNS propagation (can take 24 hours)
- Check nameservers are correctly set at registrar
- Verify A record in Cloudflare points to correct IP

### HTTPS not working
- Ensure Cloudflare SSL/TLS is set to "Full"
- Check that proxy is enabled (orange cloud)
- Wait a few minutes for certificate provisioning

## Next Steps

1. ✅ Test all functionality thoroughly
2. 📝 Customize the design to your liking
3. 🚀 Add more features (likes, comments, user profiles)
4. 📊 Set up Firebase Analytics
5. 🔔 Add push notifications
6. 🎨 Add image upload support

Congratulations! Your X.com clone is now live! 🎉

