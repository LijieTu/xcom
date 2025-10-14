# X.com - Simplified Social Network

A simplified social networking website built with React, Firebase, and deployed with GitHub Actions.

## Features

- 🔐 User authentication (Register/Login/Logout)
- 📝 Create, edit, and delete posts
- 👀 View all posts in real-time
- 🎨 Modern UI with Tailwind CSS
- 🚀 Automatic deployment via GitHub Actions

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Deployment**: GitHub Actions → Nginx on VPS
- **Domain/HTTPS**: Cloudflare

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Xcom
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode**
4. Choose a location

### 4. Set Security Rules

In Firestore, go to **Rules** tab and add:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      // Anyone can read
      allow read: if true;
      
      // Only authenticated users can create
      allow create: if request.auth != null;
      
      // Only post author can update or delete
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.authorId;
    }
  }
}
```

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (</>)
4. Copy the configuration values to your `.env` file

## Deployment

### Prerequisites

- Ubuntu VPS (DigitalOcean, Linode, AWS EC2, etc.)
- Domain configured with Cloudflare
- GitHub repository

### VPS Setup

1. **SSH into your VPS:**
```bash
ssh root@your_vps_ip
```

2. **Update system and install Nginx:**
```bash
apt update && apt upgrade -y
apt install nginx -y
```

3. **Create deployment directory:**
```bash
mkdir -p /var/www/xcom
chown -R $USER:$USER /var/www/xcom
```

4. **Configure Nginx:**

Create `/etc/nginx/sites-available/xcom`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/xcom;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

5. **Enable the site:**
```bash
ln -s /etc/nginx/sites-available/xcom /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### GitHub Actions Setup

1. **Generate SSH key on your VPS:**
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa  # Copy this private key
```

2. **Add GitHub Secrets:**

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:
- `VPS_HOST`: Your VPS IP address
- `VPS_USERNAME`: Your VPS username (usually `root` or your user)
- `VPS_SSH_KEY`: The private key from step 1
- `VITE_FIREBASE_API_KEY`: Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Your Firebase app ID

3. **Push to main branch:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

The GitHub Action will automatically build and deploy your app!

### Cloudflare Setup

1. **Add your domain to Cloudflare:**
   - Sign up at [Cloudflare](https://www.cloudflare.com/)
   - Click "Add a Site"
   - Enter your domain name
   - Follow the nameserver setup instructions

2. **Configure DNS:**
   - Go to DNS settings
   - Add an A record:
     - Type: `A`
     - Name: `@` (or your subdomain)
     - IPv4 address: Your VPS IP
     - Proxy status: Proxied (orange cloud)

3. **Enable HTTPS:**
   - Go to SSL/TLS settings
   - Set SSL/TLS encryption mode to "Full" or "Full (strict)"
   - Enable "Always Use HTTPS"
   - Enable "Automatic HTTPS Rewrites"

4. **Optional - Origin Certificate (for Full Strict mode):**
   - Go to SSL/TLS → Origin Server
   - Click "Create Certificate"
   - Download the certificate and private key
   - Install on your VPS in `/etc/ssl/`
   - Update Nginx config to use the certificate

## Project Structure

```
Xcom/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── components/
│   │   ├── CreatePost.tsx      # Post creation form
│   │   ├── EditPost.tsx        # Post editing form
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── PostCard.tsx        # Individual post display
│   │   ├── PostList.tsx        # List of posts
│   │   └── PrivateRoute.tsx    # Protected route wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── pages/
│   │   ├── Home.tsx            # Main page
│   │   ├── Login.tsx           # Login page
│   │   └── Register.tsx        # Registration page
│   ├── services/
│   │   ├── firebase.ts         # Firebase initialization
│   │   └── PostService.ts      # Firestore operations
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Usage

### Register a New Account
1. Click "Register" in the navigation bar
2. Enter your email and password
3. Click "Register"

### Login
1. Click "Login" in the navigation bar
2. Enter your credentials
3. Click "Login"

### Create a Post
1. Make sure you're logged in
2. Fill in the title and content in the "Create New Post" form
3. Click "Post"

### Edit a Post
1. Click "Edit" on your own post
2. Modify the title or content
3. Click "Save"

### Delete a Post
1. Click "Delete" on your own post
2. Confirm the deletion

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

