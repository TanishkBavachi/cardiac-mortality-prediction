### AI-Powered Cardiac Mortality Risk Assessment & Health Monitoring Platform

Cardiac Fate Tracker is a full-stack AI-assisted healthcare application designed to support **early cardiac risk assessment and patient monitoring**. The platform collects clinical and demographic patient information, processes the data through a mortality-risk prediction pipeline, generates risk-level insights, stores prediction history, and provides AI-powered health guidance.

The application combines a modern **React + TypeScript frontend**, **Supabase backend services**, configurable **machine-learning inference**, and an **AI health assistant** into a single healthcare-focused platform.

> **Disclaimer:** This project is developed for educational, research, and prototype purposes. It is not a substitute for professional medical diagnosis, treatment, or clinical decision-making.

---

## Project Overview

Heart-failure patients can have significantly different risk profiles depending on clinical parameters and comorbidities.

Cardiac Fate Tracker aims to provide a digital platform where relevant patient information can be entered and processed to generate a **mortality-risk score and risk category**.

The system is designed around the following workflow:

```text
Patient Clinical Data
        ↓
Authentication
        ↓
Patient Data Validation
        ↓
Prediction API
        ↓
ML Model / Risk Calculation
        ↓
Mortality Risk Score
        ↓
Risk Classification
        ↓
AI-Generated Recommendations
        ↓
Database Storage
        ↓
Patient History & Monitoring
```

---

## Objectives

* Develop an AI-assisted platform for cardiac mortality-risk assessment.
* Process clinically relevant patient parameters.
* Generate an interpretable mortality-risk score.
* Categorize patients into different risk levels.
* Store prediction results for historical monitoring.
* Provide AI-powered health information and recommendations.
* Provide an interactive patient-monitoring interface.
* Integrate authentication and secure backend services.
* Create a scalable architecture that can connect to an external ML inference endpoint.

---

## Key Features

### Cardiac Risk Prediction

Users can provide patient information including:

* Age
* Sex
* Ejection fraction
* Serum creatinine
* Serum sodium
* Creatinine phosphokinase (CPK)
* Platelet count
* High blood pressure
* Diabetes
* Anaemia
* Smoking status
* Current medicines

The information is submitted to the prediction service for risk assessment.

---

### Mortality Risk Scoring

The prediction service returns a mortality-risk score and corresponding risk category.

The current application supports:

```text
Low
Moderate
High
```

The frontend also has a `Critical` state available for displaying prediction results.

The system normalizes the calculated risk score to a:

```text
0 – 100
```

range.

---

### Machine Learning Integration

The backend supports integration with an external machine-learning inference service.

The prediction function checks for:

```text
ML_MODEL_ENDPOINT
ML_MODEL_API_KEY
```

When configured, patient data is sent to the external ML service.

The expected response can provide a mortality-risk value through fields such as:

```text
mortalityRisk
risk_score
```

If the external ML service is unavailable or not configured, the application contains a built-in risk-calculation fallback.

This architecture allows the project to evolve from a prototype risk calculator into a deployable ML inference system.

---

### Risk Calculation Fallback

The fallback mechanism considers several patient characteristics, including:

* Age
* Ejection fraction
* Serum creatinine
* Serum sodium
* Platelet levels
* Creatinine phosphokinase
* High blood pressure
* Diabetes
* Anaemia
* Smoking
* Certain medication information

The calculated score is constrained between:

```text
0 and 100
```

and classified into risk categories.

---

###AI Health Assistant

The application includes an AI-powered health chat interface.

The backend health-chat function integrates with an AI gateway using:

```text
Google Gemini 2.5 Flash
```

The assistant is designed to provide information related to:

* Heart health
* Cardiovascular conditions
* Medications
* Lifestyle
* Diet
* Exercise
* Medical terminology
* When professional medical consultation may be appropriate

The application also instructs the AI assistant to encourage users to consult healthcare professionals before making medical decisions.

