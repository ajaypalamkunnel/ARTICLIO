import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Tag, 
  ThumbsDown, 
  User,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import type { ArticleResponseDTO } from "../types/article";
import { useLocation, useNavigate } from "react-router-dom";



interface ArticleDetailPageProps {

  onBack?: () => void;
}

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ onBack }) => {
  const [userInteraction, setUserInteraction] = useState<string | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();

  const article = location.state?.article as ArticleResponseDTO;

  const handleLike = () => {
    if (userInteraction === "like") {
      setUserInteraction(null);
    } else {
      setUserInteraction("like");
    }
  };

  const handleDislike = () => {
    if (userInteraction === "dislike") {
      setUserInteraction(null);
    } else {
      setUserInteraction("dislike");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Article not found.</div>
      </div>
    );
  }

  


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={()=>navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Articles</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article header */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          {/* Hero image */}
          <div className="aspect-video w-full overflow-hidden relative">
            <img
              src={article.images[0]}
              alt={article.title}
              className={`w-full h-full object-cover cursor-pointer transition-transform duration-300 ${
                isImageExpanded ? 'scale-105' : 'hover:scale-105'
              }`}
              onClick={() => setIsImageExpanded(!isImageExpanded)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            {/* Category and metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {article.category.name}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
            
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {article.description}
            </p>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {article.author.profileImage ? (
                  <img
                    src={article.author.profileImage}
                    alt={`${article.author.firstName}`}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {article.author.firstName} 
                  </p>
                  <p className="text-sm text-gray-600">Author</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex items-center mb-6">
            <BookOpen className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Article Content</h2>
          </div>
          
         
        </div>

        {/* Additional images */}
        {article.images.length > 1 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`Related image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interaction buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userInteraction === "like"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <Heart className={`w-4 h-4 ${userInteraction === "like" ? "fill-current" : ""}`} />
                <span>{article.stats.likes.toLocaleString()}</span>
                <span className="hidden sm:inline">Likes</span>
              </button>

              <button
                onClick={handleDislike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userInteraction === "dislike"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                }`}
              >
                <ThumbsDown className={`w-4 h-4 ${userInteraction === "dislike" ? "fill-current" : ""}`} />
                <span>{article.stats.dislikes}</span>
                <span className="hidden sm:inline">Dislikes</span>
              </button>

            </div>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;