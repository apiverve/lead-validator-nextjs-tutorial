import './globals.css';

export const metadata = {
  title: 'Lead Validator | APIVerve Tutorial',
  description: 'Validate leads with email and phone number verification'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
