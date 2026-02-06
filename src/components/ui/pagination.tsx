'use client';

import { useCallback } from 'react';
import { cn, getPaginationItems } from '@/lib/utils';
import type { PaginationInfo } from '@/types';
import PreviousPagination from './previous-pagination';
import PaginationItem from './pagination-item';
import NextPagination from './next-pagination';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: 'light' | 'dark';
  /** ID of element to scroll into view when page changes */
  scrollTargetId?: string;
  /** ID of scrollable container to reset scroll position (alternative to scrollTargetId) */
  scrollContainerId?: string;
}

export function Pagination({
  pagination,
  onPageChange,
  className,
  variant = 'light',
  scrollTargetId,
  scrollContainerId,
}: PaginationProps) {
  const { currentPage, totalPages, totalItems } = pagination;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = useCallback(
    (page: number) => {
      onPageChange(page);

      if (scrollContainerId) {
        const container = document.getElementById(scrollContainerId);
        container?.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (scrollTargetId) {
        const element = document.getElementById(scrollTargetId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [onPageChange, scrollTargetId, scrollContainerId]
  );

  const handlePrevious = () => {
    if (canGoPrevious) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      handlePageChange(currentPage + 1);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  const isDark = variant === 'dark';

  const pageItems = getPaginationItems(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center', className)}>
      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <PreviousPagination
          canGoPrevious={canGoPrevious}
          isDark={isDark}
          onClick={handlePrevious}
        />

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageItems.map((item, index) => {
            return (
              <PaginationItem
                key={index}
                item={item}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isDark={isDark}
              />
            );
          })}
        </div>

        <NextPagination canGoNext={canGoNext} isDark={isDark} onClick={handleNext} />
      </div>
    </nav>
  );
}
