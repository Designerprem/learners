

import React, { useState } from 'react';
import { FEE_SUMMARY, PAYMENT_HISTORY } from '../../constants';
import type { PaymentHistoryItem } from '../../types';

const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: <svg viewBox="0 0 256 256" className="w-6 h-6 mr-2"><rect width="256" height="256" fill="none"></rect><path d="M172,120a44,44,0,1,1-44-44A44,44,0,0,1,172,120Zm-8,0a36,36,0,1,0-36,36A36,36,0,0,0,164,120Zm48,0a84,84,0,1,1-84-84A84.1,84.1,0,0,1,212,120Zm-8,0a76,76,0,1,0-76,76A76,76,0,0,0,204,120ZM44,212a84,84,0,0,1,84-84v8a76,76,0,0,0-76,76Z" fill="#60bb46"></path></svg> },
    { id: 'khalti', name: 'Khalti', icon: <svg viewBox="0 0 1024 1024" className="w-6 h-6 mr-2"><path d="M994.27 353.46c-20-7-42.3-1.8-55.3 15.6L552.42 811.45c-13 17.5-36.8 24.3-56.8 17.3l-360.2-126.3c-20-7-34.8-26.3-34.8-47.8V214.53c0-21.5 14.8-40.8 34.8-47.8l360.2-126.3c20-7 43.8-0.2 56.8 17.3l386.55 442.38c13 17.4 6.8 42.9-10.2 53.3z" fill="#5D2E8E"></path></svg> },
    { id: 'mobile-banking', name: 'Mobile Banking', icon: <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599.97M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01v-2.01M6 12a6 6 0 1112 0 6 6 0 01-12 0zm12 7a2 2 0 100-4 2 2 0 000 4z"></path></svg> },
    { id: 'connect-ips', name: 'ConnectIPS', icon: <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg> }
];

const PaymentInstructions = ({ method, amount, onConfirm, onCancel }: { method: string, amount: number, onConfirm: () => void, onCancel: () => void }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onConfirm();
            setIsProcessing(false);
        }, 2000);
    };
    
    const qrValue = `Payment for Learners Academy, Amount: NPR ${amount}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrValue)}`;

    const renderContent = () => {
        switch (method) {
            case 'esewa':
            case 'khalti':
                return (
                    <div className="text-center">
                        <p className="mb-2">Scan the QR code using your {method === 'esewa' ? 'eSewa' : 'Khalti'} app to pay.</p>
                        <img src={qrUrl} alt="QR Code for Payment" className="mx-auto my-4 border p-2 rounded-lg" />
                        <p><strong>Merchant:</strong> Reliant Learners Academy</p>
                        <p><strong>Amount:</strong> NPR {amount.toLocaleString()}</p>
                    </div>
                );
            case 'mobile-banking':
                return (
                    <div className="text-sm">
                        <p className="mb-4">Transfer the amount to the following bank account:</p>
                        <ul className="space-y-2 bg-gray-50 p-3 rounded-md">
                            <li><strong>Bank Name:</strong> Global IME Bank</li>
                            <li><strong>Account Name:</strong> Reliant Learners Academy Pvt. Ltd.</li>
                            <li><strong>Account Number:</strong> 01234567890123</li>
                            <li><strong>Amount:</strong> NPR {amount.toLocaleString()}</li>
                            <li><strong>Remarks:</strong> YourStudentID Fee Payment</li>
                        </ul>
                    </div>
                );
            case 'connect-ips':
                 return (
                    <div className="text-sm">
                        <p>Log in to your ConnectIPS portal and transfer the amount to our corporate account using the details provided under 'Mobile Banking'.</p>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div>
            <h3 className="text-xl font-bold text-brand-dark mb-4 capitalize">Pay with {method.replace('-', ' ')}</h3>
            <div className="p-4 border rounded-lg bg-white mb-4">
                {renderContent()}
            </div>
            <div className="space-y-2">
                <button onClick={handleConfirm} disabled={isProcessing} className="w-full bg-brand-red text-white py-3 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:bg-red-300">
                    {isProcessing ? 'Verifying Payment...' : 'Confirm Payment'}
                </button>
                 <button onClick={onCancel} className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-300 transition-colors">
                    Back
                </button>
            </div>
        </div>
    );
};

const PaymentAuth = ({ onAuthenticated, onCancel }: { onAuthenticated: () => void; onCancel: () => void; }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (password === 'password') { // Use mock password
                onAuthenticated();
            } else {
                setError('Incorrect password. Please try again.');
            }
            setIsLoading(false);
            setPassword('');
        }, 1000);
    };
    
    return (
        <div>
            <div className="text-center border-b pb-4 mb-4">
                 <svg className="w-12 h-12 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <h2 className="text-xl font-bold text-brand-dark mt-2">Verification Required</h2>
                <p className="text-sm text-gray-600">For your security, please re-enter your password to proceed with the payment.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="space-y-2">
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-dark text-white py-2 px-4 rounded-md font-semibold hover:bg-black transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Verifying...' : 'Authorize Payment'}
                    </button>
                    <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-300 transition-colors">
                        Choose Different Method
                    </button>
                </div>
            </form>
        </div>
    );
};


