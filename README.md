# Student Laptop Finder

**SW302 – User Interface Development | Assignment 2**

A responsive five-page laptop finder application built with HTML, JavaScript ES modules, JSON, localStorage, and Tailwind CSS 4.

## Features
- Five connected pages: Home, Catalogue, Details, Favorites, and Compare.
- 20 laptop records in `data/laptops.json`.
- Fetch-based asynchronous data loading with error handling and loading skeletons.
- Live search by laptop name or brand.
- Category, maximum price, minimum RAM, and minimum battery filters.
- Sorting by price, battery life, and weight in both directions.
- Dynamic laptop cards and specification tables.
- Favorites and theme persistence using localStorage.
- Comparison of two to four favorites with best-value highlighting.
- Performance Mode and Battery Saver Mode.
- Responsive layouts and collapsible mobile navigation.
- Tailwind CSS 4 installed locally; no CDN or JavaScript UI framework.

## Requirements
- Node.js and npm
- VS Code (recommended)
- VS Code Live Server extension or another local HTTP server

## Install
```bash
npm install
```

## Build CSS
```bash
npm run build
```

## Project structure
```text
laptop_finder_student/
├── index.html
├── laptops.html
├── details.html
├── favorites.html
├── compare.html
├── data/laptops.json
├── src/
│   ├── input.css
│   └── js/
│       ├── api.js
│       ├── storage.js
│       ├── ui.js
│       ├── compare.js
│       ├── home.js
│       ├── laptops.js
│       ├── details.js
│       ├── favorites.js
│       └── compare-page.js
├── dist/output.css
├── assets/
├── package.json
└── README.md
```

## GitHub repository
**Add your own repository URL:** `https://github.com/donia-essam/student-laptop-finder`

## Notes
Laptop prices and specifications in the included JSON are sample data for the assignment demonstration purposes, not live market listings.
