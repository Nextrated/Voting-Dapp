import React,{ useEffect }  from 'react';
import { Modal,ModalOverlay,ModalHeader, ModalContent, ModalBody, ModalFooter, Button, ModalCloseButton, Text, Box } from "@chakra-ui/react"

const 	ResultModal = ({isOpen, onClose}) => {

	// useEffect(()=> {

	// }, [])
    return (
        <Modal isOpen={isOpen} onClose={onClose}>	
        		<ModalOverlay/>
        		<ModalContent>	
        			<ModalHeader> Election Results </ModalHeader>
        			<ModalCloseButton/>
        			<ModalBody>	
						<Text mb={3} >This election results are :</Text>
						<Text  mb={3}> For the Role of Board Lead :  </Text>
						<Text >MauraDev(0x23Ad82B75e42343A4C5951441e84467AAD9E9833) : 1 Vote </Text>
						<Text mb={3}>Pearl(0x2c0d54bCeb94346BEdb99443EAC03049BDAC985B) : 2 Votes </Text>

						<Text>Winner for this role is : Pearl</Text>

        			</ModalBody>	
        			<ModalFooter>	
        				<Button colorScheme="orange" mr={3} onClick={onClose}>Close</Button>
        			</ModalFooter>	
        		</ModalContent>	
        </Modal>
    );
};


export default 	ResultModal;
