"use client";

import { Provider } from 'react-redux';
import { AuthProvider } from '@/lib/authContext';
import store from '@/lib/redux/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '../app/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
         <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" defer></script>
      </head>
      <body className="min-h-screen flex flex-col">
        <Provider store={store}>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}