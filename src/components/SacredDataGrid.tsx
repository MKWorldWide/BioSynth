import { ReactNode, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SacredTable } from './SacredTable'
import { SacredPagination } from './SacredPagination'
import { SacredDropdown } from './SacredDropdown'
import { SacredAlert } from './SacredAlert'
import { SacredSpinner } from './SacredSpinner'
import { Column, Filter } from '@/types'

interface SacredDataGridProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  onRowClick?: (item: T) => void
  onSelectionChange?: (selectedItems: T[]) => void
  className?: string
  emptyMessage?: string
  isLoading?: boolean
  loadingMessage?: string
  error?: string
  onErrorDismiss?: () => void
  showPagination?: boolean
  showFilters?: boolean
  showColumnSelector?: boolean
  showExport?: boolean
  onExport?: (data: T[]) => void
}

export const SacredDataGrid = <T extends object>({
  columns,
  data,
  pageSize = 10,
  onRowClick,
  onSelectionChange,
  className = '',
  emptyMessage = 'No data available',
  isLoading = false,
  loadingMessage = 'Loading sacred data...',
  error,
  onErrorDismiss,
  showPagination = true,
  showFilters = true,
  showColumnSelector = true,
  showExport = true,
  onExport
}: SacredDataGridProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filter[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map(col => col.key)
  )
  const [selectedItems, setSelectedItems] = useState<T[]>([])

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return filters.every(filter => {
        const value = String(item[filter.column as keyof T]).toLowerCase()
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case 'contains':
            return value.includes(filterValue)
          case 'equals':
            return value === filterValue
          case 'startsWith':
            return value.startsWith(filterValue)
          case 'endsWith':
            return value.endsWith(filterValue)
          default:
            return true
        }
      })
    })
  }, [data, filters])

  const visibleColumns = useMemo(() => {
    return columns.filter(col => selectedColumns.includes(col.key))
  }, [columns, selectedColumns])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const handleFilterChange = useCallback((column: string, value: string, operator: Filter['operator']) => {
    setFilters(current => {
      const existing = current.find(f => f.column === column)
      if (existing) {
        return current.map(f => 
          f.column === column ? { ...f, value, operator } : f
        )
      }
      return [...current, { column, value, operator }]
    })
    setCurrentPage(1)
  }, [])

  const handleColumnToggle = useCallback((column: string) => {
    setSelectedColumns(current => 
      current.includes(column)
        ? current.filter(c => c !== column)
        : [...current, column]
    )
  }, [])

  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelection = checked ? paginatedData : []
    setSelectedItems(newSelection)
    onSelectionChange?.(newSelection)
  }, [paginatedData, onSelectionChange])

  const handleSelectItem = useCallback((item: T, checked: boolean) => {
    const newSelection = checked
      ? [...selectedItems, item]
      : selectedItems.filter(i => i !== item)
    setSelectedItems(newSelection)
    onSelectionChange?.(newSelection)
  }, [selectedItems, onSelectionChange])

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <SacredAlert
          type="error"
          title="Error"
          message={error}
          onClose={onErrorDismiss}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showFilters && (
            <SacredDropdown
              trigger={
                <button className="px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  Filters ({filters.length})
                </button>
              }
            >
              {columns.filter(col => col.filterable).map((column, index) => (
                <div key={index} className="p-2">
                  <input
                    type="text"
                    placeholder={`Filter ${column.header}...`}
                    className="w-full px-3 py-2 bg-slate-800 border border-emerald-500/20 rounded-lg text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:border-emerald-500"
                    onChange={e => handleFilterChange(
                      column.key,
                      e.target.value,
                      'contains'
                    )}
                  />
                </div>
              ))}
            </SacredDropdown>
          )}

          {showColumnSelector && (
            <SacredDropdown
              trigger={
                <button className="px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  Columns
                </button>
              }
            >
              {columns.map((column, index) => (
                <div key={index} className="p-2">
                  <label className="flex items-center space-x-2 text-emerald-400">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.key)}
                      onChange={() => handleColumnToggle(column.key)}
                      className="form-checkbox text-emerald-500"
                    />
                    <span>{column.header}</span>
                  </label>
                </div>
              ))}
            </SacredDropdown>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {showExport && onExport && (
            <button
              onClick={() => onExport(filteredData)}
              className="px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Export
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <SacredSpinner size="lg" />
        </div>
      ) : (
        <>
          <SacredTable
            columns={visibleColumns}
            data={paginatedData}
            onRowClick={onRowClick}
            emptyMessage={emptyMessage}
          />

          {showPagination && totalPages > 1 && (
            <SacredPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  )
} 