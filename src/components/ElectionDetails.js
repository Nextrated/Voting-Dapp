import React, { useState, useEffect } from 'react';
import { Modal,ModalOverlay,ModalHeader, ModalContent, ModalBody, ModalFooter, Button, ModalCloseButton } from "@chakra-ui/react"
import { getElectionCategory} from "../utils";

const ElectionDetails	 = ({isOpen,onClose}) => {
	const [roles, setRoles] = useState("");
	const [eligibility, setEligibility] = useState("")

	function parseEligibility(obj){
		const r = parseInt((obj._hex), 16);
			if(r===0){
				setEligibility("Board member")
			} else if(r===1){
				setEligibility("Teacher")
			}else{
				setEligibility("Student")
			}
		// var newArr = [];
		// for(var i=0; i< arr.length; i++){
		// 	const r = parseInt((arr[i]._hex), 16);
		// 	if(r===0){
		// 		newArr.push("Board member")
		// 	} else if(r===1){
		// 		newArr.push("Teacher")
		// 	}else{
		// 		newArr.push("Student")
		// 	}
		// }

		// return newArr
	}
	useEffect(()=>{
		//supposed to be a function that returns the contesting details like post and eligibility and if it is null, that means it has not been set
		getElectionCategory(window.ethereum).then(r => {
			if(r[0].length !== 0){
				setRoles(r[0][0]);
				parseEligibility(r[1])
			} else{
				setRoles("");
				setEligibility("")
			}
		})
	}, [])
    return (
        <Modal isOpen={isOpen} onClose={onClose}>	
        		<ModalOverlay/>
        		<ModalContent>	
        			<ModalHeader> Election Details </ModalHeader>
        			<ModalCloseButton/>
        			<ModalBody>	
        				{roles && eligibility ? `This election is for the post of the ${roles} of Zuri Organization and the people eligible to contest are the ${eligibility}s` :"Please check back later. Details of election has not yet been set"}
        			</ModalBody>	
        			<ModalFooter>	
        				<Button colorScheme="orange" mr={3} onClick={onClose}>Close</Button>
        			</ModalFooter>	
        		</ModalContent>	
        </Modal>	
    );
};



export default 	ElectionDetails;
