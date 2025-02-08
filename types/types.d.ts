export interface Project {
  _id: string
  title: string
  description: string
  tags: string[]
  links?: {
    live?: string
    github?: string
  }
  techStack?: string[]
  timeline?: string
  role?: string
  keyFeatures?: string[]
  path: string
  logo?: string
}