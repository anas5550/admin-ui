import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import axios from 'axios';
import { Badge } from '@mantine/core';
import { API_URL } from '../constants/contanst';
import { useDisclosure } from '@mantine/hooks';
import DataTable from './DataTable';
import EditModal from './EditModal'


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

    const saveEditedData = () => {
        try {
            const dataIndex = usersData.findIndex(user => user.id === modalData.id);
            const updatedUsersData = [...usersData];
            updatedUsersData[dataIndex] = editedUserData;
            setUsersData(updatedUsersData);
            setEditedUserData(null);
            close();
        } catch (err) {
            console.log('error in saveEditedData');
        }
    };

    const deleteUser = (userId) => {
        try {
            const updatedUsersData = usersData.filter(user => user.id !== userId);
            setUsersData(updatedUsersData);
        } catch (err) {
            console.log('error in deleteUser');
        }
    };

    const toggleUserSelection = (userId) => {
        try {
            if (selectedUsers.includes(userId)) {
                setSelectedUsers(selectedUsers.filter(id => id !== userId));
            } else {
                setSelectedUsers([...selectedUsers, userId]);
            }
        } catch (err) {
            console.log('error in toggleUserSelection');
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

    const toggleSelectAll = () => {
        try {
            if (selectAll) {
                setSelectedUsers([]);
            } else {
                const allUserIds = usersData.map(user => user.id);
                setSelectedUsers(allUserIds);
            }
            setSelectAll(!selectAll);
        } catch (err) {
            console.log('error in toggleUserSelection');
        }
    };

    const handleSearchChange = (e) => {
        try {
            setSearchQuery(e.target.value);
        } catch (err) {
            console.log('error in toggleUserSelection');
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
            console.log('error in toggleUserSelection');
        }

    });

    const itemsPerPage = 10; //  items per page
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className='container'>
            <div className="row">

                {/* Search Bar */}
                <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />

                <div className="col-md-4">
                    <h4 className='text-end'> <Badge color="teal" size="xl">Total Users : {usersData?.length || 0}</Badge></h4>
                </div>
            </div>
            {/* This is the table from where all data is coming */}
            <DataTable
                selectAll={selectAll}
                toggleSelectAll={toggleSelectAll}
                filteredUsers={filteredUsers}
                page={page}
                selectedUsers={selectedUsers}
                toggleUserSelection={toggleUserSelection}
                openEditModal={openEditModal}
                deleteUser={deleteUser}
            />
            {/* table ends here */}

            {/* edit modal  */}
            <EditModal
                editedUserData={editedUserData}
                setEditedUserData={setEditedUserData}
                saveEditedData={saveEditedData}
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