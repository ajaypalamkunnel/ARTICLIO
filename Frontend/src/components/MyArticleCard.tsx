import { Eye, Pencil } from "lucide-react";
import type { ArticleResponseDTO } from "../types/article";
import { dateFormatter } from "../utils/dateFormatter";
import { useNavigate } from "react-router-dom";

const MyArticleCard: React.FC<{
  article: ArticleResponseDTO;
  onViewMore: (article: ArticleResponseDTO) => void;
}> = ({ article, onViewMore }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
          {article.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {dateFormatter(article.createdAt)}
        </span>
        <button
          onClick={() => navigate(`/edit-article/${article.id}`)}
          className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={() => onViewMore(article)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          View More
        </button>
      </div>
    </div>
  );
};

export default MyArticleCard;
