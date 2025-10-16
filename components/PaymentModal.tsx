
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import Spinner from './Spinner';

interface PaymentModalProps {
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const { setPaid } = useAuth();
  const { t } = useI18n();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call to payment gateway
    setTimeout(() => {
      setPaid();
      setIsProcessing(false);
      setIsSuccess(true);
      // Close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center relative animate-[fade-in_0.3s]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" aria-label="Close modal">&times;</button>
        
        {isSuccess ? (
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{t('paymentSuccess')}</h3>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-gray-900">{t('modalTitle')}</h3>
            <p className="text-gray-600 my-4">{t('modalText')}</p>
            
            {isProcessing ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                    <Spinner />
                    <p>{t('paymentProcessing')}</p>
                </div>
            ) : (
              <div className="space-y-4 mt-6">
                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  {t('stripeButton')}
                </button>
                <button
                  onClick={handlePayment}
                  className="w-full bg-yellow-400 text-blue-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 transition duration-300"
                >
                  {t('paypalButton')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