---

###Doctor Consultation

The application includes dedicated interfaces for doctor consultation and healthcare interaction.

Relevant frontend components include:

```text
DoctorConsultation.tsx
DoctorConsultationPage.tsx
```

---

###Voice Assistant

The project includes a voice-assistant component:

```text
VoiceAssistant.tsx
```

This provides an additional interaction mechanism for the healthcare application.

---

### Authentication

User authentication is implemented using:

```text
Supabase Auth
```

The application verifies the authenticated user before allowing mortality-risk predictions.

Unauthenticated users are redirected to the authentication page.

---

### Prediction History

Prediction information is stored in the Supabase database.

The application contains a dedicated:

```text
HistoryPage.tsx
```

for accessing historical prediction information.

---

### Patient Profile

The project includes patient-profile functionality through:

```text
ProfilePage.tsx
```

---

### Notifications

A dedicated notification interface is implemented through:

```text
NotificationsPage.tsx
```

---

###Administration

The application also contains an administration interface:

```text
AdminPage.tsx
```

---

##Technology Stack

### Frontend

| Technology           | Purpose                           |
| -------------------- | --------------------------------- |
| React                | Frontend application              |
| TypeScript           | Type-safe development             |
| Vite                 | Development server and build tool |
| React Router         | Application routing               |
| Tailwind CSS         | Styling                           |
| shadcn/ui            | UI components                     |
| Radix UI             | Accessible UI primitives          |
| Lucide React         | Icons                             |
| Recharts             | Data visualization                |
| React Hook Form      | Form management                   |
| Zod                  | Data validation                   |
| TanStack React Query | Server-state management           |

---

### Backend

| Technology              | Purpose                            |
| ----------------------- | ---------------------------------- |
| Supabase                | Backend platform                   |
| Supabase Auth           | Authentication                     |
| Supabase Database       | Patient/prediction data storage    |
| Supabase Edge Functions | Server-side prediction and AI APIs |
| Deno                    | Edge Function runtime              |

---

### AI / Machine Learning

| Technology              | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| External ML Endpoint    | Configurable mortality prediction            |
| AI Gateway              | AI recommendation and chat integration       |
| Google Gemini 2.5 Flash | Health assistant / recommendation generation |
| Risk-scoring logic      | Fallback mortality-risk calculation          |

> The repository is structured to connect to an externally hosted ML model. A trained model artifact is not included in the current project repository.

---

## System Architecture

```text
                     ┌───────────────────────┐
                     │     User / Patient    │
                     └───────────┬───────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ React + TypeScript UI   │
                    │        + Vite           │
                    └────────────┬────────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               │                 │                 │
               ▼                 ▼                 ▼
        Authentication      Prediction API     AI Health Chat
               │                 │                 │
               └────────────┬────┴─────────────────┘
                            │
                            ▼
                   ┌───────────────────┐
                   │ Supabase Backend  │
                   └─────────┬─────────┘
                             │
               ┌─────────────┼─────────────┐
               │             │             │
               ▼             ▼             ▼
          Supabase DB   Edge Functions  Auth
                             │
                             ▼
                   ┌────────────────────┐
                   │ External ML Model  │
                   │        OR          │
                   │ Fallback Risk      │
                   │ Calculation        │
                   └────────────────────┘
```

---

## Project Structure

```text
cardiac-fate-tracker/
│
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   │
│   ├── components/
│   │   ├── AIHealthChat.tsx
│   │   ├── DoctorConsultation.tsx
│   │   ├── Header.tsx
│   │   ├── MLModelStatus.tsx
│   │   ├── PatientForm.tsx
│   │   ├── PredictionResult.tsx
│   │   ├── VoiceAssistant.tsx
│   │   └── ui/
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── AIHealthMonitorPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── DoctorConsultationPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── Index.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── NotFound.tsx
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── supabase/
│   ├── functions/
│   │   ├── health-chat/
│   │   │   └── index.ts
│   │   └── predict-mortality/
│   │       └── index.ts
│   │
│   ├── migrations/
│   │   └── database migration files
│   │
│   └── config.toml
│
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

# Installation

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* A Supabase project
* Required API credentials/environment variables

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/cardiac-fate-tracker.git
```

