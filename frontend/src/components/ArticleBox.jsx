import { useEffect, useState } from "react";
import api from "../services/api";

export default function ArticleBox() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const res = await api.get("/articles");
    setArticles(res.data);
  };

  return (
  <div>
    <h3>Helpful Articles</h3>

    {articles.map(a => (
      <div key={a.article_id} style={{
        background:"#f8fafc",
        padding:12,
        borderRadius:10,
        marginBottom:10
      }}>
        <h4>{a.title}</h4>
        <p>{a.content}</p>
      </div>
    ))}
  </div>
);

}
