import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import axios from 'axios';
import { Checkbox, Modal, Button, Group, Input, Badge } from '@mantine/core';
import { Colors, API_URL } from '../constants/contanst';
import { IconCaretLeft, IconCaretRight, IconTrash, IconEdit, IconAt, IconUserSquareRounded, IconTool } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

function Dashboard() {

    const [usersData, setUsersData] = useState([]);
    const [page, setPage] = useState(1);
    const [opened, { open, close }] = useDisclosure(false); // this is modal useState variable
    const [modalData, setModalData] = useState([]);
    const [editedUserData, setEditedUserData] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dashboardData();
    }, []);

    const dashboardData = async () => {
        const response = await axios.get(API_URL);
        setUsersData(response?.data);
    }

    const handlePagination = (selectedPage) => {
        if (selectedPage >= 1 && selectedPage <= Math.ceil(usersData?.length / 10) && selectedPage != page) {
            setPage(selectedPage)
        }
    }


    const openEditModal = (userData) => {
        open()
        setModalData(userData);
        setEditedUserData({ ...userData }); // Copy the data to be edited
    };

    const saveEditedData = () => {
        // here im finding the specific user
        const dataIndex = usersData.findIndex(user => user.id === modalData.id);

        // here im creating new copy of userdata and then replacing edited user using indexing concept
        const updatedUsersData = [...usersData];
        updatedUsersData[dataIndex] = editedUserData;

        // and finally here im setting up the data in usestate variable
        setUsersData(updatedUsersData);
        //handling edge case for safety purpuse
        setEditedUserData(null);
        // and then at last im closing the modal.
        close();
    };

    const deleteUser = (userId) => {
        // here im Filtering out the user to be deleted from the usersData array
        const updatedUsersData = usersData.filter(user => user.id !== userId);

        // here im Updating the usersData state without the deleted user which means its not permanently
        setUsersData(updatedUsersData);
    };


    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSelectedDelete = () => {
        // Filter out the selected users from the usersData array
        const updatedUsersData = usersData.filter(user => !selectedUsers.includes(user.id));

        // Update the usersData state without the selected users
        setUsersData(updatedUsersData);

        // Clear the selected users
        setSelectedUsers([]);
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]); // Deselect all users
        } else {
            const allUserIds = usersData.map(user => user.id);
            setSelectedUsers(allUserIds); // Select all users
        }
        setSelectAll(!selectAll); // Toggle the "Select All" checkbox state
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const filteredUsers = usersData.filter((user) => {
        if (searchQuery.trim() === '') {
            return true; // here im returning true if input field is empty
        }

        const query = searchQuery.toLowerCase(); // to avoid issues with upper and lowercase inputes
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.id.toString().includes(query) ||
            user.role.toLowerCase().includes(query)
        );
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const rows = filteredUsers.slice(page * 10 - 10, page * 10).map((user) => (
        <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected-row' : 'unselected-row'}>
            <td>{user.id} </td>
            <td>
                <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                />
            </td>
            <td>{user.name} </td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td><IconTrash className='mx-2 delete' onClick={() => deleteUser(user.id)} /><IconEdit onClick={() => openEditModal(user)} className='edit' /></td>
        </tr>
    ));

    return (
        <div className='container'>
            <div className="row">
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
                <div className="col-md-4">
                    <h4 className='text-end'> <Badge color="teal" size="xl">Total Users : {usersData?.length || 0}</Badge></h4>
                </div>
            </div>
            <Table className='text-center'>
                <thead >
                    <tr >
                        <th className='text-center'>User ID</th>
                        <th className='d-flex justify-content-evenly align-items-center'>Select<Checkbox
                            checked={selectAll}
                            onChange={toggleSelectAll}
                            className=' d-inline-block'
                        /></th>
                        <th className='text-center'>Name</th>
                        <th className='text-center'>Email</th>
                        <th className='text-center'>Role</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            {/* edit modal  */}
            <Modal opened={opened} onClose={close} title="Edit">
                {editedUserData && (
                    <>
                        <Input
                            className='mt-2'
                            icon={<IconAt />}
                            placeholder="Your email"
                            value={editedUserData.name}
                            onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
                        />
                        <Input
                            className='mt-2'
                            icon={<IconUserSquareRounded />}
                            placeholder="Your Name"
                            value={editedUserData.email}
                            onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
                        />
                        <Input
                            className='mt-2'
                            icon={<IconTool />}
                            placeholder="Your Role"
                            value={editedUserData.role}
                            onChange={(e) => setEditedUserData({ ...editedUserData, role: e.target.value })}
                        />
                        <Button className='m-2' color="green" onClick={saveEditedData}>Save</Button>
                        <Button className='m-2' variant="outline" color="pink" onClick={() => { close() }}>Cancel</Button>
                    </>
                )}

            </Modal>
            {/* edit modal  ends here*/}

            {/* pagination */}
            {
                usersData?.length > 0 && (
                    <div className='pagination'>
                        <Button variant="outline" color="pink" onClick={handleSelectedDelete}>Delete Selected</Button>
                        <div className='d-flex jusfy-content-center align-items-center'>
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
                        </div>
                    </div>
                )
            }
            {/* pagination ends here */}
        </div>
    );
}

export default Dashboard;