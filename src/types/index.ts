import { ReactNode } from 'react'

// Shared Column type for data grid and table components
export interface Column<T> {
  key: string
  header: string
  accessor?: keyof T | ((item: T) => ReactNode)
  render?: (item: T) => ReactNode
  className?: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

// Filter interface for data grid
export interface Filter {
  column: string
  value: string
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith'
}

// Common props for data components
export interface DataComponentProps<T> {
  className?: string
  emptyMessage?: string
  isLoading?: boolean
  loadingMessage?: string
  error?: string
  onErrorDismiss?: () => void
}

// API response types
export interface APIResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

// Pagination types
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'researcher'
  createdAt: string
  updatedAt: string
}

// Research data types
export interface ResearchData {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'completed' | 'pending'
  createdAt: string
  updatedAt: string
  author: User
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
}

// Theme types
export interface Theme {
  mode: 'dark' | 'light'
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
} 