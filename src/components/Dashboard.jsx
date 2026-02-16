import React, { useState, useEffect } from 'react';
import Status from './Status';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [n8nStatus, setN8nStatus] = useState({ online: false, message: 'Serveur n8n hors ligne' });

  const API_URL = "https://arrangements-pubmed-combine-parent.trycloudflare.com/webhook/veille-ia";

  const syncWithWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: 'Sync from dashboard' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Données reçues:', data);

      const signals = data.top_signals || [];
      setArticles(signals);
      localStorage.setItem('cached_articles', JSON.stringify(signals));

      setIsConnected(true);
      setN8nStatus({ online: true, message: `Connecté — ${signals.length} signaux` });
    } catch (error) {
      console.error("Erreur Webhook:", error);
      setIsConnected(false);
      setN8nStatus({ online: false, message: 'Serveur n8n hors ligne' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncWithWebhook();
  }, []);

  return (
    <div>
      <h1>IA Veille Dashboard</h1>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <Status isConnected={isConnected} onSync={syncWithWebhook} n8nStatus={n8nStatus} />
        <button
          onClick={syncWithWebhook}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#6b7280' : '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Chargement...' : 'Synchro n8n 🔄'}
        </button>
      </div>
      
      {loading && articles.length === 0 ? (
        <p style={{textAlign: 'center'}}>Chargement du flux neural...</p>
      ) : articles.length === 0 ? (
        <p style={{textAlign: 'center', color: '#9ca3af'}}>Aucune donnée. Cliquez sur Synchro n8n.</p>
      ) : (
        <div className="article-grid">
          {articles.map((article, index) => (
            <div key={index} className="article-card">
              <h2>{article.title}</h2>
              {article.score && (
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75em',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: article.score >= 8 ? '#ef4444' : article.score >= 5 ? '#f97316' : '#6b7280',
                  marginRight: '8px'
                }}>
                  {article.score}/10
                </span>
              )}
              {article.tag && (
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75em',
                  color: '#a78bfa',
                  border: '1px solid #a78bfa'
                }}>
                  {article.tag}
                </span>
              )}
              <p style={{fontSize: '0.9em', color: '#ccc', marginTop: '8px'}}>
                {article.summary || article.description || ''}
              </p>
              {(article.link || article.url) && (
                <a href={article.link || article.url} target="_blank" rel="noopener noreferrer">LIRE →</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
