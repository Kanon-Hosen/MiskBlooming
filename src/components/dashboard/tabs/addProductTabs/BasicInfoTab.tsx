import Button from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import RichTextEditor from "@/src/components/ui/RichTextEditor";
import { Heart, Plus, Tag, X } from "lucide-react";
import React from "react";
import { TabProps } from "../types";
import { SubCategory } from "@/src/modules/category/categoryTypes";

function BasicInfoTab({
  formData,
  handleInputChange,
  errors,
  categories,
  selectedCategory,
  removeTag,
  newTag,
  setNewTag,
  addTag,
}: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-cormorant font-bold text-foreground  mb-4">
          Basic Information
        </h2>
        <p className="text-foreground ">
          Essential product details and categorization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-muted-foreground  mb-2"
          >
            Product Name *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Premium Red Rose Bouquet"
            className={errors?.name ? "border-red-300" : ""}
          />
          {errors?.name && (
            <p className="text-destructive text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-muted-foreground  mb-2"
          >
            URL Slug *
          </label>
          <Input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            placeholder="premium-red-rose-bouquet"
          />
          <p className="text-xs text-foreground mt-1">
            Auto-generated from product name
          </p>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-muted-foreground  mb-2"
          >
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className={`w-full px-3 py-2 border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors?.category ? "border-destructive" : "border-border"
            }`}
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors?.category && (
            <p className="text-destructive text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {selectedCategory && (
          <div>
            <label
              htmlFor="subcategory"
              className="block text-sm font-medium text-muted-foreground  mb-2"
            >
              Subcategory
            </label>
            <select
              id="subcategory"
              value={formData.subcategory}
              onChange={(e) => handleInputChange("subcategory", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary bg-background text-foreground focus:border-transparent"
            >
              <option value="">Select a subcategory</option>
              {Array.isArray(selectedCategory?.subcategories) &&
                (selectedCategory.subcategories as unknown[]).map((sub) => {
                  if (
                    typeof sub === "object" &&
                    sub !== null &&
                    "id" in sub &&
                    "name" in sub
                  ) {
                    const subCategory = sub as SubCategory;
                    return (
                      <option key={subCategory.id} value={subCategory.name}>
                        {subCategory.name}
                      </option>
                    );
                  }
                  return null;
                })}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label
            htmlFor="shortDescription"
            className="block text-sm font-medium text-muted-foreground  mb-2"
          >
            Short Description *
          </label>
          <textarea
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) =>
              handleInputChange("shortDescription", e.target.value)
            }
            placeholder="Brief description for product listings (max 160 characters)"
            rows={3}
            maxLength={160}
            className={`w-full px-3 py-2 border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors?.shortDescription ? "border-destructive" : "border-border"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors?.shortDescription && (
              <p className="text-destructive text-sm">
                {errors.shortDescription}
              </p>
            )}
            <p className="text-xs text-foreground ml-auto">
              {formData.shortDescription.length}/160
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-muted-foreground  mb-2"
        >
          Full Description *
        </label>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => handleInputChange("description", value)}
          placeholder="Enter a detailed description of your product..."
          className={errors?.description ? "border-red-300" : ""}
        />
        {errors?.description && (
          <p className="text-destructive text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground  mb-2">
          Product Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted text-foreground"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag && removeTag(tag)}
                className="ml-2 text-primary hover:text-luxury-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag && setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag && addTag())
            }
          />
          <Button type="button" onClick={addTag} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status and Featured */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground  mb-2">
            Product Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange("featured", e.target.checked)}
              className="rounded border-border  text-primary focus:ring-ring"
            />
            <span className="ml-2 text-sm font-medium text-muted-foreground  flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              Featured Product
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default BasicInfoTab;
