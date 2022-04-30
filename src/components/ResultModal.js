import React,{ useEFFECT }  from 'react';
import { Modal,ModalOverlay,ModalHeader, ModalContent, ModalBody, ModalFooter, Button, ModalCloseButton, Text, Box } from "@chakra-ui/react"

const 	ResultModal = ({isOpen, onClose}) => {

	useEffect(()=> {

	}, [])
    return (
        <Modal isOpen={isOpen} onClose={onClose}>	
        		<ModalOverlay/>
        		<ModalContent>	
        			<ModalHeader> Election Results </ModalHeader>
        			<ModalCloseButton/>
        			<ModalBody>	
        					results
        			</ModalBody>	
        			<ModalFooter>	
        				<Button colorScheme="orange" mr={3} onClick={onClose}>Close</Button>
        			</ModalFooter>	
        		</ModalContent>	
        </Modal>
    );
};


export default 	ResultModal;
