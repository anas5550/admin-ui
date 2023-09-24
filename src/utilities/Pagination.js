import React from 'react';
import { Button } from '@mantine/core';
import { IconCaretLeft, IconCaretRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { Colors } from '../constants/contanst';

const Pagination = ({ handleSelectedDelete, page, totalPages, usersData, setPage }) => {

    const handlePagination = (selectedPage) => {
        if (selectedPage >= 1 && selectedPage <= Math.ceil(usersData?.length / 10) && selectedPage != page) {
            setPage(selectedPage)
        }
    }

    return (
        usersData?.length > 0 && (
            <div className='pagination'>
                <Button variant="outline" color="pink" onClick={handleSelectedDelete}>Delete Selected</Button>
                <div className='d-flex jusfy-content-center align-items-center'>
                    <IconChevronsLeft
                        onClick={() => { handlePagination(1) }}
                        className={page === 1 ? "disable_prev" : "arrow"}
                    />
                    <IconCaretLeft
                        onClick={() => { handlePagination(page - 1) }}
                        className={page === 1 ? "disable_prev" : ""}
                    />
                    {[...Array(totalPages)].map((_, i) => {
                        return (
                            <span
                                onClick={() => handlePagination(i + 1)}
                                key={i}
                                className={`pagination_numbers ${page === i + 1 ? "active_page" : ""}`}
                                style={{ background: Colors.blue }}
                            >
                                {i + 1}
                            </span>
                        );
                    })}
                    <IconCaretRight
                        onClick={() => { handlePagination(page + 1) }}
                        className={page === totalPages ? "disable_prev" : ""}
                    />

                    <IconChevronsRight
                        onClick={() => { handlePagination(totalPages) }}
                        className={page === totalPages ? "disable_prev" : "arrow"}
                    />


                </div>
            </div>
        )
    )
}

export default Pagination