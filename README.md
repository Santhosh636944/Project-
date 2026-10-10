# NutriVision AI – Food Nutrition & Calorie Analyzer

> **“See your food. Understand your nutrition.”**

NutriVision AI is a modern full-stack web application powered by Google Gemini Vision AI (`gemini-3.8-flash`) that allows users to upload or capture photos of meals. The system automatically segments multiple food components on a plate, estimates portions and volumetric serving weights, cross-references clinical nutritional databases, and calculates precise macronutrient values (Calories, Protein, Carbohydrates, Fat, Dietary Fiber, and Sugars).

---

## 🌟 Key Features

1. **AI Food Recognition**: Powered by Google Gemini 3.8 Flash Vision model via server-side `@google/genai` TypeScript SDK.
2. **Multiple Food Component Detection**: Detects diverse complex plates (e.g. *Rice + Grilled Chicken Breast + Boiled Egg + Garden Greens*), computing individual nutritional values and aggregate totals.
3. **Portion & Volume Estimation**: Estimates serving weights in grams, pieces, slices, cups, and bowls. Highlights uncertain portions and provides instant recalculation.
4. **Manual Correction & Recalculation**: Users can edit detected food names, adjust portions, and watch macronutrients update dynamically based on the nutritional database.
5. **Interactive Nutrition Dashboard**: Real-time tracking against daily caloric targets, macronutrient ratio donut charts, and recent scans.
6. **Detailed Analytics**: Recharts visualizations for daily caloric intake, weekly macronutrient trends, and top consumed foods.
7. **Comprehensive Food Reference Database**: 25+ calibrated food items (Indian, Asian, Continental, Mediterranean, and Western cuisines) searchable by category.
8. **Admin Control Console**: User management (view, disable/enable, delete), food database CRUD, and platform-wide statistics.
9. **Dual Mode (Live AI & Demo Mode)**: Seamless Demo Mode toggle with calibrated real-world food profiles, guaranteeing demo reliability under all network or API constraints.
10. **Medical & Nutrition Disclaimer**: Prominently presented across the landing page, analyzer, and footer.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide React icons
- **Backend**: Node.js, Express.js, TypeScript (`tsx`)
- **Database & Storage**: MongoDB / Mongoose compatible with atomic persistent JSON database fallback (`data/nutrivision_db.json`), pre-seeded with admin and demo profiles.
- **AI Computer Vision**: `@google/genai` with `gemini-3.8-flash`
- **Authentication**: JWT token authentication with bcrypt password hashing

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create `.env` based on `.env.example`:

```bash
cp .env.example .env
```

Key environment variables:
- `GEMINI_API_KEY`: Google Gemini API key (auto-injected in Google AI Studio)
- `PORT`: Server port (default `3000`)
- `JWT_SECRET`: Secret key used for signing JWT authentication tokens
- `MONGODB_URI`: Optional MongoDB connection string

### 3. Running the Application

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🔑 Demo Credentials

- **Regular User**:
  - Email: `demo@nutrivision.ai`
  - Password: `demo123`
- **Administrator**:
  - Email: `admin@nutrivision.ai`
  - Password: `admin123`

---

## 📋 API Reference

### Authentication
- `POST /api/auth/register` — Create a new user account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Verify authenticated session

### Food Analysis
- `POST /api/analyze` — Upload food image & perform AI vision analysis
- `GET /api/analyze/:id` — Retrieve analysis results
- `PUT /api/analyze/:id` — Update manual corrections & recalculate nutrition
- `DELETE /api/analyze/:id` — Remove an analysis

### History & Analytics
- `GET /api/history` — Query past analyses with pagination and filters
- `GET /api/analytics` — Caloric trends, macro ratio, and most frequent foods

### Reference Database & Admin
- `GET /api/foods` — Searchable nutrition database
- `GET /api/admin/users` — Administrator user management
- `POST /api/admin/foods` — Add new food reference item
- `GET /api/admin/stats` — Platform metrics & top dishes

---

## ⚠️ Important Disclaimer

Nutrition values shown by NutriVision AI are estimates for informational purposes only. Actual nutritional values may vary based on ingredients, preparation methods, recipes, and portion sizes. NutriVision AI does not provide medical diagnoses or medical treatment recommendations.
