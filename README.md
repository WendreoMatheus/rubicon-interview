# Rubicon — Technical Interview Challenge

Welcome. This challenge is designed to take **around 90 minutes** and covers both backend and frontend development. Read this file carefully before starting.

---

## Overview

You are given two projects — a **.NET 8 minimal API** and an **Angular 17 standalone app** — already scaffolded and ready to run. Your job is to implement the missing logic marked with `TODO` comments in each project.

The goal is to build a simple product catalog:

- The backend reads a CSV file and exposes it as a JSON REST endpoint
- The frontend consumes that endpoint and displays the data in a filterable, sortable, paginated table

```
rubicon-interview/
├── README.md
├── docker-compose.yml      ← run everything with one command
├── RubiconApi/             ← .NET 8 backend
│   ├── Dockerfile
│   ├── RubiconApi.csproj
│   ├── Program.cs          ← implement TODOs here
│   ├── products.csv        ← already in place, do not modify
│   └── Properties/
│       └── launchSettings.json
└── rubicon-front/          ← Angular 17 frontend
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── angular.json
    ├── tsconfig.json
    └── src/
        ├── styles.css              ← already done, do not modify
        ├── index.html
        ├── main.ts
        └── app/
            ├── app.component.html  ← already done, do not modify
            └── app.component.ts    ← implement TODOs here
```

---

## Getting started

Pick **one** of the three options below — whichever best matches your setup.

In all cases the app will be available at:

- Frontend: http://localhost:4200
- Backend:  http://localhost:5000/api/products

---

### Option A — Docker (recommended, zero local setup)

Requires only [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS/Windows) or Docker Engine + Compose (Linux).

From the repo root:

```bash
docker compose up --build
```

That's it. Both services come up together. Stop with `Ctrl+C`, then clean up with `docker compose down`.

Whenever you change code, re-run `docker compose up --build` to rebuild. For a faster inner dev loop, pick Option B or C.

> 💡 **Tip:** the first build pulls ~500 MB of base images. Run `docker compose build` once before your interview session so you don't spend time on this during the clock.

---

### Option B — Visual Studio 2022 (Windows)

Requires:

