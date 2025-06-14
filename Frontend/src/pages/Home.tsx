import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import ArticleCard from "../components/ArticleCard ";
import type { ArticleResponseDTO } from "../types/article";
import { fetchArticles, getIntractions } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [articles, setArticles] = useState<ArticleResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // error state
  const [page, setPage] = useState(1); //  current page
  const [totalPages, setTotalPages] = useState(1); //  total pages

  const navigate = useNavigate();

  
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchArticles(page, 10);

      console.log("==>", response.data);

      if (response.data) {
        const fetchedArticles = response.data.articles;
        setArticles(fetchedArticles);
        setTotalPages(response.data.totalPages);

        console.log("%%%", fetchedArticles);

        const articleIds = fetchedArticles.map((a) => a.id);
        console.log("***", articleIds);

        const interactionRes = await getIntractions({ articleIds });

        if (interactionRes.success && interactionRes?.data?.data) {
          const interactions = interactionRes?.data.data;

          const updatedArticles = fetchedArticles.map((article) => {
            const foundInteraction = interactions.find(
              (i) => i.articleId === article.id
            );

            return {
              ...article,
              userInteraction: foundInteraction
                ? {
                    like: foundInteraction.like,
                    dislike: foundInteraction.dislike,
                    block: foundInteraction.block,
                  }
                : { like: false, dislike: false, block: false },
            };
          });

          setArticles(updatedArticles);
        }
      } else {
        setError("Failed to load articles.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600">
            Discover articles tailored to your interests
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/create-article")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
             
            />
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new content.
            </p>
          </div>
        )}

        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
