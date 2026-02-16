import React from 'react';

function ArticleCard({ article }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all mb-4">
      <h2 className="text-xl font-bold text-white mb-2">{article.title}</h2>
      <p className="text-gray-300 mb-4 text-sm">
        {article.content || article.description || "Pas de description."}
      </p>
      {article.url && (
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 font-semibold uppercase text-xs tracking-wider"
        >
          Lire l'article →
        </a>
      )}
    </div>
  );
}

export default ArticleCard;
