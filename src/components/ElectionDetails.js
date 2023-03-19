import React, { useState, useEffect } from 'react';
import { Modal,ModalOverlay,ModalHeader, ModalContent, ModalBody, ModalFooter, Button, ModalCloseButton, Text, Box } from "@chakra-ui/react"
import { getElectionCategory} from "../utils";

const ElectionDetails	 = ({isOpen,onClose}) => {
	const [roles, setRoles] = useState([]);
	const [eligibility, setEligibility] = useState([]);
	const [category, setCategory] = useState([])

	function getCategory(arr1, arr2){
		if(arr1.length === 0){
			setCategory([])
		} else{
			let newArr = [];
			for(let i=0; i< arr1.length; i++){
				let obj = {
					role: arr1[i],
					eligibility: arr2[i]
				}
				newArr.push(obj);
			}
			setCategory(newArr);
		}
		
	}

	function convHex(hex){
        return parseInt((hex._hex), 16);
    }

	useEffect(()=>{
		//supposed to be a function that returns the contesting details like post and eligibility and if it is null, that means it has not been set
		getElectionCategory(window.ethereum).then(async res => {
			// console.log(res)
			if(res[0].length !== 0){
				await setRoles(res[0]);
                for(let i=0; i<res[1].length; i++){
                    var r= convHex(res[1][i]);
                    if(r===1){
                        await setEligibility([...eligibility,"Teacher"])
                    } else{
                        await setEligibility([...eligibility,"Student"])
                    }
                }
			} else{
				setRoles([]);
				setEligibility([])
			}
			// console.log(roles)
			// console.log(eligibility)
			getCategory(roles, eligibility)
		})
	}, [category, roles, eligibility])
    return (
        <Modal isOpen={isOpen} onClose={onClose}>	
        		<ModalOverlay/>
        		<ModalContent>	
        			<ModalHeader> Election Details </ModalHeader>
        			<ModalCloseButton/>
        			<ModalBody>	
        				{roles.length === 0 ? "Please check back later. Details of election has not yet been set" : null}
        				{roles.length === 1 ? `This election is for the post of the ${roles[0]} of Computing Masters Department and the people eligible to contest are the ${eligibility[0]}s`: null}
        				{roles.length > 1 ? 
        					(<Box>
        						<Text>This election is for the following roles</Text>
        						{category.map((role, id) => <Text key={id}>{id + 1}. {role.role} which has eligibility of {role.eligibility}</Text>)}
        					</Box>): null}
        			</ModalBody>	
        			<ModalFooter>	
        				<Button colorScheme="orange" mr={3} onClick={onClose}>Close</Button>
        			</ModalFooter>	
        		</ModalContent>	
        </Modal>	
    );
};



export default 	ElectionDetails;
