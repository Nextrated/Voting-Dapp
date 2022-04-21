// import React, {useState, useEffect} from 'react';
// import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,Box,Text,VStack, RadioGroup,Radio,FormLabel, ModalFooter, ModalCloseButton,Button} from "@vhakra-ui/react";

// const VoteModal = ({isOpen, onClose}) => {
// 	// useEffect(()=>{

// 	// }, [])
//     return (
//         <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//       >
//         <ModalOverlay />
//         <ModalContent>

//           <ModalHeader>
//             Cast your vote here
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <Box>
//               <Text> Nominees for {category} category</Text>

//               <FormLabel as="view">Select one candidate of your choice</FormLabel>
//               <RadioGroup value={type} mb={4} >
//                 <VStack spacing="24px">
//                 {candidates.map(c => {
//                 	<Radio value={c.contestant} onChange={e => setChoice(e.target.value)}>{c.name} - {c.contestant}</Radio>
//                 })}
//                 </HStack>
//               </RadioGroup>
//               <ModalFooter>
                
//                 <Button 
//                     colorScheme="orange" 
//                     mr={3} 
//                     onClick={submitVote}
//                     isLoading={submitting ? true : false}>
//                   Submit
//                 </Button>
//                 <Button onClick={onClose}>Cancel</Button>
//               </ModalFooter>
//             </Box>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
// 	) 
// };

// export default VoteModal;
