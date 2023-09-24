import React from 'react';
import { Modal, Button, Input } from '@mantine/core';
import { IconAt, IconUserSquareRounded, IconTool } from '@tabler/icons-react';

const EditModal = ({ editedUserData, setEditedUserData, saveEditedData, opened, close }) => {
    return (
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
    )
}

export default EditModal;