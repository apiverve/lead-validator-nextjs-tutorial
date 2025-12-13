/**
 * Lead Validator API Route
 *
 * Validates email and phone number using APIVerve APIs.
 * https://apiverve.com/marketplace
 */

import { NextResponse } from 'next/server';

// ============================================
// CONFIGURATION - Add your API key here
// Get a free key at: https://dashboard.apiverve.com
// ============================================
const API_KEY = 'your-api-key-here';

const EMAIL_API = 'https://api.apiverve.com/v1/emailvalidator';
const PHONE_API = 'https://api.apiverve.com/v1/phonenumbervalidator';

export async function POST(request) {
  // Check API key
  if (API_KEY === 'your-api-key-here') {
    return NextResponse.json(
      { error: 'Please add your API key to app/api/validate/route.js' },
      { status: 400 }
    );
  }

  try {
    const { email, phone, country } = await request.json();

    const results = {
      email: null,
      phone: null,
      score: 0
    };

    let checks = 0;
    let passed = 0;

    // Validate email if provided
    if (email) {
      checks++;
      try {
        const emailResponse = await fetch(`${EMAIL_API}?email=${encodeURIComponent(email)}`, {
          headers: { 'x-api-key': API_KEY }
        });

        const emailData = await emailResponse.json();

        if (emailData.status === 'ok' && emailData.data) {
          results.email = {
            email: email,
            valid: emailData.data.valid || emailData.data.isValid,
            disposable: emailData.data.isDisposable || emailData.data.disposable || false,
            domain: emailData.data.domain || email.split('@')[1]
          };

          if (results.email.valid && !results.email.disposable) {
            passed++;
          }
        } else {
          results.email = {
            email: email,
            valid: false,
            disposable: false,
            domain: email.split('@')[1] || null
          };
        }
      } catch (err) {
        console.error('Email validation error:', err);
        results.email = {
          email: email,
          valid: false,
          disposable: false,
          domain: email.split('@')[1] || null
        };
      }
    }

    // Validate phone if provided
    if (phone) {
      checks++;
      try {
        const phoneResponse = await fetch(
          `${PHONE_API}?number=${encodeURIComponent(phone)}&country=${country}`,
          { headers: { 'x-api-key': API_KEY } }
        );

        const phoneData = await phoneResponse.json();

        if (phoneData.status === 'ok' && phoneData.data) {
          // Handle formatted - can be string or object with international/national keys
          let formattedNumber = phone;
          if (typeof phoneData.data.formatted === 'string') {
            formattedNumber = phoneData.data.formatted;
          } else if (phoneData.data.formatted?.international) {
            formattedNumber = phoneData.data.formatted.international;
          } else if (phoneData.data.international) {
            formattedNumber = phoneData.data.international;
          }

          // If API returned formatted data, consider it valid
          const isValid = phoneData.data.valid ?? phoneData.data.isValid ?? !!formattedNumber;

          results.phone = {
            number: phone,
            valid: isValid,
            formatted: formattedNumber,
            type: phoneData.data.type || phoneData.data.lineType || 'Unknown',
            carrier: phoneData.data.carrier || null
          };

          if (results.phone.valid) {
            passed++;
          }
        } else {
          results.phone = {
            number: phone,
            valid: false,
            formatted: null,
            type: 'Unknown',
            carrier: null
          };
        }
      } catch (err) {
        console.error('Phone validation error:', err);
        results.phone = {
          number: phone,
          valid: false,
          formatted: null,
          type: 'Unknown',
          carrier: null
        };
      }
    }

    // Calculate overall score
    if (checks > 0) {
      results.score = Math.round((passed / checks) * 100);
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error('Validation error:', err);
    return NextResponse.json(
      { error: 'Failed to validate lead' },
      { status: 500 }
    );
  }
}
