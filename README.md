# Lead Validator | APIVerve API Tutorial

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14-000000)](package.json)
[![React](https://img.shields.io/badge/React-18-61dafb)](package.json)
[![APIVerve | Lead Validation](https://img.shields.io/badge/APIVerve-Lead_Validation-purple)](https://apiverve.com/marketplace?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial)

A powerful lead validation tool built with Next.js 14. Verify email addresses and phone numbers to qualify leads with a beautiful, modern UI and quality scoring.

![Screenshot](https://raw.githubusercontent.com/apiverve/lead-validator-nextjs-tutorial/main/screenshot.jpg)

---

### Get Your Free API Key

This tutorial requires an APIVerve API key. **[Sign up free](https://dashboard.apiverve.com?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial)** - no credit card required.

---

## Features

- Email validation (format, deliverability, disposable detection)
- Phone number validation with carrier lookup
- Multi-country phone support (10+ countries)
- Lead quality score calculation
- Beautiful glassmorphism UI design
- Server-side API integration (secure)
- Real-time validation feedback
- Responsive mobile design

## Quick Start

1. **Clone this repository**
   ```bash
   git clone https://github.com/apiverve/lead-validator-nextjs-tutorial.git
   cd lead-validator-nextjs-tutorial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**

   Open `app/api/validate/route.js` and replace the placeholder:
   ```javascript
   const API_KEY = 'your-api-key-here';
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**

   Navigate to `http://localhost:3000`

## Project Structure

```
lead-validator-nextjs-tutorial/
├── app/
│   ├── api/
│   │   └── validate/
│   │       └── route.js     # API route for validation
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout
│   ├── page.js              # Main page component
│   └── page.module.css      # Page styles
├── package.json             # Dependencies
├── next.config.js           # Next.js configuration
├── screenshot.jpg           # Preview image
├── LICENSE                  # MIT license
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## How It Works

1. **User enters lead info** - Email and/or phone number
2. **Form submission** - Data sent to API route
3. **Parallel validation** - Email and phone validated simultaneously
4. **Score calculation** - Quality score computed from results
5. **Results display** - Visual feedback with detailed breakdown

### The API Calls

```javascript
// Email Validation
const emailResponse = await fetch(
  `${EMAIL_API}?email=${encodeURIComponent(email)}`,
  { headers: { 'x-api-key': API_KEY } }
);

// Phone Validation
const phoneResponse = await fetch(
  `${PHONE_API}?number=${encodeURIComponent(phone)}&country=${country}`,
  { headers: { 'x-api-key': API_KEY } }
);
```

## API Reference

### Email Validator

**Endpoint:** `GET https://api.apiverve.com/v1/emailvalidator`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Email address to validate |

**Example Response:**

```json
{
  "status": "ok",
  "data": {
    "valid": true,
    "email": "user@example.com",
    "domain": "example.com",
    "isDisposable": false
  }
}
```

### Phone Number Validator

**Endpoint:** `GET https://api.apiverve.com/v1/phonenumbervalidator`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `number` | string | Yes | Phone number to validate |
| `country` | string | No | ISO country code (e.g., "US") |

**Example Response:**

```json
{
  "status": "ok",
  "data": {
    "valid": true,
    "formatted": "+1 555-123-4567",
    "type": "mobile",
    "carrier": "Verizon"
  }
}
```

## Lead Quality Scoring

The lead quality score is calculated based on:

| Criteria | Impact |
|----------|--------|
| Valid email format | +50% |
| Non-disposable email | +25% (included in email) |
| Valid phone number | +50% |

**Score Interpretation:**

- **80-100:** High quality lead - prioritize outreach
- **50-79:** Medium quality - verify manually
- **0-49:** Low quality - requires review

## Use Cases

Lead validation is essential for:

- **Sales Teams** - Qualify leads before outreach
- **Marketing** - Clean email lists for campaigns
- **SaaS Signups** - Verify new user registrations
- **E-commerce** - Validate checkout information
- **CRM Integration** - Enrich contact data
- **Lead Generation** - Filter low-quality submissions

## Customization Ideas

- Add bulk validation for CSV uploads
- Integrate with HubSpot, Salesforce, or other CRMs
- Add more validation fields (address, company)
- Create webhook notifications for new leads
- Add lead scoring based on custom criteria
- Export validation reports

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **CSS Modules** - Scoped styling

## Related APIs

Explore more APIs at [APIVerve](https://apiverve.com/marketplace?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial):

- [Email Validator](https://apiverve.com/marketplace/emailvalidator?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial) - Validate email addresses
- [Phone Number Validator](https://apiverve.com/marketplace/phonenumbervalidator?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial) - Validate phone numbers
- [Email Disposable Checker](https://apiverve.com/marketplace/emaildisposablechecker?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial) - Detect disposable emails

## License

MIT - see [LICENSE](LICENSE)

## Links

- [Get API Key](https://dashboard.apiverve.com?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial) - Sign up free
- [APIVerve Marketplace](https://apiverve.com/marketplace?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial) - Browse 300+ APIs
- [Email Validator API](https://apiverve.com/marketplace/emailvalidator?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial) - API details