Navigate into the project:

```bash
cd cardiac-fate-tracker
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a local:

```text
.env
```

file in the project root.

Example:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url
```

For the prediction Edge Function, configure the required server-side secrets in your Supabase environment:

```env
ML_MODEL_ENDPOINT=your_ml_model_endpoint
ML_MODEL_API_KEY=your_ml_model_api_key
LOVABLE_API_KEY=your_ai_gateway_key
```

### Security

Never commit your actual `.env` file to GitHub.

Add:

```text
.env
.env.*
!.env.example
```

to `.gitignore`.

---

# Running the Application

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, typically similar to:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

# Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# Code Quality

Run ESLint:

```bash
npm run lint
```

---

#Application Workflow

### Step 1 — User Authentication

The user signs into the platform using Supabase authentication.

### Step 2 — Patient Information

The patient form collects relevant clinical and demographic information.

### Step 3 — Prediction Request

The frontend invokes the Supabase:

```text
predict-mortality
```

Edge Function.

### Step 4 — ML Inference

If an external ML endpoint is configured, patient data is forwarded to the model.

### Step 5 — Fallback Calculation

If the external model is unavailable, the backend uses its built-in risk-scoring logic.

### Step 6 — Risk Classification

The resulting score is converted into a risk category.

### Step 7 — AI Recommendations

The system can generate health-related recommendations using the configured AI service.

### Step 8 — Database Storage

The prediction and associated patient information are stored in Supabase.

### Step 9 — History & Monitoring

Users can access historical prediction information through the application.

---

# Patient Parameters

The prediction pipeline currently accepts parameters such as:

```text
Age
Sex
Ejection Fraction
Serum Creatinine
Serum Sodium
Platelets
Creatinine Phosphokinase
High Blood Pressure
Diabetes
Anaemia
Smoking
Medicines
```

These parameters are based on clinically relevant cardiovascular/heart-failure information used by the application.

---

# API / Edge Functions

## `predict-mortality`

Responsible for:

* Authentication verification
* Receiving patient data
* Calling the external ML model
* Falling back to risk calculation
* Generating risk classification
* Generating AI recommendations
* Saving prediction information
* Returning prediction results

---

## `health-chat`

Responsible for:

* Receiving conversational messages
* Connecting to the AI gateway
* Generating health-related responses
* Streaming AI responses to the frontend
* Handling API errors and rate limits

---

# Database

The project uses **Supabase PostgreSQL-backed services** for application data.

The prediction function stores information such as:

```text
User ID
Patient Name
Age
Sex
Ejection Fraction
Serum Creatinine
Serum Sodium
Platelets
Creatinine Phosphokinase
High Blood Pressure
Diabetes
Anaemia
Smoking
Medicines
Mortality Risk
Risk Level
Recommendations
```

Database migrations are maintained under:

```text
supabase/migrations/
```

---

# Security Considerations

The application includes several security-related mechanisms:

* Supabase authentication
* Authenticated prediction requests
* Bearer-token authorization
* Server-side API credentials
* Environment-variable based secrets
* Database-backed user association
* Separation between frontend configuration and backend secrets

### Important

Never expose:

```text
ML_MODEL_API_KEY
LOVABLE_API_KEY
```

in frontend source code.

Do not commit:

```text
.env
```

to a public GitHub repository.

---

# Testing & Validation

Before deploying the application, validate:

* User registration/login
* Patient form validation
* Prediction API availability
* ML endpoint connectivity
* Fallback prediction logic
* Database insertion
* Prediction history
* AI health chat
* Doctor consultation interface
* Notification functionality
* Profile functionality
* Production build

