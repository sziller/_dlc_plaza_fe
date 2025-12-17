// src/api/blog.ts
import api from "./client";

export type PostStatus = "draft" | "published";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subheading: string | null;
  author_name: string | null;
  excerpt: string | null;
  hero_image_url: string | null;
  article_image_url: string | null;
  slides_presentation_url: string | null;
  cta_text_big: string | null;
  cta_text_small: string | null;
  cta_button_text: string | null;
  body: string;
  status: PostStatus;
  author_id: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

// PUBLIC

export async function fetchPublishedPosts(limit = 20, offset = 0): Promise<BlogPost[]> {
  const res = await api.get<BlogPost[]>("/api/blog/posts", {
    params: { limit, offset },
  });
  return res.data;
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost> {
  const res = await api.get<BlogPost>(`/api/blog/posts/${slug}`);
  return res.data;
}

// ADMIN

export async function fetchAdminPosts(status?: PostStatus): Promise<BlogPost[]> {
  const res = await api.get<BlogPost[]>("/api/admin/blog/posts", {
    params: status ? { status_filter: status } : {},
  });
  return res.data;
}

export interface BlogPostCreatePayload {
  slug: string;
  title: string;
  subheading?: string | null;
  author_name?: string | null;
  excerpt?: string | null;
  hero_image_url?: string | null;
  article_image_url?: string | null;
  slides_presentation_url?: string | null;
  cta_text_big?: string | null;
  cta_text_small?: string | null;
  cta_button_text?: string | null;
  body: string;
  status: PostStatus;
}

export interface BlogPostUpdatePayload {
  slug?: string;
  title?: string;
  subheading?: string | null;
  author_name?: string | null;
  excerpt?: string | null;
  hero_image_url?: string | null;
  article_image_url?: string | null;
  slides_presentation_url?: string | null;
  cta_text_big?: string | null;
  cta_text_small?: string | null;
  cta_button_text?: string | null;
  body?: string;
  status?: PostStatus;
}

export async function createPost(payload: BlogPostCreatePayload): Promise<BlogPost> {
  const res = await api.post<BlogPost>("/api/admin/blog/posts", payload);
  return res.data;
}

export async function fetchAdminPostById(id: number): Promise<BlogPost> {
  const res = await api.get<BlogPost>(`/api/admin/blog/posts/${id}`);
  return res.data;
}

export async function updatePost(id: number, payload: BlogPostUpdatePayload): Promise<BlogPost> {
  const res = await api.put<BlogPost>(`/api/admin/blog/posts/${id}`, payload);
  return res.data;
}

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/api/admin/blog/posts/${id}`);
}
