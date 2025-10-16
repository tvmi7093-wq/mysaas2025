
import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { Recipe, Language } from '../types';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import PaymentModal from '../components/PaymentModal';
import { geminiService } from '../services/geminiService';

const HomePage: React.FC = () => {
  const { user, incrementGenerations } = useAuth();
  const { t, language } = useI18n();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setRecipe(null);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the header: 'data:image/png;base64,'
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = useCallback(async () => {
    if (!imageFile || !user) return;

    if (user.generations >= 3 && !user.isPaid) {
      setShowPaymentModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
        const base64Data = await fileToBase64(imageFile);
        const generatedRecipe = await geminiService.generateRecipe(base64Data, imageFile.type, language);
        setRecipe(generatedRecipe);
        incrementGenerations();
    } catch (e: any) {
        if (e.message.includes("invalid format")) {
            setError(t('errorInvalidJson'));
        } else {
            setError(e.message || t('errorGeneric'));
        }
    } finally {
        setIsLoading(false);
    }
  }, [imageFile, user, language, incrementGenerations, t]);

  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} />}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2">{t('uploadTitle')}</h1>
          <p className="text-lg text-gray-600 mb-8">{t('uploadSubtitle')}</p>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-beige-100">
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6 bg-beige-50 overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Food preview" className="object-cover w-full h-full" />
              ) : (
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="mt-2">{t('uploadButton')}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <label htmlFor="file-upload" className="cursor-pointer bg-white text-soft-orange-700 border border-soft-orange-500 font-semibold py-2 px-6 rounded-lg hover:bg-soft-orange-500 hover:text-white transition duration-300">
                    {t('uploadButton')}
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                <button
                    onClick={handleGenerate}
                    disabled={!imageFile || isLoading}
                    className="w-full sm:w-auto bg-sage-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-sage-green-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <Spinner /> : <span>{t('generateButton')}</span>}
                </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto">
            {isLoading && (
              <div className="text-center">
                <p className="text-lg text-gray-600">{t('generating')}</p>
              </div>
            )}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}
            {recipe && <RecipeCard recipe={recipe} />}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
