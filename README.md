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
├── RubiconApi/              ← .NET 8 backend
│   ├── RubiconApi.csproj
│   ├── Program.cs           ← implement TODOs here
│   ├── products.csv         ← already in place, do not modify
│   └── Properties/
│       └── launchSettings.json
└── rubicon-front/           ← Angular 17 frontend
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

## Prerequisites

Make sure you have the following installed before the session:

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org) and npm
- [Angular CLI](https://angular.io/cli) — `npm install -g @angular/cli`
- Any IDE or editor you are comfortable with (VS Code, Rider, Visual Studio, etc.)

---

## Getting started

### 1. Run the backend

```bash
cd RubiconApi
dotnet run
```

The API will be available at `http://localhost:5000`.

> **Note:** if port 5000 is already in use on your machine, update `applicationUrl` in `Properties/launchSettings.json` and also update `API_URL` in `rubicon-front/src/app/app.component.ts` to match.

### 2. Run the frontend

Open a second terminal:

```bash
cd rubicon-front
npm install
npm start
```

The app will be available at `http://localhost:4200`.

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
- Keep all changes within the files marked with TODOs
- You do not need to write unit tests during the session, but be prepared to discuss how you would approach testing your solution

---

## Bonus (if you have time)

Not required, but these show depth of experience:

- Add `IMemoryCache` on the backend to avoid re-reading the CSV file on every request
- Discuss how the frontend pagination logic would change if it were server-side
- Add a visible retry mechanism on the frontend when the API call fails

---

Good luck — feel free to ask questions at any point.
