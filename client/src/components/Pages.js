import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Pagination } from 'react-bootstrap';  
import { Context } from '..';
import './Pages.css';

const Pages = observer(() => {
    const { cloth } = useContext(Context);
    const totalPages = Math.ceil(cloth.totalCount / cloth.limit);
    const currentPage = cloth.page;

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        cloth.setPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (totalPages <= 1) return null; 

    let pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="pagination-wrapper">
            <Pagination className="custom-pagination">
                {/* Назад */}
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />

                {start > 1 && (
                    <>
                        <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                        {start > 2 && <Pagination.Ellipsis disabled />}
                    </>
                )}

                {pages.map(page => (
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                ))}

                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && <Pagination.Ellipsis disabled />}
                        <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </Pagination.Item>
                    </>
                )}

                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    );
});

export default Pages;