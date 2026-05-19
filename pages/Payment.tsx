import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { type, item, details, total } = location.state || {};
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  const fillMockData = () => {
    setFormData({
      cardHolder: 'TEST USER',
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/28',
      cvc: '123',
      email: 'test@tripwise.pk',
      address: '123 Mock Street, F-7/2',
      city: 'Islamabad',
      zip: '44000'
    });
  };

  if (!item || !total) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Session Expired</h2>
                <p className="text-gray-500 mb-6">No booking details found. Please start your booking again.</p>
                <button onClick={() => navigate('/')} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">
                    Return Home
                </button>
            </div>
        </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
        const formatted = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').match(/\d{4,16}/g)?.[0]?.match(/.{1,4}/g)?.join(' ') || value.replace(/\D/g, '').slice(0, 16);
        setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiry') {
        let v = value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = `${v.slice(0,2)}/${v.slice(2)}`;
        setFormData(prev => ({ ...prev, [name]: v }));
    } else if (name === 'cvc') {
        setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 3) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment gateway latency
    setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        setTimeout(() => {
            navigate('/');
        }, 4000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm shadow-md">🔒</span>
                Secure Checkout
            </h1>
            <div className="flex items-center gap-3">
                 <button 
                   type="button" 
                   onClick={fillMockData}
                   className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 border border-emerald-200 shadow-sm transition-all"
                 >
                   ⚡ Fill Test Data
                 </button>
                 <div className="flex gap-1 opacity-70">
                    {/* Mock Visa/Mastercard Icons */}
                    <div className="h-6 w-10 bg-white rounded border flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full opacity-80"></div>
                    </div>
                    <div className="h-6 w-10 bg-white rounded border flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80 -ml-1"></div>
                    </div>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
                
                <form id="payment-form" onSubmit={handlePayment} className="space-y-6">
                    {/* Billing Info */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">1</span>
                            Billing Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="receipt@example.com"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                                <input 
                                    type="text" 
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="123 Street Name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="Islamabad"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zip / Postal Code</label>
                                <input 
                                    type="text" 
                                    name="zip"
                                    required
                                    value={formData.zip}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="44000"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Card Info */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">2</span>
                            Payment Method
                        </h2>
                        
                        <div className="mb-4 flex gap-2">
                             <div className="border rounded px-2 py-1 flex items-center bg-blue-50 border-blue-100">
                                <div className="w-2 h-2 rounded-full bg-blue-600 mr-1"></div>
                                <span className="text-xs font-bold text-blue-800">Credit Card</span>
                             </div>
                             <div className="border rounded px-2 py-1 flex items-center opacity-50 grayscale">
                                <span className="text-xs">PayPal</span>
                             </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Holder Name</label>
                                <input 
                                    type="text" 
                                    name="cardHolder"
                                    required
                                    value={formData.cardHolder}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="ALI KHAN"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="cardNumber"
                                        required
                                        maxLength={19}
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-200 rounded-lg pl-12 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono placeholder:text-gray-300"
                                        placeholder="0000 0000 0000 0000"
                                    />
                                    <div className="absolute left-3 top-2.5">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    </div>
                                    <div className="absolute right-3 top-3 flex gap-1 pointer-events-none">
                                        <div className="w-8 h-5 bg-gray-100 rounded border flex items-center justify-center">
                                            <div className="w-4 h-2 bg-blue-500/50 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                                    <input 
                                        type="text" 
                                        name="expiry"
                                        required
                                        maxLength={5}
                                        value={formData.expiry}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-center placeholder:text-gray-300"
                                        placeholder="MM/YY"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC / CVV</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            name="cvc"
                                            required
                                            maxLength={3}
                                            value={formData.cvc}
                                            onChange={handleChange}
                                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-center placeholder:text-gray-300"
                                            placeholder="123"
                                        />
                                        <div className="absolute right-3 top-2.5 text-gray-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </form>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Payments are secure and encrypted.
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-4 overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-800">Order Summary</h3>
                    </div>
                    <div className="p-6">
                        <div className="flex gap-3 mb-6">
                            <img src={item.imageUrl} alt="item" className="w-16 h-16 rounded object-cover shadow-sm bg-gray-200" />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 truncate">{item.name || item.model}</h4>
                                <p className="text-xs text-gray-500 capitalize">{type}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                            {type === 'trip' && (
                                <>
                                    <div className="flex justify-between"><span>Guests</span><span className="font-medium text-gray-900">{details.guests}</span></div>
                                    <div className="flex justify-between"><span>Duration</span><span className="font-medium text-gray-900">{details.days} Days</span></div>
                                    <div className="flex justify-between"><span>Date</span><span className="font-medium text-gray-900">{details.date}</span></div>
                                </>
                            )}
                            {type === 'hotel' && (
                                <>
                                    <div className="flex justify-between"><span>Guests</span><span className="font-medium text-gray-900">{details.guests}</span></div>
                                    <div className="flex justify-between"><span>Check-in</span><span className="font-medium text-gray-900">{details.date}</span></div>
                                </>
                            )}
                            {type === 'car' && (
                                <>
                                    <div className="flex justify-between"><span>Days</span><span className="font-medium text-gray-900">{details.days}</span></div>
                                    <div className="flex justify-between"><span>Pickup</span><span className="font-medium text-gray-900">{details.date}</span></div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600">Total to Pay</span>
                            <span className="text-2xl font-extrabold text-emerald-700">PKR {total.toLocaleString()}</span>
                        </div>

                        <button 
                            type="submit"
                            form="payment-form"
                            disabled={isProcessing}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                   Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    Pay Now
                                </>
                            )}
                        </button>
                        <div className="mt-4 flex justify-center gap-4 opacity-50">
                             <div className="h-4 w-8 bg-gray-200 rounded border"></div>
                             <div className="h-4 w-8 bg-gray-200 rounded border"></div>
                             <div className="h-4 w-8 bg-gray-200 rounded border"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <motion.svg 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                    <p className="text-gray-500 mb-6">Your transaction ID is <span className="font-mono text-gray-700">TXN-{Math.floor(Math.random()*1000000)}</span>. Check your email for the receipt.</p>
                    <div className="text-sm text-emerald-600 font-bold">Redirecting to Home...</div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};