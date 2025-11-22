# How to Find Facebook Login Settings

## Step-by-Step Guide

### Step 1: Go Back to Your App Dashboard
1. Click on "My Apps" in the top right corner of the page
2. Select "Together with AI" from the dropdown

### Step 2: Navigate to Facebook Login
Once you're in your app dashboard, look for one of these:

**Option A: Products Section (Most Common)**
- In the left sidebar, look for a section called **"Products"**
- Click on **"Facebook Login"** (it might show as a product you can add)
- If it's not there, click **"+ Add Product"** and select "Facebook Login"

**Option B: Left Sidebar Direct Link**
- Scroll down the left sidebar
- Look for **"Facebook Login"** as a direct menu item
- Click on it

**Option C: Settings → Basic → Add Product**
- Go to **Settings → Basic** (where you were before)
- Look for a section about adding products
- Add "Facebook Login" as a product

### Step 3: Configure OAuth Redirect URIs
Once you're in Facebook Login settings:
1. Click on the **"Settings"** tab
2. Find the section **"Valid OAuth Redirect URIs"**
3. Add these URIs:
   - `https://sample-firebase-ai-app-51a56.firebaseapp.com/_/auth/handler`
   - `http://localhost:3000/_/auth/handler`
4. Click **"Save Changes"**

## Alternative: Quick Navigation
1. Go to: `developers.facebook.com/apps/1381514090145197/`
2. This should take you directly to your app dashboard
3. Then look for "Products" or "Facebook Login" in the left sidebar

## If You Still Can't Find It
Facebook Login might need to be added as a product first:
1. In your app dashboard, look for **"+ Add Product"** button
2. Click it and select **"Facebook Login"**
3. Then configure the settings

