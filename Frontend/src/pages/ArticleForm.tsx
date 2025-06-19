/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Upload,
  X,
  Plus,
  Save,
  ArrowLeft,
  Image,
  Tag,
  FileText,
  Folder,
  Loader2,
} from "lucide-react";
import type { ArticleFormData } from "../types/article";
import {
  getCategories,
  postArticle,
  updateArticle,
} from "../services/userService";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Types

interface Category {
  _id: string;
  name: string;
}

interface ArticleFormProps {
  articleId?: string;
  initialData?: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
    images?: string[];
  };
  isEdit?: boolean;
  onSubmit: (data: ArticleFormData & { image?: File }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  articleId,
  initialData,
  isEdit = false,
  onCancel,
  isLoading = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.images?.[0] || null
  );
  const [currentTag, setCurrentTag] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ArticleFormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
    },
  });

  const watchedTags = watch("tags");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();

        if (res.success && res.data?.data) {
          setCategories(res.data.data);
        } else {
          toast.error("Failed to load category");
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "",
        tags: initialData.tags || [],
      });
      setImagePreview(initialData.images?.[0] || null);
    }
  }, [initialData, reset]);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setValue("image", file);
      setImageFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", undefined);
  };

  const addTag = () => {
    if (
      currentTag.trim() &&
      !watchedTags.includes(currentTag.trim().toLowerCase())
    ) {
      const newTags = [...watchedTags, currentTag.trim().toLowerCase()];
      setValue("tags", newTags);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = watchedTags.filter((tag) => tag !== tagToRemove);
    setValue("tags", newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const onFormSubmit = async (data: ArticleFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tags", data.tags.join(","));

      if (imageFile) {
        formData.append("images", imageFile);
      }

      if (isEdit) {
        formData.append("articleId", articleId!);
        const response = await updateArticle(formData);
        if (response.success) {
          toast.success("Article updated successfully ✅");
        } else {
          toast.error(response.message ?? "Failed to update article");
        }
      } else {
        for (const [k, v] of formData.entries()) {
          console.log(k, v);
        }

        const response = await postArticle(formData);

        if (response.success) {
          toast.success("Article published successfully ✅");
        } else {
          toast.error(response.message ?? "Failed to publish article");
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);

      console.error("Form submission error:", error);

      // optional: backend may send proper error message inside response
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      reset();
      setImagePreview(null);
      setImageFile(null);
      setCurrentTag("");
    }
  };

  if (loading) return <Loader2 />;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEdit ? "Edit Article" : "Create New Article"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {isEdit
                    ? "Update your article details"
                    : "Share your story with the community"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="p-6 sm:p-8">
              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-900">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Article Title
                </label>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: "Article title is required",
                    maxLength: {
                      value: 255,
                      message: "Title must be less than 255 characters",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter an engaging title for your article..."
                      className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.title
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2 mt-6">
                <label className="flex items-center text-sm font-medium text-gray-900">
                  <Folder className="w-4 h-4 mr-2 text-gray-500" />
                  Category
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Please select a category" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.category
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 mt-6">
                <label className="flex items-center text-sm font-medium text-gray-900">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Article Content
                </label>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: "Article content is required",
                    minLength: {
                      value: 50,
                      message: "Content must be at least 50 characters long",
                    },
                  }}
                  render={({ field }) => (
                    <div
                      className={`border rounded-lg ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write your article content here..."
                      />
                    </div>
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2 mt-6">
                <label className="flex items-center text-sm font-medium text-gray-900">
                  <Image className="w-4 h-4 mr-2 text-gray-500" />
                  Featured Image
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop an image here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: JPG, PNG, GIF up to 10MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2 mt-6">
                <label className="flex items-center text-sm font-medium text-gray-900">
                  <Tag className="w-4 h-4 mr-2 text-gray-500" />
                  Tags
                </label>

                {/* Tag Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Tag List */}
                {watchedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {watchedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 p-0.5 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit(onFormSubmit)}
              disabled={isSubmitting || isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEdit ? "Update Article" : "Publish Article"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
