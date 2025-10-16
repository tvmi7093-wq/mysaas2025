
import React from 'react';
import { Recipe } from '../types';
import { useI18n } from '../contexts/I18nContext';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { t, language } = useI18n();

  return (
    <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-beige-100 transition-all duration-500 ease-in-out transform animate-[fade-in_1s] ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <h2 className="text-3xl font-bold text-soft-orange-700 mb-6 text-center">{recipe.title}</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-xl font-semibold text-sage-green-700 mb-3 border-b-2 border-sage-green-500 pb-2">{t('ingredients')}</h3>
          <ul className="space-y-2 text-brand-text list-disc list-inside ps-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-sage-green-700 mb-3 border-b-2 border-sage-green-500 pb-2">{t('steps')}</h3>
          <ol className="space-y-4 text-brand-text list-decimal list-inside">
            {recipe.steps.map((step, index) => (
              <li key={index} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
