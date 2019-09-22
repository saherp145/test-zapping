# Zapping TV Test

This application is part of the job selection process of Zapping TV.

## What you need to run the app?

* An instance of MySql server running (version 8.0.17).
* Node (v10.16.3) and NPM (v6.9.0) installed.

### Steps to run app

1. Clone or download this repo locally.
2. Run script db-creation-script.sql in your MySql instance to create database and tables used by the app.
3. Change file config.js to use your local DB access info.
4. Open your system terminal and go to the repo root folder.
5. Inside repo root folder run command:

```bash
npm install
```

6. Then execute this command to start app:

```bash
npm start
```

7. Finally, you can access web app going to <http://localhost:3000/location/vitacura> in your preferred web browser.
8. Also you can go to <http://localhost:3000/year/2000>.
