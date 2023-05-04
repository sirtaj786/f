import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormControl,
    Input,
    Box,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    Spinner

} from '@chakra-ui/react'

function Table() {
    const toast = useToast();
    const modal2 = useDisclosure()
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [newUser, setNewUser] = useState({ name: '', email: '', city: '' });
    const [editUser, setEditUser] = useState({ _id: '', name: '', email: '', city: '', __v: 0 });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:8080/getAlluser');
            setLoading(false)
            console.log("res", response)
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8080/adduser', newUser);
            await fetchUsers()
            toast({
                title: `User Added Successfully `,
                position: "top-left",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handelUpdate = async () => {
        console.log("Edit USer", editUser)
        try {
            const response = await axios.patch(`http://localhost:8080/updateuser/${editUser._id}`, editUser);
            const updatedUsers = users.map((user) => (user.id === response.data.id ? response.data : user));
            setUsers(updatedUsers);

            setEditUser(null);
            toast({
                title: `User Updated successfully `,
                position: "top-left",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteUser = async (id) => {
        console.log(id)
        try {
            await axios.delete(`http://localhost:8080/deleteuser/${id}`);
            // const updatedUsers = users.filter((item) => item.id !== id);
            await fetchUsers()
            toast({
                title: `User deleted successfully `,
                position: "top-left",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handelEditModal = (user) => {
        setEditUser(user)
        console.log("USER in Edit Model ", user)
        console.log("EDITUSER in Edit Model ", editUser)
        modal2.onOpen()
    }
    console.log("newuser", newUser)
    return (
        <>
            <Modal mb="4rem" width="200px" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent marginLeft={"5rem"}>
                    <ModalHeader marginTop={"50px"}>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleAddUser} style={{ ml: "100px" }}>
                            <input type='text' placeholder='Enter Name' onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                            <br />
                            <input type='email' placeholder='Enter User Email' onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                            <br />
                            <input type='text' placeholder='Enter City' onChange={(e) => setNewUser({ ...newUser, city: e.target.value })} />
                            <Button type="submit" colorScheme='blue' mt={"3rem"} onClick={onClose}>
                                Add
                            </Button>
                        </form>
                    </ModalBody>

                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Button marginLeft={"25rem"} onClick={onOpen}>Add User</Button>
            <table style={{ marginTop: "200px", color: "red", marginLeft: "25rem" }} >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (<Spinner size='xl' marginLeft="20rem"/>) : (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.city}</td>
                                <td>
                                    <Button onClick={() => handelEditModal(user)}>Edit</Button>
                                </td>
                                <td>
                                    <Button onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                                </td>
                            </tr>
                        )))}
                </tbody>
            </table>


            {/* Update Model */}

            <Modal isOpen={modal2.isOpen} onClose={modal2.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Test</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handelUpdate}>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={editUser.name}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <Input
                                    type="email"
                                    placeholder="Enter Email"
                                    value={editUser.email}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <Input
                                    type="text"
                                    placeholder="Enter City"
                                    value={editUser.city}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, city: e.target.value })
                                    }
                                    required
                                />
                            </FormControl>

                            <Box mt={4}>
                                <Button type="submit" colorScheme="blue" mr={3}>
                                    Update Test
                                </Button>
                                <Button colorScheme="red" onClick={modal2.onClose}>Cancel</Button>
                            </Box>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
export default Table