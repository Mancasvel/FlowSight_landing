export type BlogSection = {
  heading: string
  paragraphs: string[]
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  keywords: string[]
  publishedAt: string
  updatedAt?: string
  readTimeMin: number
  category: 'compare' | 'privacy' | 'product'
  excerpt: string
  sections: BlogSection[]
}
