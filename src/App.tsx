import { AppProvider, useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import HomePage from '@/pages/HomePage';
import InvestorLoginPage from '@/pages/InvestorLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminPage from '@/pages/AdminPage';
import ContentAdminPage from '@/pages/ContentAdminPage';

function Router() {
  const { route } = useApp();

  const renderPage = () => {
    if (route === '/' || route === '') return <HomePage />;
    if (route === '/investor-login') return <InvestorLoginPage />;
    if (route === '/dashboard') return <DashboardPage />;
    if (route === '/admin') return <AdminPage />;
    if (route === '/admin/content') return <ContentAdminPage />;
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
