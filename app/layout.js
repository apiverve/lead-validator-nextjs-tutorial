import './globals.css';

export const metadata = {
  title: 'Lead Validator',
  description: 'Score leads by checking their email and phone number with APIVerve'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
