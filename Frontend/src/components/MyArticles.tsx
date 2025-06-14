import { useState } from "react";
import ArticleDetailView from "./ArticleDetailView";
import type { ArticleResponseDTO } from "../types/article";
import MyArticleCard from "./MyArticleCard";


const MyArticlesPage: React.FC<{
  articles: ArticleResponseDTO[];
}> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleResponseDTO | null>(null);

  if (selectedArticle) {
    return (
      <ArticleDetailView
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">My Articles</h2>
        <p className="text-gray-600">Manage and view your published articles</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map((article) => (
          <MyArticleCard
            key={article.id}
            article={article}
            onViewMore={setSelectedArticle}
          />
        ))}
      </div>
    </div>
  );
};

export default MyArticlesPage