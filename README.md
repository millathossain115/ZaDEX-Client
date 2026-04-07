<div align="center">
  <!-- Replace this with an actual logo link when you upload it to GitHub -->
  <h2>🚀 ZaDex Delivery Network</h2>
</div>

<p align="center">
  A premium, high-performance logistics and parcel delivery management ecosystem built to streamline nationwide shipping. ZaDex provides specialized tools for end-users, delivery riders, and administrators to orchestrate seamless package fulfillment operations.
</p>

## 🌟 Key Features

### 👤 User Capabilities (Merchants / Senders)
* **Effortless Booking**: Book parcels smoothly with dynamic cost calculation based on parcel packaging type, weight, and delivery distance.
* **Real-time Tracking**: Monitor package status from "Pending" through "Shipped" all the way to "Delivered".
* **Personalized Dashboard**: Review parcel history, view invoice details, securely update un-shipped parcels, and manage payments securely.

### 🚚 Rider Capabilities (Fleet Network)
* **Mobile-Optimized Dashboard**: High-contrast, easy-to-tap interface optimized for on-the-go work with "New Assignments" queues and "Ongoing Tasks" views.
* **Instant Progression**: Quickly change parcel status in real-time (Accept, Reject, Mark as Picked-Up, Mark as Delivered) ensuring system integrity.
* **Income Analytics**: Automated calculation system to view completed deliveries, cumulative earnings, daily metrics, and withdrawal statuses.

### 🛡️ Admin Capabilities (Command Center)
* **Advanced Fleet Dispatching**: Manually assign or **Bulk Dispatch** parcels to active riders utilizing a specialized, real-time search interface.
* **Realtime KPI Statistics**: Visualize holistic ecosystem data (total users, total booked parcels, platform delivery efficiency) automatically.
* **User & Staff Management**: Review applications, securely promote users to delivery riders, and instantly revoke permissions if necessary.
* **Full Data Authority**: View, search, edit, or definitively cancel any global application data through strict role-gated queries.

## 🛠️ Technology Stack

**Frontend**
* ⚛️ **React** (Bootstrapped perfectly with Vite for hyper-fast Hot Module Replacement)
* 🧭 **React Router DOM** for strictly protected, role-checking layouts
* 🎨 **Tailwind CSS** for bespoke, premium luxury styling, gradients, and micro-animations
* 🔐 **Firebase Authentication** seamlessly paired with JWT payload validation

**Backend Architecture (ZaDex Server)**
* 📦 **Node.js** paired with **Express.js** API
* 🍃 **MongoDB** leveraging complex aggregate pipelines for analytical data fetching
* 🛡️ Secured middleware matrix (`verifyToken`, `verifyAdmin`, `verifyRider`) protecting all manipulation paths.

## 🚀 Getting Started

### Prerequisites
* Need `npm` installed via Node.js
* A configured Firebase Project
* A managed MongoDB cluster

### Local Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/zadex-client.git
   cd zadex-client
   ```

2. **Install Client Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   You must establish your backend hook and auth keys. Create a `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Launch Application:**
   ```bash
   npm run dev
   ```
   *The client will launch reliably on `http://localhost:5173/`*

## 🎨 Design Philosophy
ZaDex steps away from basic templates to implement a custom premium design language. Built elegantly around a unified color system—featuring **Deep Teal (`#03373D`)** paired playfully with vibrant **Emerald** accents—the interface focuses intensely on data parsability, dynamic hover triggers, integrated skeleton loaders, and complete mobile-first responsiveness.
