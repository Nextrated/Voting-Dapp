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

import { getPublicResults } from "../utils";
const ResultModal = ({ isOpen, onClose}) => {

	
		const ElectionResults = () => {
			const viewResults = getPublicResults();
			console.log(viewResults);
	
			return (
				<viewResults/>
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
