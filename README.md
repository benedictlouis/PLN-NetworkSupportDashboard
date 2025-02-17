# Installation Guide

Follow these steps to set up and run the project on your local machine.

## Prerequisites
Ensure you have the following installed:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) and npm
- [PostgreSQL](https://www.postgresql.org/download/)

## Installation Steps

### 1. Clone the Repository
```sh
git clone <repository-url>
cd <repository-folder>
```

### 2. Set Up the Database
1. Install PostgreSQL on your computer if you haven't already.
2. Open the **SQL Shell (psql)**.
3. Copy all commands from `network_support.sql`.
4. Paste and execute them in the SQL Shell.

### 3. Install and Run the Frontend
```sh
cd frontend
npm install
npm run dev
```

### 4. Install and Run the Backend
```sh
cd ../backend
npm install
npm run start
```

## Notes
- If the display font does not appear as expected, try installing the **Poppins** font on your computer.
- If you encounter errors, install the following libraries:
  - [Preline UI](https://preline.co/docs/index.html)
  - Apache ECharts: `npm install echarts`
  - Material UI: `npm install @mui/material @emotion/react @emotion/styled`

Now your website should be up and running!

You can check how the website should look in the provided PDF slides within the repository. If you experience any issues or have any questions, feel free to contact us.

