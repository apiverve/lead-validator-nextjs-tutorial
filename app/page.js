'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const validateLead = async () => {
    if (!email && !phone) {
      setError('Please enter an email or phone number');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, country })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Failed to validate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return styles.scoreGood;
    if (score >= 50) return styles.scoreOk;
    return styles.scoreBad;
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Lead Validator</h1>
        <p className={styles.subtitle}>Verify email and phone number validity</p>
      </header>

      <div className={styles.card}>
        {/* Email Input */}
        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
        </div>

        {/* Phone Input */}
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label>Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="US">United States (+1)</option>
              <option value="GB">United Kingdom (+44)</option>
              <option value="CA">Canada (+1)</option>
              <option value="AU">Australia (+61)</option>
              <option value="DE">Germany (+49)</option>
              <option value="FR">France (+33)</option>
              <option value="IN">India (+91)</option>
              <option value="JP">Japan (+81)</option>
              <option value="BR">Brazil (+55)</option>
              <option value="MX">Mexico (+52)</option>
            </select>
          </div>
          <div className={styles.inputGroup} style={{ flex: 2 }}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="555-123-4567"
            />
          </div>
        </div>

        <button
          className={styles.validateBtn}
          onClick={validateLead}
          disabled={loading}
        >
          {loading ? 'Validating...' : 'Validate Lead'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </div>

      {/* Results */}
      {results && (
        <div className={styles.results}>
          {/* Overall Score */}
          <div className={styles.scoreCard}>
            <div className={`${styles.scoreCircle} ${getScoreColor(results.score)}`}>
              <span className={styles.scoreValue}>{results.score}</span>
            </div>
            <div className={styles.scoreInfo}>
              <h2>Lead Quality Score</h2>
              <p className={results.score >= 80 ? styles.textGood : results.score >= 50 ? styles.textOk : styles.textBad}>
                {results.score >= 80 ? 'High Quality Lead' : results.score >= 50 ? 'Medium Quality Lead' : 'Low Quality Lead'}
              </p>
            </div>
          </div>

          {/* Email Results */}
          {results.email && (
            <div className={styles.resultCard}>
              <h3>Email Validation</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Email</span>
                  <span className={styles.resultValue}>{results.email.email}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Valid Format</span>
                  <span className={`${styles.badge} ${results.email.valid ? styles.badgeGood : styles.badgeBad}`}>
                    {results.email.valid ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Disposable</span>
                  <span className={`${styles.badge} ${!results.email.disposable ? styles.badgeGood : styles.badgeBad}`}>
                    {results.email.disposable ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Domain</span>
                  <span className={styles.resultValue}>{results.email.domain || '--'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Phone Results */}
          {results.phone && (
            <div className={styles.resultCard}>
              <h3>Phone Validation</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Number</span>
                  <span className={styles.resultValue}>{results.phone.formatted || results.phone.number || phone}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Valid</span>
                  <span className={`${styles.badge} ${results.phone.valid ? styles.badgeGood : styles.badgeBad}`}>
                    {results.phone.valid ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Type</span>
                  <span className={styles.resultValue}>{results.phone.type || '--'}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Carrier</span>
                  <span className={styles.resultValue}>{results.phone.carrier || '--'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <footer className={styles.footer}>
        <p>
          Powered by{' '}
          <a
            href="https://apiverve.com/marketplace?utm_source=github&utm_medium=tutorial&utm_campaign=lead-validator-nextjs-tutorial"
            target="_blank"
            rel="noopener noreferrer"
          >
            APIVerve
          </a>
        </p>
      </footer>
    </main>
  );
}
