/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticleById, updateArticle } from "../services/userService"; // 🆕 imported updateArticle
import ArticleForm from "../pages/ArticleForm";
import { toast } from "react-toastify";

const ArticleEditWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res: any = await fetchArticleById(id!);

        console.log("****==>", res);

        if (res.success && res.data) {
          const article = res.data.data;
          setInitialData({
            title: article.title,
            description: article.description,
            category: article.category._id, // 🆕 fix this: use _id directly
            tags: article.tags,
            images: article.images,
          });
        } else {
          toast.error("Failed to load article");
        }
      } catch (err) {
        console.log(err);

        toast.error("Error loading article");
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  const handleUpdateSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("articleId", id!);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tags", data.tags.join(","));
      if (data.image instanceof File) {
        formData.append("images", data.image);
      }

      const res = await updateArticle(formData);
      if (res.success) {
        toast.success("Article updated successfully ✅");
        setTimeout(() => {
          navigate("/profile");
        }, 300);
      } else {
        toast.error(res.message ?? "Failed to update");
      }
    } catch (err) {
      console.log(err);

      toast.error("Error updating article");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ArticleForm
      isEdit
      articleId={id}
      initialData={initialData}
      onSubmit={handleUpdateSubmit}
      onCancel={() => navigate(-1)}
    />
  );
};

export default ArticleEditWrapper;
