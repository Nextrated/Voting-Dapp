import React, { useState, useEffect } from 'react';
import { Modal,ModalOverlay,ModalHeader, ModalContent, ModalBody, ModalFooter, Button, ModalCloseButton } from "@chakra-ui/react"
import {canStartContesting} from "../utils";

const ElectionDetails	 = ({isOpen,onClose}) => {
	const [body, setBody] = useState()
	useEffect(()=>{
		//supposed to be a function that returns the contesting details like post and eligibility and if it is null, that means it has not been set
		const res = canStartContesting(window.ethereum);
		if(res === false){
			setBody("Sorry, election details are currently unavailable")
		} else{
			setBody("Election is for the post of ..... and the eligible candidates are .....")
		}
	}, [])
    return (
        <Modal isOpen={isOpen} onClose={onClose}>	
        		<ModalOverlay/>
        		<ModalContent>	
        			<ModalHeader> Election Details </ModalHeader>
        			<ModalCloseButton/>
        			<ModalBody>	
        				{body}
        			</ModalBody>	
        			<ModalFooter>	
        				<Button colorScheme="orange" mr={3} onClick={onClose}>Close</Button>
        			</ModalFooter>	
        		</ModalContent>	
        </Modal>	
    );
};



export default 	ElectionDetails;
