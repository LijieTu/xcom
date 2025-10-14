# Deployment Checklist

Use this checklist to track your deployment progress.

## ✅ Development (Completed)

- [x] React project setup with Vite
- [x] Firebase integration
- [x] Authentication system
- [x] Post CRUD operations
- [x] UI components
- [x] Routing
- [x] Real-time updates
- [x] Security rules
- [x] Build testing
- [x] Documentation

## 🔥 Firebase Setup

- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project" and create new project
- [ ] Go to Authentication → Get Started
- [ ] Enable "Email/Password" provider
- [ ] Go to Firestore Database → Create Database
- [ ] Choose production mode and select region
- [ ] Go to Rules tab, paste content from `firestore.rules`
- [ ] Click Publish
- [ ] Go to Project Settings (gear icon)
- [ ] Scroll to "Your apps" → Click web icon (</>)
- [ ] Register app with nickname "xcom-web"
- [ ] Copy Firebase configuration values
- [ ] Create `.env` file (copy from `env.example`)
- [ ] Paste Firebase config values into `.env`

## 💻 Local Testing

- [ ] Run `npm install` (if not done)
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Click "Register" and create test account
- [ ] Verify you can login
- [ ] Create a test post
- [ ] Edit the post
- [ ] Delete the post
- [ ] Open in incognito window and verify you can view posts
- [ ] Verify non-logged-in users cannot create posts
- [ ] Close dev server (Ctrl+C)

## 🖥️ VPS Server Setup

### Choose and Setup VPS

- [ ] Sign up for VPS provider:
  - Option 1: DigitalOcean ($5/month)
  - Option 2: Linode ($5/month)
  - Option 3: AWS EC2 (free tier)
  - Option 4: Vultr ($5/month)
- [ ] Create Ubuntu 22.04 LTS server
- [ ] Note your VPS IP address: ________________

### Configure Server

- [ ] SSH into server: `ssh root@YOUR_VPS_IP`
- [ ] Update system: `apt update && apt upgrade -y`
- [ ] Install Nginx: `apt install nginx -y`
- [ ] Start Nginx: `systemctl start nginx`
- [ ] Enable Nginx: `systemctl enable nginx`
- [ ] Configure firewall:
  ```bash
  ufw allow OpenSSH
  ufw allow 'Nginx Full'
  ufw enable
  ```
- [ ] Create directory: `mkdir -p /var/www/xcom`
- [ ] Set permissions: `chown -R $USER:$USER /var/www/xcom`
- [ ] Copy nginx.conf content to `/etc/nginx/sites-available/xcom`
- [ ] Update domain in nginx config (replace `yourdomain.com`)
- [ ] Create symlink: `ln -s /etc/nginx/sites-available/xcom /etc/nginx/sites-enabled/`
- [ ] Test config: `nginx -t`
- [ ] Reload Nginx: `systemctl reload nginx`

### Setup SSH Key for GitHub Actions

- [ ] Generate SSH key: `ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions -N ""`
- [ ] Add to authorized keys: `cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys`
- [ ] Copy private key: `cat ~/.ssh/github-actions`
- [ ] Save private key somewhere safe (you'll need it for GitHub)

## 📦 GitHub Repository Setup

- [ ] Create new repository on GitHub
- [ ] Repository name: ________________
- [ ] Make it Public or Private (your choice)
- [ ] Do NOT initialize with README
- [ ] Copy repository URL
- [ ] In your local project:
  ```bash
  git add .
  git commit -m "Initial commit: X.com social network"
  git remote add origin YOUR_REPO_URL
  git branch -M main
  git push -u origin main
  ```

## 🔐 GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add each of these secrets:

- [ ] `VPS_HOST` = Your VPS IP address
- [ ] `VPS_USERNAME` = Your VPS username (usually `root`)
- [ ] `VPS_SSH_KEY` = Private SSH key from earlier
- [ ] `VITE_FIREBASE_API_KEY` = From your .env file
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` = From your .env file
- [ ] `VITE_FIREBASE_PROJECT_ID` = From your .env file
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` = From your .env file
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` = From your .env file
- [ ] `VITE_FIREBASE_APP_ID` = From your .env file

## ☁️ Cloudflare Setup

### Add Domain

- [ ] Sign up/login to Cloudflare: https://www.cloudflare.com/
- [ ] Click "Add a Site"
- [ ] Enter your domain name
- [ ] Choose Free plan
- [ ] Cloudflare will scan DNS records
- [ ] Note the nameservers shown

### Update Nameservers

- [ ] Go to your domain registrar (GoDaddy, Namecheap, etc.)
- [ ] Find DNS/Nameserver settings
- [ ] Replace with Cloudflare nameservers
- [ ] Save changes
- [ ] Wait for DNS propagation (can take 24 hours, usually faster)

### Configure DNS

- [ ] In Cloudflare → DNS → Records
- [ ] Add A record:
  - Type: `A`
  - Name: `@`
  - IPv4 address: Your VPS IP
  - Proxy status: Proxied (orange cloud)
  - TTL: Auto
- [ ] Click Save

### Configure SSL/TLS

- [ ] Go to SSL/TLS → Overview
- [ ] Set encryption mode to "Full"
- [ ] Go to SSL/TLS → Edge Certificates
- [ ] Enable "Always Use HTTPS"
- [ ] Enable "Automatic HTTPS Rewrites"
- [ ] Set Minimum TLS Version to 1.2

### Optimize (Optional)

- [ ] Go to Speed → Optimization
- [ ] Enable Auto Minify (JS, CSS, HTML)
- [ ] Enable Brotli
- [ ] Go to Caching → Configuration
- [ ] Set Browser Cache TTL to "Respect Existing Headers"

## 🚀 Deploy!

- [ ] Go to GitHub repo → Actions tab
- [ ] Make a small change (e.g., edit README)
- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "Trigger deployment"
  git push origin main
  ```
- [ ] Watch the deployment in Actions tab
- [ ] Wait for green checkmark ✅

## 🧪 Test Production

- [ ] Visit your domain (https://yourdomain.com)
- [ ] Verify HTTPS is working (lock icon)
- [ ] Test registration
- [ ] Test login
- [ ] Create a post
- [ ] Open in another browser/incognito
- [ ] Verify real-time updates
- [ ] Test edit and delete
- [ ] Test on mobile device

## 📋 Submission Materials

- [ ] GitHub Repository URL: ___________________________
- [ ] Live Website URL: ___________________________
- [ ] Test the following:
  - [ ] Website loads over HTTPS
  - [ ] Registration works
  - [ ] Login works
  - [ ] Creating posts works
  - [ ] Editing posts works
  - [ ] Deleting posts works
  - [ ] Real-time updates work
  - [ ] Non-logged users can view posts
  - [ ] Non-logged users cannot create/edit/delete

## 🎉 Success!

- [ ] All tests pass
- [ ] Documentation complete
- [ ] Deployment successful
- [ ] Website live and accessible

---

**Congratulations! Your X.com clone is live! 🚀**

### Submission Checklist

When submitting your project, provide:

1. ✅ GitHub project URL
2. ✅ Deployed website URL (with Cloudflare domain)
3. ✅ Brief description of features
4. ✅ Any special notes or considerations

Example submission:
```
GitHub: https://github.com/username/xcom-social
Website: https://myxcom.com
Features: User auth, post CRUD, real-time updates, responsive design
Notes: Deployed on DigitalOcean VPS with Cloudflare CDN
```

