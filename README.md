# Lead Validator | APIVerve Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000)](package.json)
[![React](https://img.shields.io/badge/React-19-61dafb)](package.json)
[![APIVerve | Email Validator](https://img.shields.io/badge/APIVerve-Email_Validator-purple)](https://apiverve.com/marketplace/emailvalidator?utm_source=github&utm_medium=template&utm_campaign=lead-validator-nextjs-tutorial)
[![APIVerve | Phone Number Validator](https://img.shields.io/badge/APIVerve-Phone_Number_Validator-purple)](https://apiverve.com/marketplace/phonenumbervalidator?utm_source=github&utm_medium=template&utm_campaign=lead-validator-nextjs-tutorial)

Score a lead before it reaches your CRM. Enter an email and a phone number and get a 0–100 quality score, with the reason behind it: throwaway inboxes, domains that can't receive mail, typos like `gmial.com`, shared `sales@` addresses, VoIP and temporary phone numbers.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fapiverve%2Flead-validator-nextjs-tutorial&project-name=lead-validator&repository-name=lead-validator&env=APIVERVE_API_KEY&envDescription=Your%20APIVerve%20API%20key.%20Free%20to%20create%2C%20no%20card%20needed.&envLink=https%3A%2F%2Fdashboard.apiverve.com%2Fsignup%3Fapi%3Demailvalidator%26utm_source%3Dvercel%26utm_medium%3Dtemplate%26utm_campaign%3Dlead-validator-nextjs-tutorial)

![Lead Validator scoring a lead with a disposable, misspelled email](https://raw.githubusercontent.com/apiverve/lead-validator-nextjs-tutorial/main/screenshot.png)

---

### Get your free API key

This template needs an APIVerve API key. **[Sign up free](https://dashboard.apiverve.com/signup?api=emailvalidator&utm_source=github&utm_medium=template&utm_campaign=lead-validator-nextjs-tutorial)**, no credit card required.

---

## Deploy in one click

Click **Deploy with Vercel** above. Vercel copies this repo to your GitHub account, asks for your `APIVERVE_API_KEY`, and gives you a live URL about a minute later.

## Run it locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/apiverve/lead-validator-nextjs-tutorial.git
   cd lead-validator-nextjs-tutorial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**
   ```bash
   cp .env.example .env.local
   ```
   Then open `.env.local` and set `APIVERVE_API_KEY`.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open** `http://localhost:3000`

## How it works

1. The page posts the email, phone number and country to `/api/validate`.
2. That route calls the Email Validator and Phone Number Validator at the same time. Your API key stays on the server and never reaches the browser.
3. Each result becomes a list of checks, marked pass, check or fail.
4. The checks add up to a score.

```
app/
├── api/validate/route.js   # Calls APIVerve, builds the checks and the score
├── page.js                 # The form and the results
├── page.module.css         # Styles
├── layout.js
└── globals.css
```

### The API calls

```javascript
const res = await fetch(
  `https://api.apiverve.com/v1/emailvalidator?email=${encodeURIComponent(email)}`,
  { headers: { 'x-api-key': process.env.APIVERVE_API_KEY } }
);
const { data } = await res.json();
// data.isValid, data.isMxValid, data.isDisposable, data.hasTypo, data.isRoleAccount …
```

## Scoring

Every lead starts at 100. A **fail** costs 40 points and a **check** costs 15.

| Check | Fails when | Field |
|-------|-----------|-------|
| Deliverable | The address is invalid or its domain has no mail server | `isValid`, `isMxValid` |
| Not disposable (email) | It's a throwaway inbox | `isDisposable` |
| No typo | The domain looks misspelled (a *check*, not a fail) | `hasTypo` |
| Personal inbox | It's a shared address like `info@` (a *check*) | `isRoleAccount` |
| Valid number | The number isn't real for that country | `isValid` |
| Not disposable (phone) | It's a temporary number | `isDisposable` |
| Not VoIP | It's an internet number (a *check*) | `isVoip` |

**80–100** is a high quality lead, **50–79** is worth a second look, and **below 50** is low quality. Change the weights in `score()` in `app/api/validate/route.js`.

Every field above is on the free plan. On paid plans the page also shows APIVerve's own risk level, and typo checks suggest the corrected address.

## Before you share your URL

Once deployed, anyone who finds your URL can run validations on your API key. The route allows 10 requests per minute per visitor, which is fine for a demo. The limit is kept in memory, so it isn't shared between serverless instances. For production:

- Put the form behind your own sign-in, or
- Move the limit to a shared store such as [Upstash Redis](https://upstash.com/), or
- Call `/api/validate` only from your own backend, for example when a signup form is submitted.

## Ideas to extend it

- Validate on your signup form and block disposable addresses before they're saved
- Bulk-validate a CSV of leads
- Send high-scoring leads straight to HubSpot or Salesforce
- Add [IP Blacklist Lookup](https://apiverve.com/marketplace/ipblacklistlookup?utm_source=github&utm_medium=template&utm_campaign=lead-validator-nextjs-tutorial) to score the visitor's IP too

## API reference

- [Email Validator](https://apiverve.com/marketplace/emailvalidator?utm_source=github&utm_medium=template&utm_campaign=lead-validator-nextjs-tutorial): `GET https://api.apiverve.com/v1/emailvalidator?email=`
- [Phone Number Validator](https://apiverve.com/marketplace/phonenumbervalidator?utm_source=github&utm_medium=template&utm_campaign=lead-validator-nextjs-tutorial): `GET https://api.apiverve.com/v1/phonenumbervalidator?number=&country=`
- [Full documentation](https://docs.apiverve.com?utm_source=github&utm_medium=template&utm_campaign=lead-validator-nextjs-tutorial)

## Tech stack

- **Next.js 16** (App Router, route handlers)
- **React 19**
- **CSS Modules**

## License

MIT. See [LICENSE](LICENSE).
