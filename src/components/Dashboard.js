import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import axios from 'axios';
import { Badge } from '@mantine/core';
import { API_URL } from '../constants/contanst';
import { useDisclosure } from '@mantine/hooks';
import DataTable from './DataTable';
import EditModal from './EditModal';


//components
import Pagination from '../utilities/Pagination';
import SearchBar from './SearchBar';

function Dashboard() {

    const [usersData, setUsersData] = useState([]);
    const [page, setPage] = useState(1);
    const [modalData, setModalData] = useState([]);
    const [editedUserData, setEditedUserData] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        dashboardData();
    }, []);

    const dashboardData = async () => {
        const response = await axios.get(API_URL);
        setUsersData(response?.data);
    }

    const openEditModal = (userData) => {
        try {
            open();
            setModalData(userData);
            setEditedUserData({ ...userData });
            console.log('opened');
        } catch (err) {
            console.log('error', err);

        }
    };

    const handleSelectedDelete = () => {
        try {
            const updatedUsersData = usersData.filter(user => !selectedUsers.includes(user.id));
            setUsersData(updatedUsersData);
            setSelectedUsers([]);
        } catch (err) {
            console.log('error in handleSelectedDelete');
        }

    };

    const filteredUsers = usersData.filter((user) => {
        try {
            if (searchQuery.trim() === '') {
                return true;
            }

            const query = searchQuery.toLowerCase();
            return (
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.id.toString().includes(query) ||
                user.role.toLowerCase().includes(query)
            );
        } catch (err) {
            console.log('error in filteredUsers');
        }

    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className='container'>
            <div className="row">

                {/* Search Bar */}
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <div className="col-md-4">
                    <h4 className='text-end'> <Badge color="teal" size="xl">Total Users : {usersData?.length || 0}</Badge></h4>
                </div>
            </div>
            {/* This is the table from where all data is coming */}
            <DataTable
                selectAll={selectAll}
                filteredUsers={filteredUsers}
                page={page}
                selectedUsers={selectedUsers}
                openEditModal={openEditModal}
                usersData={usersData}
                setUsersData={setUsersData}
                setSelectedUsers={setSelectedUsers}
            />
            {/* table ends here */}

            {/* edit modal  */}
            <EditModal
                usersData={usersData}
                setUsersData={setUsersData}
                editedUserData={editedUserData}
                setEditedUserData={setEditedUserData}
                openEditModal={openEditModal}

                opened={opened}
                close={close}
            />
            {/* edit modal ends here*/}

            {/* pagination */}
            <Pagination
                handleSelectedDelete={handleSelectedDelete}
                page={page}
                totalPages={totalPages}
                usersData={usersData}
                setPage={setPage}
            />
            {/* pagination ends here */}
        </div>
    );
}

export default Dashboard;