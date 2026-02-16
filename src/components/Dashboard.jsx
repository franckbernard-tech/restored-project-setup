import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import Status from './Status';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [n8nStatus, setN8nStatus] = useState({ online: false, message: 'Serveur n8n hors ligne' });

  const RSS_URL = "https://blocktrends.fr/feed/";
  const API_URL = "https://arrangements-pubmed-combine-parent.trycloudflare.com/webhook/veille-ia";

  const fetchNews = async () => {
    try {
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        const formattedArticles = data.items.map((item, index) => ({
          id: index,
          title: item.title,
          description: item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + "...",
          url: item.link,
          date: item.pubDate
        }));
        setArticles(formattedArticles);
        localStorage.setItem('cached_articles', JSON.stringify(formattedArticles));
      }
    } catch (error) {
      console.error("Erreur RSS:", error);
      const cached = localStorage.getItem('cached_articles');
      if (cached) setArticles(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  const syncWithWebhook = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Forced sync from dashboard' })
      });

      if (response.ok) {
        setIsConnected(true);
        setN8nStatus({ online: true, message: 'Connecté à n8n' });
        alert('Synchronization successful!');
      } else {
        setIsConnected(false);
        setN8nStatus({ online: false, message: 'Serveur n8n hors ligne' });
        alert('Synchronization failed.');
      }
    } catch (error) {
      console.error("Erreur Webhook:", error);
      setIsConnected(false);
      setN8nStatus({ online: false, message: 'Serveur n8n hors ligne' });
      alert('Webhook call failed.');
    }
  };

  useEffect(() => {
    fetchNews();
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
          style={{
            padding: '8px 16px',
            backgroundColor: '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Synchro n8n <span role="img" aria-label="refresh">🔄</span>
        </button>
      </div>
      
      {loading ? (
        <p style={{textAlign: 'center'}}>Chargement du flux neural...</p>
      ) : (
        <div className="article-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <h2>{article.title}</h2>
              <p style={{fontSize: '0.9em', color: '#ccc'}}>{article.date}</p>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">LIRE →</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
