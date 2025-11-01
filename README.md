# Koalla

Koalla is a full-stack e-commerce application that empowers users to transform their cherished photos into high-quality custom phone cases.

**Live** : [https://koalla.ucokman.web.id](https://koalla.ucokman.web.id)

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL
- Uploadthing
- Ngrok
- Clerk account
- Stripe account

### 1. Clone & Install

```bash
git clone <repo-url>
cd pinguins
pnpm install
```

### 2. Setup Tunneling for Webhooks

Ngrok allows you to expose your local server to the internet for webhook testing.

1. **Login to ngrok**  
   Visit [https://dashboard.ngrok.com/login](https://dashboard.ngrok.com/login)

2. **Install ngrok**  
   Follow the instructions under **Getting Started → Setup & Installation**

3. **Configure and run ngrok**

   ```bash
   ngrok config add-authtoken <your-auth-token>
   ngrok http --url=<YOUR_FORWARDING_URL> <your-app-running-port>

   # Keep this terminal window open - you'll need the forwarding URL for webhook configuration
   ```

### 3. Setup Clerk Authentication

1. **Login to Clerk**  
   Visit [https://dashboard.clerk.com/sign-in](https://dashboard.clerk.com/sign-in)

2. **Create a new application**  
   Navigate to **Application → Dashboard** and create a new application

3. **Configure sign-in options**  
   Enable **Email** and **Google** as sign-in methods

4. **Get your API keys**  
   Go to **Configure → Developers → API Keys** and copy:
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 4. Setup Uploadthing Storage

1. **Login to Uploadthing**
   Visit [https://uploadthing.com/sign-in](https://uploadthing.com/sign-in)

2. **Create a new application**
   Navigate to **Dashboard** and create a new application

3. **Get your Uploadthing Token**  
   Go to **API Keys** and copy:
   - `UPLOADTHING_TOKEN`

### 5. Get Discord Guild ID

1. Enable **Developer Mode** in Discord  
   Go to **App Settings → Advanced** and toggle on Developer Mode

2. Get your server ID
   - Right-click on your private server icon in the left sidebar
   - Click **Copy Server ID** to get your `DISCORD_GUILD_ID`

### 6. Setup Stripe Payments

1. **Login to Stripe**  
   Visit [https://dashboard.stripe.com/login](https://dashboard.stripe.com/login)

2. **Get your API key**

   - Open the **Workbench Panel** at the bottom of the page
   - Under **Overview**, copy your `STRIPE_SECRET_KEY`

3. **Setup webhooks**
   - Navigate to **Webhooks**
   - Click **Add destination**
   - Select all **checkout events**
   - Set destination to: `<YOUR_FORWARDING_URL>/api/webhooks/stripe`
   - Get your <WEBHOOK_SECRET>

### 7. Configure Environment Variables

```bash
cp .env.example .env
# fill in all the credentials you collected
```

### 8. Setup Database

```bash
pnpm prisma migrate dev
```

### 9. Run Development Server

Start the application:

```bash
pnpm run dev
```

**Your app is now running!** 🎊  
Visit [http://localhost:3000](http://localhost:3000) to see it in action.