- [Visual Studio 2022](https://visualstudio.microsoft.com/) with the **ASP.NET and web development** workload
- [.NET 8 SDK](https://dotnet.microsoft.com/download) (bundled with VS 2022 17.8+)
- [Node.js 18+](https://nodejs.org) and npm

**1. Backend inside Visual Studio:**

1. Open `RubiconApi/RubiconApi.csproj` (double-click or *File → Open → Project/Solution*).
2. If you see `NETSDK1004: Assets file 'project.assets.json' not found`, right-click the project in Solution Explorer → **Restore NuGet Packages** (or run `dotnet restore` in the Developer PowerShell).
3. Press **F5** (Debug) or **Ctrl+F5** (Run without debugging).
4. The API launches at `http://localhost:5000`. Leave it running.

**2. Frontend in a separate terminal** (Visual Studio doesn't manage Angular dev-server well, so run it outside):

Open *View → Terminal* (or any external terminal) and:

```bash
cd rubicon-front
npm install
npm start
```

The Angular dev server will open `http://localhost:4200` automatically.

> 💡 Prefer to stay fully inside VS? You can also open the whole folder as a "solution-less" workspace and use the **Task Runner Explorer** to manage npm, but the external terminal is simpler.

---

### Option C — Command line (cross-platform, fastest reload)

Requires:

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org) and npm

**Terminal 1 — backend:**

```bash
cd RubiconApi
dotnet run
```

**Terminal 2 — frontend:**

```bash
cd rubicon-front
npm install
npm start
```

---

> **Port conflict?** If port 5000 is already in use, update `applicationUrl` in `RubiconApi/Properties/launchSettings.json` and also update `API_URL` in `rubicon-front/src/app/app.component.ts` to match. If port 4200 is in use, Angular will prompt for a different one automatically.

---

## What you need to implement

### Backend — `RubiconApi/Program.cs`

The endpoint skeleton and all models are already defined. You need to fill in the logic:

| # | Location | What to do |
|---|---|---|
| TODO 1 | `builder.Services` | Register `IProductService` in the DI container |
| TODO 2 | `app.MapGet(...)` | Implement the endpoint — inject the service, return the product list, handle errors |
| TODO 3 | `IProductService` | Define the `GetAll()` method signature |
| TODO 4 | `ProductService` constructor | Resolve the correct path to `products.csv` |
| TODO 5 | `ProductService.GetAll()` | Read and parse the CSV using CsvHelper, throw `FileNotFoundException` if file is missing |

**Acceptance criteria:**

- `GET http://localhost:5000/api/products` returns a JSON array of 100 products
- `GET /api/products?category=Audio` returns only Audio products
- `GET /api/products?status=inactive` returns only inactive products
- Missing CSV returns `404`
- Unexpected errors return `500`

---

### Frontend — `rubicon-front/src/app/app.component.ts`

The template, styles, and component skeleton are already in place. You need to implement the methods:

| # | Method | What to do |
|---|---|---|
| TODO 1 | `ngOnDestroy` | Complete the `destroy$` subject to prevent memory leaks |
| TODO 2 | `loadProducts()` | Fetch products from the API using `HttpClient`, handle loading and error states |
| TODO 3 | `applyFilters()` | Filter the product list by search term, category and status |
| TODO 4 | `sortProducts()` | Sort the filtered list by the active sort field and direction |
| TODO 5 | `updatePagination()` | Calculate total pages and slice the filtered list for the current page |
| TODO 6 | `setSort(field)` | Toggle sort direction if same field is clicked, or set a new sort field |

**Acceptance criteria:**

- Products load from the API on page init
- Typing in the search box filters by product name (case-insensitive)
- Selecting a category or status filters the list accordingly
- Clicking a column header sorts the table; clicking again reverses the order
- Pagination shows 10 items per page and updates correctly after filtering
- No memory leaks — the HTTP subscription is properly cleaned up on component destroy

---

## Evaluation criteria

You will be evaluated on the following, in order of priority:

1. **Correctness** — does it work end-to-end?
2. **Code quality** — separation of concerns, naming, readability
3. **Error handling** — what happens when things go wrong?
4. **Best practices** — dependency injection, RxJS patterns, strong typing (avoid `any`)
5. **Communication** — explain your decisions as you go

---

## Rules

- You may use Google, official docs, Stack Overflow, or any reference material freely
- Do not modify `products.csv`, `app.component.html`, or `styles.css`
- Keep logic changes within the files marked with TODOs
- You do not need to write unit tests during the session, but be prepared to discuss how you would approach testing your solution

---

## Troubleshooting

**Port 5000 or 4200 already in use.** On Windows check with `netstat -ano | findstr :5000`. Either stop the other process or change the port (see note under the options).

**`NETSDK1004: project.assets.json not found` in Visual Studio.** Right-click the project → *Restore NuGet Packages*, or run `dotnet restore` inside `RubiconApi/` and rebuild.

**`Could not find the '@angular-devkit/build-angular:application' builder's node package`.** Delete `rubicon-front/node_modules` and `package-lock.json`, then run `npm install` again.

**Visual Studio launches but hits CORS in the browser.** The API already configures `AllowAnyOrigin`. If you changed the backend URL, re-check that `API_URL` in `app.component.ts` matches.

**Docker build is slow the first time.** Normal — base images are ~500 MB. Subsequent builds reuse the layer cache and finish in seconds.

**Angular changes not reflected when using Docker.** Option A builds a production bundle; it doesn't hot-reload. For live reload, use Option B or C and run `npm start` natively.

**HTTPS dev-cert prompt from .NET.** Harmless for this challenge — the API listens on HTTP only (`http://localhost:5000`). You can safely skip `dotnet dev-certs https --trust`.

---

## Bonus (if you have time)

Not required, but these show depth of experience:

- Add `IMemoryCache` on the backend to avoid re-reading the CSV file on every request
- Discuss how the frontend pagination logic would change if it were server-side
- Add a visible retry mechanism on the frontend when the API call fails

---

Good luck — feel free to ask questions at any point.
