import { AppProvider, useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PortalHeader from '@/components/portal/PortalHeader';
import AdminPortalPage from '@/pages/AdminPortalPage';
import HomePage from '@/pages/HomePage';
import InvestorLoginPage from '@/pages/InvestorLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminPage from '@/pages/AdminPage';
import ContentAdminPage from '@/pages/ContentAdminPage';

const PORTAL_ROUTES = ['/investor-login', '/dashboard'];

function Router() {
  const { route } = useApp();

  const renderPage = () => {
    if (route === '/' || route === '') return <HomePage />;
    if (route === '/investor-login') return <InvestorLoginPage />;
    if (route === '/dashboard') return <DashboardPage />;
    if (route === '/admin') return <AdminPage />;
    if (route === '/admin/content') return <ContentAdminPage />;
    if (route === '/admin/portal') return <AdminPortalPage />;
    return <HomePage />;
  };

  if (PORTAL_ROUTES.includes(route)) {
    return (
      <div className="portal-theme min-h-screen flex flex-col">
        <PortalHeader showLogout={route === '/dashboard'} />
        <main className="flex-1">{renderPage()}</main>
      </div>
    );
  }

  return (
    <div className="site-light min-h-screen flex flex-col">
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
