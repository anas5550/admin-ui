import React from 'react';
import { Input } from '@mantine/core';

const SearchBar = ({ searchQuery, handleSearchChange }) => {


    return (
        <div className="col-md-8">
            <div className='d-flex justify-content-between align-items-center'>
                <Input
                    placeholder="Name, Email OR Role"
                    className='w-100'
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    )
}

export default SearchBar