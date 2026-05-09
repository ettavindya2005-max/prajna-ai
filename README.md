# MeetAI - SaaS Meeting Summarizer

A professional, multi-user SaaS application built with the PERN/MERN stack (React, Express, Node.js) but specifically using **MySQL** for robust relational data storage.

## 🚀 How to Run Locally

### 1. MySQL Database Setup on Windows

To run this application, you must have MySQL installed and running on your PC.

**Where does MySQL store data on Windows?**
Usually, MySQL stores its underlying data files in `C:\ProgramData\MySQL\MySQL Server 8.0\Data`.

**How to create the database locally:**
1. Open **MySQL Workbench**.
2. Click on your local instance (usually `root` @ `localhost:3306`).
3. Open a new SQL tab.
4. The application actually creates the tables automatically on startup via the `schema.sql` file, but you must create the initial database. Run:
   ```sql
   CREATE DATABASE prajna_ai;
   ```
5. Click the lightning bolt icon ⚡ to execute.

**How to inspect tables:**
1. In the left sidebar of MySQL Workbench, look for `prajna_ai` under "Schemas".
2. Double click `prajna_ai` to make it the active schema.
3. Expand `Tables`. You will see `users`, `meetings`, and `tasks`.
4. Right-click a table and select "Select Rows - Limit 1000" to view the data.

### 2. Setup Backend

Open a terminal in the `backend` folder:
```bash
cd backend
npm install
```

Ensure your `.env` file looks like this:
```env
PORT=5000
JWT_SECRET=super_secret_jwt_key_123
OPENAI_API_KEY=your_openai_api_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=prajna_ai
```

Initialize the database schema and start the server:
```bash
# This applies the schema.sql to your MySQL DB
mysql -u root -p prajna_ai < src/schema.sql

# Start the dev server
npm run dev
```

### 3. Setup Frontend

Open a new terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Do not double click `index.html`.

---

## ☁️ Deployment Steps

1. **Database:** Deploy your MySQL database using a managed service like AWS RDS, PlanetScale, or Render's PostgreSQL (if you migrate the SQL dialect). Update the `DB_HOST`, `DB_USER`, `DB_PASSWORD` variables in your backend hosting provider.
2. **Backend:** Deploy the Express app to Render or Heroku. Make sure to add the `.env` variables in the provider's dashboard. Set the start command to `npm start` (after compiling `tsc`).
3. **Frontend:** Deploy the Vite React app to Vercel. Connect your GitHub repo, select Vite as the framework, and it will automatically build and host the static files. Update the backend API URL in the Axios requests.
