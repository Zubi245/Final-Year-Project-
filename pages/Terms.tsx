import React from 'react';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-700">
        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing TripWise Pakistan, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Booking & Payments</h2>
            <p>All bookings made through our platform are subject to availability. Prices are mock values for demonstration purposes. In a real scenario, payments are processed securely.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. User Conduct</h2>
            <p>Users must use the community features responsibly. Hate speech, harassment, or spam will result in immediate account termination.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Disclaimer</h2>
            <p>This application is a portfolio project. All data regarding hotels, cars, and prices is simulated and should not be treated as real-world offers.</p>
        </section>

        <div className="pt-6 border-t mt-6 text-sm text-gray-500">
            Last updated: October 2025
            BY : Hammad Shah
        </div>
      </div>
    </div>
  );
};
