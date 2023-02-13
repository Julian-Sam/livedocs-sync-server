# Livedocs Data Sync Engine

This repo has 3 folders:
- node_server: Express + Node Server. Has a /sync & a /search endpoint
- next_site: Static frontend with a search which connects to the node server
- test_api_server: Test Django server which mimics the Stripe & Hubspot API

## Install + Run
node server & next_site
```bash
npm install
npm run dev
```

test_api_server
: recommend to install a virtual env first
```bash
pip install -r requirements
python manage.py migrate
python manage.py runserver
```
