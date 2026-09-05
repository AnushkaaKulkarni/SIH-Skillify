# SkillifyAI – Project Setup

Website Link=https://skillify-ai-project.vercel.app/

This project contains both **frontend** and **backend** code.

Folder structure:

Skillify_AI  
- backend  
- frontend  

---

## Environment Variables

Each teammate must create their own `.env` files.
Do NOT push `.env` files to GitHub.

---

### Frontend `.env`

For Local Development:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

### Backend `.env`

Create this file:

backend/.env

Add:
PORT=5000  
MONGODB_URI=your_new_mongodb_atlas_connection_string  
DB_NAME=skillify_sih  
JWT_SECRET=your_jwt_secret  
JWT_EXPIRY=7d  

Replace `MONGODB_URI` with the connection string for the new MongoDB Atlas cluster. Do not reuse the old database.

---

## Install Dependencies

From the project root:
### Backend
cd backend  
npm install  

### Frontend
cd ../frontend  
npm install  


## Run the Project

### Terminal 1 – Backend
## Semester & Results (new)

This project includes a semester-based workflow (admin → faculty → student) to manage exams and marksheets.

- Backend endpoints (prefix `/api`):
	- `POST /admin/semesters/create` — create a semester (admin)
	- `GET /admin/semesters/list` — list semesters (admin)
	- `POST /admin/semesters/:semesterId/assign-faculty-excel` — upload Excel (column `facultyID`) to assign faculty to semester (admin)
	- `PATCH /admin/semesters/:semesterId/declare` — declare results for a semester (admin)
	- `GET /admin/semesters/:semesterId/results` — fetch semester results (admin)
	- `GET /admin/semesters/for-faculty` — semesters assigned to logged-in faculty (faculty)
	- `PATCH /faculty/exams/:examId/assign-to-semester` — assign an approved exam to a semester (faculty)
	- `GET /student/semesters` — list semesters for student selection (student)
	- `GET /student/marksheets/:semesterId` — download/view student's marksheet (student; only after declare)

- Frontend pages added/updated:
	- Admin: `/admin` — Dashboard, Create Semester, Result Declare, View Results
	- Faculty: `Assign to Semester` modal in exam creation flow
	- Student: `/student/exams` and `/student/marksheets` pages; student quiz page now lists previous quiz reports

Notes:
- Excel uploads expect a `facultyID` column that maps to `User.facultyId` in the database.
- Students will only see marksheets for a semester after the admin has declared results.
cd backend  
npm run dev  

Backend runs on:
http://localhost:5000

---

### Terminal 2 – Frontend
cd frontend  
npm run dev  

Frontend runs on:
http://localhost:3000

---

## Notes

- Backend must be running before frontend
- Do not commit `.env` or `node_modules`


SkillifyAI Team
