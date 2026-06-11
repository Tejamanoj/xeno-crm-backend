# Xeno CRM Backend

## Overview

This repository contains the backend services for the Xeno CRM platform.

The backend manages customer data, audience segmentation, campaign creation, communication tracking, analytics, and AI-assisted campaign generation.

## Live API

https://xeno-crm-backend-c3k2.onrender.com

Health Check:

GET /

## Features

### Customer Management API

* Customer retrieval
* Customer segmentation
* Customer analytics

### Campaign Management API

* Create campaigns
* Launch campaigns
* Track campaign status

### Analytics API

* Campaign statistics
* Delivery metrics
* Engagement metrics

### AI Campaign Assistant API

* Campaign recommendation generation
* Marketing message generation
* Audience suggestions

### Channel Service

The backend includes a simulated channel service that:

* Processes campaign communications
* Simulates delivery events
* Simulates opens and clicks
* Updates campaign metrics

## Technology Stack

### Backend

* Node.js
* Express.js

### Database

* SQLite
* better-sqlite3

### Deployment

* Render

## API Endpoints

### Customers

GET /api/customers

### Segments

GET /api/segments

### Campaigns

GET /api/campaigns

POST /api/campaigns

### Analytics

GET /api/analytics

### AI Assistant

POST /api/ai/generate

## Architecture

Frontend (React + Vercel)

↓

Backend (Express + Render)

↓

SQLite Database

↓

Campaign Engine

↓

Channel Service

↓

Analytics Dashboard

## Author

Amara Teja Manoj Kumar

B.Tech Computer Science Engineering

SRM Institute of Science and Technology, Amaravati
