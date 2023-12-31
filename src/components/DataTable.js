import React from 'react';
import { Table } from '@mantine/core';
import { Checkbox } from '@mantine/core';
import { IconTrash, IconEdit, } from '@tabler/icons-react';


const DataTable = ({ selectAll, setSelectAll, filteredUsers, page, selectedUsers, openEditModal, usersData, setUsersData, setSelectedUsers }) => {

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
            console.log('error in toggleSelectAll');
        }
    };



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
            <td>
                <IconTrash className='mx-2 delete' onClick={() => deleteUser(user.id)} />
                <IconEdit onClick={() => openEditModal(user)} className='edit' />
            </td>
        </tr>
    ));

    return (
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
    )
}

export default DataTable