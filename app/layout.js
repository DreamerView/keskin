import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AosInit from '../components/AosInit';


export const metadata = {
  title: "Keskin.kz",
  description: "Keskin.kz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <AosInit />
        {children}
      </body>
    </html>
  );
}
