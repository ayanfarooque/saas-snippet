# saas-snippet

Zero to Subscriber — Snippet/Prompt Library SaaS. This project is a full-stack web application featuring a frontend built with React, Vite, and TailwindCSS, and a backend powered by FastAPI, SQLAlchemy, and PostgreSQL (via Neon). It also integrates Razorpay for payment processing.

## Prerequisites

- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.8+](https://www.python.org/) (for the backend)
- [PostgreSQL](https://www.postgresql.org/) (or use the provided Neon DB string)

## Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Alternatively, you can use the provided `environment.yml` with Conda: `conda env create -f environment.yml`)*

4. Configure environment variables. Ensure you have a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="your_database_url_here"
   SECRET_KEY="your_secret_key_here"
   RAZORPAY_KEY_ID="your_razorpay_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   FRONTEND_URL="http://localhost:5173"
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will be running at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

## Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend application will be running at `http://localhost:5173`.

## Features
- User Authentication (Signup/Login)
- Folder & Tag Management for Snippets
- CRUD operations for Snippets/Prompts
- Public Snippet Sharing (via Slug)
- Pro Subscription Integration via Razorpay