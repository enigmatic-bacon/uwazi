/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { t, Translate } from 'app/I18N';
import { Icon } from 'UI';

interface PaginationProps {
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const computeVisiblePages = (activePage: number, totalPages: number) => {
  let availablePages;
  if (totalPages < 6) {
    availablePages = _.range(1, totalPages + 1);
  } else if (activePage % 5 >= 0 && activePage > 4 && activePage + 2 < totalPages) {
    availablePages = [1, activePage - 1, activePage, activePage + 1, totalPages];
  } else if (activePage % 5 >= 0 && activePage > 4 && activePage + 2 >= totalPages) {
    availablePages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    availablePages = [1, 2, 3, 4, 5, totalPages];
  }
  return availablePages;
};

function pageLabel(array: number[], index: number, pageNumber: number) {
  return array[index - 1] + 2 < pageNumber ||
    (pageNumber > 1 && array[index - 1] !== pageNumber - 1)
    ? `...${pageNumber}`
    : pageNumber;
}

const Pagination = ({ totalPages, onPageChange, onPageSizeChange }: PaginationProps) => {
  const [activePage, setActivePage] = useState<number>(1);
  const [visiblePages, setVisiblePages] = useState<number[]>(computeVisiblePages(1, totalPages));
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    setVisiblePages(computeVisiblePages(activePage, totalPages));
  }, [activePage, totalPages]);

  const changePage = (page: number) => {
    if (page !== activePage) {
      setActivePage(page);
      onPageChange(page);
    }
  };

  const gotToNextPage = () => {
    if (activePage !== totalPages) {
      changePage(activePage + 1);
    }
  };

  const gotToPreviousPage = () => {
    if (activePage !== 1) {
      changePage(activePage - 1);
    }
  };

  function PageNumbers() {
    return visiblePages.map((pageNumber, index, array) => (
      <button
        type="button"
        key={pageNumber}
        className={activePage === pageNumber ? 'page-button active' : 'page-button'}
        onClick={() => changePage(pageNumber)}
      >
        {pageLabel(array, index, pageNumber)}
      </button>
    ));
  }

  return (
    <div>
      {totalPages > 0 && (
        <div className="table-pagination">
          <div className="page-numbers">
            <div className="prev-page">
              <button
                type="button"
                className="page-button"
                onClick={gotToPreviousPage}
                disabled={activePage === 1}
              >
                <Icon icon="angle-double-left" />
                &nbsp;
                <Translate>Previous</Translate>
              </button>
            </div>
            <div className="visible-pages">{PageNumbers()}</div>
            <div className="next-page">
              <button
                type="button"
                className="page-button"
                onClick={gotToNextPage}
                disabled={activePage === totalPages}
              >
                <Translate>Next</Translate>
                &nbsp;
                <Icon icon="angle-double-right" />
              </button>
            </div>
          </div>
          <div>
            <select
              value={pageSize}
              onChange={e => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                onPageSizeChange(newSize);
              }}
            >
              {[5, 10, 20].map(size => (
                <option key={size} value={size}>
                  {`${size} ${t('System', 'per page', null, false)}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export { Pagination };
