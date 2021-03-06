# Alarmas Del Subte - App

[![Build Status](https://travis-ci.org/feldmatias/AlarmasDelSubte-App.svg?branch=master)](https://travis-ci.org/feldmatias/AlarmasDelSubte-App)
[![Coverage Status](https://coveralls.io/repos/github/feldmatias/AlarmasDelSubte-App/badge.svg?branch=master)](https://coveralls.io/github/feldmatias/AlarmasDelSubte-App?branch=master)

### Backend
https://github.com/feldmatias/AlarmasDelSubte

### Setup
Install node.js and npm, then run `npm install`

### Build
- Run android: `npm run android`
- Run tests: `npm test`
- Run linter: `npm run pretest`

### Configuration
Check `.env.example`

- Generate a `.env` file for development

- Generate a `.env.production` file for release

Download `google-services.json` from firebase and place it in `android/app/google-services.json`

### Git hooks
Copy all files in `/hooks` to `.git/hooks/`

They will run the linter for every commit, and tests before a push.
