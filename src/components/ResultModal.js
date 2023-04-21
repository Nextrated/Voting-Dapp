import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";

import { seePublicResults } from "../utils";
const ResultModal = ({ isOpen, onClose}) => {

	
		const ElectionResults = () => {
			seePublicResults(window.ethereum).then((result)=>{
        const candidates = result[0];
        let votesScored = [];
        for(let i=0; i<result[1].length; i++){
            votesScored.push(Number(result[1][i]))
        }
        console.log(candidates, votesScored);
      }).catch (error => {
        console.log(error);
      })
	
			return (
				<></>
			  )
		}
	


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Election Results </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
		    <ElectionResults/>
			
		    </ModalBody>
        <ModalFooter>
          <Button colorScheme="orange" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResultModal;
