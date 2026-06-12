# Xeno CRM Backend

## Overview

This repository contains the backend services for the Xeno CRM platform.

The backend powers customer management, audience segmentation, campaign creation, communication tracking, analytics reporting, and AI-assisted campaign generation.

It serves as the central API layer connecting the React frontend with the SQLite database and campaign processing engine.

---

## Live API

Backend URL:

https://xeno-crm-backend-c3k2.onrender.com

Health Check:

GET /

---

## Core Features

### Customer Management API

* Retrieve customer records
* Create new customers
* Delete customers
* Customer analytics
* Customer segmentation support

### Audience Segmentation API

* Create customer segments
* Store segmentation rules
* Build target audiences
* Segment-based campaign targeting

### Campaign Management API

* Create campaigns
* Launch campaigns
* Manage campaign lifecycle
* Campaign status monitoring
* Communication tracking

### Communication Tracking

The system records communication events including:

* Sent Messages
* Opened Messages
* Clicked Messages
* Failed Deliveries

### Analytics Engine

Provides real-time campaign analytics:

* Total Customers
* Total Segments
* Total Campaigns
* Total Messages Sent
* Total Messages Opened
* Total Messages Clicked
* Failed Deliveries
* Channel-wise Performance

### AI Campaign Assistant API

Supports AI-powered marketing features:

* Campaign generation
* Marketing message creation
* Audience recommendations
* Campaign suggestions
* Engagement optimization

---

## Campaign Processing Engine

The backend includes a campaign execution engine that:

1. Receives campaign requests
2. Identifies target customers
3. Creates communication records
4. Simulates delivery lifecycle
5. Tracks engagement events
6. Updates analytics metrics

---

## Channel Service Simulation

The channel service simulates real-world communication systems.

Supported channels:

* WhatsApp
* Email
* SMS
* RCS

The simulator generates:

* Delivery events
* Open events
* Click events
* Engagement statistics

---

## Technology Stack

### Backend

* Node.js
* Express.js

### Database

* SQLite
* better-sqlite3

### AI Integration

* AI-powered campaign generation endpoint
* Prompt-based marketing content creation

### Deployment

* Render

---

## API Endpoints

### Customers

#### Get All Customers

```http
GET /api/customers
```

#### Create Customer

```http
POST /api/customers
```

#### Delete Customer

```http
DELETE /api/customers/:id
```

---

### Segments

#### Get All Segments

```http
GET /api/segments
```

#### Create Segment

```http
POST /api/segments
```

---

### Campaigns

#### Get All Campaigns

```http
GET /api/campaigns
```

#### Create Campaign

```http
POST /api/campaigns
```

#### Campaign Communications

```http
GET /api/campaigns/:id/communications
```

Returns communication records associated with a campaign.

---

### Analytics

#### Dashboard Analytics

```http
GET /api/analytics
```

Returns:

* Total Customers
* Total Segments
* Total Campaigns
* Total Sent
* Total Opened
* Total Clicked
* Total Failed
* Channel Statistics

#### Trend Analytics

```http
GET /api/analytics/trend
```

Returns historical campaign activity for dashboard charts.

---

### AI Assistant

#### Generate Campaign Content

```http
POST /api/ai/generate
```

Generates:

* Campaign Messages
* Marketing Suggestions
* Audience Recommendations

---

## Database Architecture

### Customers

Stores:

* Name
* Email
* Phone Number
* Total Orders
* Total Spending

### Segments

Stores:

* Segment Name
* Rule Definitions

### Campaigns

Stores:

* Campaign Information
* Target Segments
* Communication Channel
* Campaign Status

### Communications

Stores:

* Customer Mapping
* Delivery Status
* Open Events
* Click Events
* Channel Information

---

## System Architecture

Frontend (React + Vercel)

↓

REST API Layer

↓

Express.js Backend

↓

SQLite Database

↓

Campaign Engine

↓

Channel Service Simulation

↓

Analytics Engine

↓

Dashboard Reporting

---

## Future Enhancements

* Real Email Integration
* WhatsApp Business API Integration
* Real-Time Event Tracking
* Campaign Scheduling
* AI Customer Scoring
* Predictive Analytics
* Advanced Segmentation Rules
* Authentication & Authorization
* Role-Based Access Control
* Webhook Support

---

## Author

### Amara Teja Manoj Kumar

B.Tech Computer Science Engineering

SRM Institute of Science and Technology, Amaravati

GitHub:
https://github.com/Tejamanoj

Built for the Xeno Engineering Internship Assignment 2026.
