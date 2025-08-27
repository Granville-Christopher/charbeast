import React, { useState } from 'react';
import { PlusCircle, List, DollarSign, Gift, Trash2 } from 'lucide-react';
import axios from "axios";

// Define the data structures with TypeScript interfaces for clarity and type safety.
// This is the data for crypto wallets you upload to the dashboard.
interface UploadedCrypto {
    id: number;
    network: string;
    currency: string;
    wallet: string;
    qrCodeUrl: string;
}

// This is the data for crypto donations received.
interface CryptoDonation {
    id: number;
    amount: string;
    proofUrl: string;
}

// This is the data for gift card donations received.
interface GiftcardDonation {
    id: number;
    amount: string;
    country: string;
    type: string;
    proofUrls: string[];
}

// Define the props for each component to prevent implicit 'any' type errors.
interface CryptoUploadSectionProps {
    setUploadedCrypto: React.Dispatch<React.SetStateAction<UploadedCrypto[]>>;
}

interface UploadedCryptoSectionProps {
    uploadedCrypto: UploadedCrypto[];
    handleDeleteCrypto: (id: number) => void;
}

interface DonatedCryptoSectionProps {
    cryptoDonations: CryptoDonation[];
}

interface DonatedGiftcardSectionProps {
    giftcardDonations: GiftcardDonation[];
}

