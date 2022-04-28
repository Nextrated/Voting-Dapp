import React, {useState, useEffect} from 'react';
import {Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	Box,
	Text,
	VStack, 
	RadioGroup,
	Radio,
	FormLabel, 
	ModalFooter, 
	ModalCloseButton,
	Button
} from "@chakra-ui/react";
import { getCandidates } from "../utils";

const VoteModal = ({isOpen, onClose, category}) => {
	const [loading, setLoading] = useState(false);
	const [candidates, setCandidates] = useState([])
	const [choice, setChoice] = useState("")
	const submitVote = () => {
		onClose()
		console.log("!")
	}

	useEffect(()=>{
		console.log("open")
		getCandidates(window.ethereum).then( r => console.log("res", r))
		.catch(e => console.log(e))
	}, [])

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>

          <ModalHeader>
            Cast your vote here
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              <Text> Candidates for {category} category</Text>

              <FormLabel as="view">Select one candidate of your choice</FormLabel>
              <RadioGroup value={choice} mb={4} >
                <VStack spacing="24px">
                <p>candidates list</p>
     
                </VStack>
              </RadioGroup>
              <ModalFooter>
                
                <Button 
                    colorScheme="orange" 
                    mr={3} 
                    onClick={submitVote}
                    isLoading={loading ? true : false}>
                  Submit
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
	) 
};

export default VoteModal;
