import { ArrowLeft, Calendar } from "lucide-react";
import type { ArticleResponseDTO } from "../types/article";
import { dateFormatter } from "../utils/dateFormatter";

const ArticleDetailView: React.FC<{
  article: ArticleResponseDTO;
  onBack: () => void;
}> = ({ article, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Articles
      </button>

      <article className="max-w-4xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center text-gray-600 space-x-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {dateFormatter(article.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div
          className="prose prose-blue max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: article.description }}
        />
      </article>
    </div>
  );
};
export default ArticleDetailView;