// Main App component that manages the dashboard layout and state
function App() {
    const [activeSection, setActiveSection] = useState<'upload-crypto' | 'uploaded-crypto' | 'crypto-donations' | 'giftcard-donations'>('upload-crypto');

    // Mock data for demonstration purposes, explicitly typed.
    const [uploadedCrypto, setUploadedCrypto] = useState<UploadedCrypto[]>([
        { id: 1, network: 'Ethereum', currency: 'ETH', wallet: '0x123...abc', qrCodeUrl: 'https://placehold.co/100x100' },
        { id: 2, network: 'Bitcoin', currency: 'BTC', wallet: 'bc1q2...xyz', qrCodeUrl: 'https://placehold.co/100x100' },
    ]);

    const [cryptoDonations ] = useState<CryptoDonation[]>([
        { id: 1, amount: '0.05 BTC', proofUrl: 'https://placehold.co/400x300/e9d5ff/8b5cf6?text=Proof+Image' },
        { id: 2, amount: '2.5 ETH', proofUrl: 'https://placehold.co/400x300/e0e7ff/3b82f6?text=Proof+Image' },
    ]);

    const [giftcardDonations] = useState<GiftcardDonation[]>([
        {
            id: 1,
            amount: '$50',
            country: 'USA',
            type: 'Amazon',
            proofUrls: [
                'https://placehold.co/400x300/dbeafe/1d4ed8?text=Image+1',
                'https://placehold.co/400x300/dbeafe/1d4ed8?text=Image+2',
                'https://placehold.co/400x300/dbeafe/1d4ed8?text=Image+3'
            ]
        },
        {
            id: 2,
            amount: '$100',
            country: 'UK',
            type: 'Steam',
            proofUrls: [
                'https://placehold.co/400x300/dcfce7/16a34a?text=Image+A',
                'https://placehold.co/400x300/dcfce7/16a34a?text=Image+B'
            ]
        },
    ]);

    const handleDeleteCrypto = (id: number) => {
        // Filter out the crypto with the matching id
        setUploadedCrypto(prev => prev.filter(crypto => crypto.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
            <header className="bg-white rounded-xl shadow-lg p-6 mb-6 fixed left-0 right-0 top-0 z-50">
                <h1 className="text-3xl font-extrabold text-blue-800 text-center md:text-left">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2 text-center md:text-left">Manage crypto details and view donations</p>

                <div className="flex flex-wrap justify-center md:justify-start mt-6 space-x-2 md:space-x-4 gap-3">
                    <button
                        onClick={() => setActiveSection('upload-crypto')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${activeSection === 'upload-crypto' ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <PlusCircle size={20} />
                        <span className="font-medium">Upload Crypto</span>
                    </button>
                    <button
                        onClick={() => setActiveSection('uploaded-crypto')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${activeSection === 'uploaded-crypto' ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <List size={20} />
                        <span className="font-medium">View Crypto</span>
                    </button>
                    <button
                        onClick={() => setActiveSection('crypto-donations')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${activeSection === 'crypto-donations' ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <DollarSign size={20} />
                        <span className="font-medium">Crypto Donations</span>
                    </button>
                    <button
                        onClick={() => setActiveSection('giftcard-donations')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${activeSection === 'giftcard-donations' ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <Gift size={20} />
                        <span className="font-medium">Giftcard Donations</span>
                    </button>
                </div>
            </header>

            <main className="bg-white rounded-xl shadow-lg p-6 mt-72 md:mt-40">
                {activeSection === 'upload-crypto' && <CryptoUploadSection setUploadedCrypto={setUploadedCrypto} />}
                {activeSection === 'uploaded-crypto' && <UploadedCryptoSection uploadedCrypto={uploadedCrypto} handleDeleteCrypto={handleDeleteCrypto} />}
                {activeSection === 'crypto-donations' && <DonatedCryptoSection cryptoDonations={cryptoDonations} />}
                {activeSection === 'giftcard-donations' && <DonatedGiftcardSection giftcardDonations={giftcardDonations} />}
            </main>
        </div>
    );
}

// Section to upload new crypto details
function CryptoUploadSection({ setUploadedCrypto }: CryptoUploadSectionProps) {
    const [network, setNetwork] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [wallet, setWallet] = useState<string>('');
    const [qrCode, setQrCode] = useState<File | null>(null);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!qrCode) return;

        const formData = new FormData();
        formData.append("network", network);
        formData.append("cryptocurrency", currency);
        formData.append("walletaddress", wallet);
        formData.append("qrcode", qrCode);

        try {
            const response = await axios.post("http://localhost:5000/secure/admin/cryptoupload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            // const response = await axios.post("https://mrbeastbknd-production.up.railway.app/secure/admin/cryptoupload", formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            //     withCredentials: true,
            // });

            const newCrypto: UploadedCrypto = {
                id: Date.now(),
                network,
                currency,
                wallet,
                qrCodeUrl: URL.createObjectURL(qrCode),
            };

            setUploadedCrypto((prev: UploadedCrypto[]) => [...prev, newCrypto]);

            setNetwork('');
            setCurrency('');
            setWallet('');
            setQrCode(null);

            if (response.status === 201) {
                alert('Crypto details uploaded to backend! (Check "View Crypto" tab)');
            }

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload crypto details. Please try again.");
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setQrCode(e.target.files[0]);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Crypto Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Network</label>
                    <input
                        type="text"
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        required
                        name='network'
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Crypto Currency</label>
                    <input
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                        name='cryptocurrency'
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                    <input
                        type="text"
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        required
                        name="walletaddress"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">QR Code (Image)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        name='qrcode'
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

// Section to display uploaded crypto details
function UploadedCryptoSection({ uploadedCrypto, handleDeleteCrypto }: UploadedCryptoSectionProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Uploaded Crypto Details</h2>
            <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full bg-white rounded-xl shadow-md">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Network</th>
                            <th className="py-3 px-6 text-left">Currency</th>
                            <th className="py-3 px-6 text-left">Wallet Address</th>
                            <th className="py-3 px-6 text-center">QR Code</th>
                            <th className="py-3 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {uploadedCrypto.map((crypto: UploadedCrypto) => (
                            <tr key={crypto.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{crypto.network}</td>
                                <td className="py-3 px-6 text-left">{crypto.currency}</td>
                                <td className="py-3 px-6 text-left">{crypto.wallet}</td>
                                <td className="py-3 px-6 text-center">
                                    <img src={crypto.qrCodeUrl} alt="QR Code" className="w-16 h-16 mx-auto rounded-lg" />
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        onClick={() => handleDeleteCrypto(crypto.id)}
                                        className="flex items-center justify-center p-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition-all duration-200"
                                        title="Delete Wallet"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {uploadedCrypto.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">
                                    No crypto details have been uploaded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Section to display donated crypto (with proof)
function DonatedCryptoSection({ cryptoDonations }: DonatedCryptoSectionProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Crypto Donations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cryptoDonations.map((donation: CryptoDonation) => (
                    <div key={donation.id} className="bg-gray-50 rounded-xl shadow-md p-4">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">Amount: <span className="text-green-600">{donation.amount}</span></h3>
                        <div className="w-full h-48 rounded-md overflow-hidden shadow-sm">
                            <img src={donation.proofUrl} alt="Donation Proof" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-gray-500 text-sm mt-2">Proof of donation.</p>
                    </div>
                ))}
                {cryptoDonations.length === 0 && (
                    <div className="text-center col-span-full py-6 text-gray-500">
                        No crypto donations have been received yet.
                    </div>
                )}
            </div>
        </div>
    );
}

// Section to display donated gift cards
function DonatedGiftcardSection({ giftcardDonations }: DonatedGiftcardSectionProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Giftcard Donations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {giftcardDonations.map((donation: GiftcardDonation) => (
                    <div key={donation.id} className="bg-gray-50 rounded-xl shadow-md p-4">
                        <div className="mb-2">
                            <h3 className="font-semibold text-lg text-gray-800">Type: <span className="text-purple-600">{donation.type}</span></h3>
                            <p className="text-gray-500">Amount: <span className="font-medium">{donation.amount}</span></p>
                            <p className="text-gray-500">Country: <span className="font-medium">{donation.country}</span></p>
                        </div>

                        <div className="relative w-full overflow-x-auto whitespace-nowrap rounded-md shadow-sm border border-gray-200 p-2">
                            <div className="inline-flex space-x-2">
                                {donation.proofUrls.map((url: string, index: number) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Giftcard proof ${index + 1}`}
                                        className="w-56 h-auto flex-shrink-0 rounded-md object-contain"
                                    />
                                ))}
                                {donation.proofUrls.length > 0 && (
                                    <div className="flex items-center justify-center text-gray-400 p-4">
                                        <p className="font-semibold">{donation.proofUrls.length} image(s)</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {giftcardDonations.length === 0 && (
                    <div className="text-center col-span-full py-6 text-gray-500">
                        No giftcard donations have been received yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