Recommended commands:

```bash
npm run lint
npm run build
npm run preview
```

---

# Current ML Architecture

The application is designed around a flexible prediction architecture:

```text
                  Patient Data
                       │
                       ▼
              Prediction Function
                       │
                       ▼
            Is ML Endpoint Configured?
                 /             \
               YES              NO
                │                │
                ▼                ▼
         External ML Model   Risk Calculation
                │                │
                └───────┬────────┘
                        ▼
                 Mortality Risk
                        │
                        ▼
                  Risk Category
                        │
                        ▼
               AI Recommendations
                        │
                        ▼
                  Supabase DB
```

This makes it possible to replace the current fallback calculation with a separately trained and deployed ML model without redesigning the complete frontend.

---

# Future Improvements

Potential future development areas include:

* Integration of a validated trained mortality-prediction model.
* Model versioning and experiment tracking.
* Formal evaluation using train/validation/test datasets.
* Accuracy, precision, recall, F1-score, ROC-AUC and calibration reporting.
* Explainable AI using SHAP or similar techniques.
* Feature-importance visualization.
* Real-time health monitoring.
* Wearable-device integration.
* Doctor dashboard.
* Patient-doctor secure communication.
* Automated alerts for high-risk cases.
* Model monitoring and drift detection.
* Role-based access control.
* Improved audit logging.
* Containerized ML inference deployment.
* Cloud-based scalable inference.
* Clinical validation and regulatory review before any real-world clinical use.

---

# Real-World Applications

The project demonstrates how AI and cloud technologies can be applied to:

* Healthcare risk assessment
* Patient monitoring
* Clinical decision-support prototypes
* Preventive healthcare systems
* Digital health platforms
* Cardiovascular risk management
* Remote health monitoring
* AI-assisted patient education

The system is intended as a **decision-support prototype**, not an autonomous medical decision-maker.

---

#Project Highlights

### Full-Stack Development

Built using:

```text
React
TypeScript
Vite
Tailwind CSS
Supabase
```

### AI Integration

Includes:

```text
External ML inference support
AI-powered health chat
AI-generated recommendations
```

### Healthcare Data Processing

Processes multiple clinical and demographic parameters for cardiac risk assessment.

### Cloud Backend

Uses Supabase for:

```text
Authentication
Database
Edge Functions
Backend integration
```

---

# Screenshots
<img width="508" height="232" alt="Screenshot 2026-10-03 124815" src="https://github.com/user-attachments/assets/834dd34b-b754-4277-868c-7ce396d3b21a" />

# Academic / Portfolio Use

This project demonstrates practical experience in:

* Artificial Intelligence
* Machine Learning integration
* Full-stack development
* Healthcare analytics
* Data processing
* API integration
* Cloud backend development
* Database management
* Authentication
* AI-assisted applications
* TypeScript development
* React development
* Edge-function architecture

---

# Medical Disclaimer

Cardiac Fate Tracker is an academic/prototype software project.

The risk scores, recommendations, and AI-generated information produced by this application **must not be considered a medical diagnosis or medical prescription**.

Users should consult qualified healthcare professionals for diagnosis, treatment, medication decisions, and emergency medical care.

Before using a system of this type in a real clinical environment, appropriate:

* Clinical validation
* Security assessment
* Privacy assessment
* Regulatory review
* Model validation
* Bias evaluation
* Safety testing

would be required.

---

# Author

**Tanishk Bavachi**

AI/ML Engineer | Artificial Intelligence | Machine Learning | Data Analytics

### Areas of Interest

```text
Artificial Intelligence
Machine Learning
Healthcare AI
Data Analytics
NLP
Cybersecurity
Cloud & Full-Stack AI Applications
```

---

# Support

If you find this project useful for learning or research, consider giving the repository a ⭐ on GitHub.

---
