import {
  Calendar,
  Eye,
  Heart,
  Shield,
  Tag,
  ThumbsDown,
  User,
} from "lucide-react";
import { useState } from "react";
import { type ArticleResponseDTO } from "../types/article";
import { useNavigate } from "react-router-dom";
import { articleInteraction } from "../services/userService";
import { toast } from "react-toastify";

interface ArticleCardProps {
  article: ArticleResponseDTO;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [userInteraction, setUserInteraction] = useState<string | null>(() => {
    if (article.userInteraction?.like) return "like";
    if (article.userInteraction?.dislike) return "dislike";
    return null;
  });

  const [likes, setLikes] = useState(article.stats.likes); //
  const [dislikes, setDislikes] = useState(article.stats.dislikes); //

  const navigate = useNavigate();

  const handleLike = async () => {
    const isLiked = userInteraction === "like";
    const action = isLiked ? "remove" : "add";

    try {
      await articleInteraction({
        articleId: article.id,
        type: "like",
        action,
      });

      if (isLiked) {
        setLikes((prev) => prev - 1);
        setUserInteraction(null);
      } else {
        setLikes((prev) => prev + 1);
        if (userInteraction === "dislike") {
          setDislikes((prev) => prev - 1);
        }
        setUserInteraction("like");
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to update like!");
    }
  };

  const handleDislike = async () => {
    const isDisliked = userInteraction === "dislike";
    const action = isDisliked ? "remove" : "add";

    try {
      await articleInteraction({
        articleId: article.id,
        type: "dislike",
        action,
      });

      if (isDisliked) {
        setDislikes((prev) => prev - 1);
        setUserInteraction(null);
      } else {
        setDislikes((prev) => prev + 1);
        if (userInteraction === "like") {
          setLikes((prev) => prev - 1);
        }
        setUserInteraction("dislike");
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to update dislike!");
    }
  };

  const handleBlock = async () => {
    try {
      await articleInteraction({
        articleId: article.id,
        type: "block",
        action: "add",
      });

      toast.success("Article blocked successfully");
    } catch (error) {
      console.log(error);

      toast.error("Failed to block article!");
    }
  };

  const handleView = () => {
    console.log("hiii");

    navigate(`/view-detail/${article.id}`, { state: { article } });
  };

  const cleanDescription = article.description.replace(/<[^>]+>/g, "");

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* 🆕 Use first image safely */}
      {article.images.length > 0 && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.images[0]}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {article.category.name}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>

        <div className="prose prose-blue max-w-none text-gray-800 line-clamp-3">
          <p>{cleanDescription}</p>
        </div>
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center mb-4">
          {article.author.profileImage ? (
            <img
              src={article.author.profileImage}
              alt={article.author.firstName}
              className="w-6 h-6 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          )}
          <span className="text-sm text-gray-600">
            By {article.author.firstName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                userInteraction === "like"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  userInteraction === "like" ? "fill-current" : ""
                }`}
              />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                userInteraction === "dislike"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
              }`}
            >
              <ThumbsDown
                className={`w-4 h-4 ${
                  userInteraction === "dislike" ? "fill-current" : ""
                }`}
              />
              <span>{dislikes}</span>
            </button>

            <button
              onClick={handleBlock}
              className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleView}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Read More..</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
