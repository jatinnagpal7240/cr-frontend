// admin/app/layout.js
import "../globals.css";

export const metadata = {
  title: "Admin | Code & Run",
  description: "Admin Panel for Code & Run",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