const FeePayment: React.FC = () => {
    const [feeSummary, setFeeSummary] = useState(FEE_SUMMARY);
    const [paymentHistory, setPaymentHistory] = useState(PAYMENT_HISTORY);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isPaymentAuthenticated, setIsPaymentAuthenticated] = useState(false);


    const handlePaymentSuccess = () => {
        const amount = feeSummary.outstandingBalance;
        const newPayment: PaymentHistoryItem = {
            invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString().split('T')[0],
            amount,
            status: 'Paid'
        };
        setPaymentHistory([newPayment, ...paymentHistory]);
        setFeeSummary(prev => ({ ...prev, outstandingBalance: 0, lastPaymentAmount: amount, lastPaymentDate: newPayment.date }));
        setSelectedMethod(null);
        setPaymentSuccess(true);
        setIsPaymentAuthenticated(false); // Reset auth after successful payment
        setTimeout(() => setPaymentSuccess(false), 5000);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-8">Fee Payment</h1>

            {paymentSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-800 border-l-4 border-green-500 rounded-r-md" role="alert">
                    <p className="font-bold">Payment Verified!</p>
                    <p>Your payment has been successfully recorded. Thank you.</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fee Summary & Payment */}
                <div className="lg:col-span-1">
                     <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-bold text-brand-dark mb-4">Current Status</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Outstanding Balance</p>
                                <p className={`text-3xl font-bold ${feeSummary.outstandingBalance > 0 ? 'text-brand-red' : 'text-green-600'}`}>
                                    NPR {feeSummary.outstandingBalance.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Due Date</p>
                                <p className="font-semibold">{feeSummary.dueDate}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-500">Last Payment</p>
                                <p className="font-semibold">NPR {feeSummary.lastPaymentAmount.toLocaleString()} on {feeSummary.lastPaymentDate}</p>
                            </div>
                        </div>
                    </div>

                    {feeSummary.outstandingBalance > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                           {!selectedMethod ? (
                                // Step 1: Choose Method
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-4">Choose Payment Method</h3>
                                    <div className="space-y-3">
                                        {paymentMethods.map(method => (
                                            <button 
                                                key={method.id} 
                                                onClick={() => setSelectedMethod(method.id)}
                                                className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border"
                                            >
                                                {method.icon}
                                                <span className="font-semibold">{method.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : !isPaymentAuthenticated ? (
                                // Step 2: Authenticate
                                <PaymentAuth
                                    onAuthenticated={() => setIsPaymentAuthenticated(true)}
                                    onCancel={() => setSelectedMethod(null)}
                                />
                            ) : (
                                // Step 3: Show Instructions
                                <PaymentInstructions
                                    method={selectedMethod}
                                    amount={feeSummary.outstandingBalance}
                                    onConfirm={handlePaymentSuccess}
                                    onCancel={() => {
                                        setSelectedMethod(null);
                                        setIsPaymentAuthenticated(false);
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Payment History */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-brand-dark mb-4">Payment History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase">Invoice ID</th>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase">Date</th>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase text-right">Amount (NPR)</th>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {paymentHistory.map(item => (
                                        <tr key={item.invoiceId} className="hover:bg-gray-50">
                                            <td className="p-3 font-mono text-sm">{item.invoiceId}</td>
                                            <td className="p-3 text-sm">{item.date}</td>
                                            <td className="p-3 text-right font-mono text-sm">{item.amount.toLocaleString()}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                                    item.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeePayment;