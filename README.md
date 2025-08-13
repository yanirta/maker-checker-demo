# Loadmill Demo: Maker–Checker Funds‑Transfer Approval

A change related to payment

This project shows how **Loadmill** can automate testing for a classic “four‑eyes” approval flow.

Roles:

- **Maker** – initiates a funds‑transfer request  
- **Checker** – reviews the request and **approves** or **rejects** it

The demo has:

- **Express** backend with `@loadmill/node-recorder` for traffic capture  
- **React** frontend (Maker + Checker dashboards)

---

## Project Structure

```

project-root/
├── backend/                 # Express API + Loadmill recorder
│   ├── index.js
│   └── package.json
├── frontend/                # React app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── AppLayout.js
│   │   ├── Login.js
│   │   ├── MakerDashboard.js
│   │   └── CheckerDashboard.js
│   └── package.json
├── package.json             # Root scripts – runs both servers
└── Procfile                 # For Heroku deployment

````

---

## Quick Start (Local)

### 1. Clone

```bash
git clone <repository-url>
cd project-root
````

### 2. Install All Dependencies

```bash
npm install
```

Everything—including `@loadmill/node-recorder`—is pulled in for both backend and frontend.

### 3. (Optional) Configure the Recorder

```bash
export LOADMILL_CODE=<your-loadmill-tracking-id>
```

Skip this to use the public sample code hard‑coded in `backend/index.js`.

Environment variables you can tweak:

| Var             | Default       | Purpose                               |
| --------------- | ------------- | ------------------------------------- |
| `LOADMILL_CODE` | *sample code* | App ID from **Loadmill → Recordings** |
| `DEBUG`         | –             | Set to `loadmill:*` for verbose logs  |

### 4. Start Both Servers

```bash
npm run dev
```

* Backend – `http://localhost:3001`
* Frontend – `http://localhost:3000` (proxy to 3001)

### 5. Log In With Demo Users

| Role    | Username | Password     |
| ------- | -------- | ------------ |
| Maker   | maker    | maker1234!   |
| Checker | checker  | checker1234! |

---

## How the Demo Works

1. **Maker** logs in and submits a transfer (amount + recipient).
2. Transfer is **PENDING** in both dashboards.
3. **Checker** approves or rejects.
4. Dashboards refresh (Checker view polls every 5 s).
5. Every request passes through `expressRecorder`, creating a Loadmill recording ready to convert into tests.

All data is **in‑memory**; refresh clears state.

---

## Key API Endpoints

| Method | Path                     | Description (Auth header `token`) |
| ------ | ------------------------ | --------------------------------- |
| POST   | `/api/login`             | Get token                         |
| POST   | `/api/transfer/initiate` | Maker creates transfer            |
| GET    | `/api/transfer/my`       | Maker lists own transfers         |
| GET    | `/api/transfer/pending`  | Checker lists pending transfers   |
| POST   | `/api/transfer/approve`  | Checker approves transfer         |
| POST   | `/api/transfer/reject`   | Checker rejects transfer          |
| GET    | `/api/transfer/:id`      | Fetch single transfer (any user)  |
| GET    | `/api/audit`             | Simple audit log                  |

---

## Recorder Details

`@loadmill/node-recorder` is installed automatically, but you can add it manually:

```bash
npm i @loadmill/node-recorder --save
```

Basic usage in **backend/index.js**:

```js
const { expressRecorder } = require('@loadmill/node-recorder');
app.use(
  expressRecorder({
    loadmillCode: process.env.LOADMILL_CODE,   // required
    notSecure: true,                           // hash traffic if false
    cookieExpiration: 10 * 60 * 1000,          // 10 min session
    basePath: 'https://localhost:3000'         // your app’s URL
  })
);
```

### Debugging

Enable detailed logs:

```bash
DEBUG=loadmill:* npm run backend
```

---

## Running in Production (Heroku‑style)

```bash
npm start           # Builds React, then serves via Express on $PORT
```

`heroku-postbuild` in `package.json` performs the frontend build automatically.

---

## Loadmill Tips

* Run a full Maker→Checker scenario, then open **Loadmill → Recordings** to convert the captured session to a test.
* Parameterize `amount`, `recipient`, and add negative cases (oversize amount, duplicate approval, etc.).
* Recorder works on `localhost` because `notSecure` is set to `true`.
