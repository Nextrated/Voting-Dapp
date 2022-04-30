import { 
    AlertDialog,
    AlertDialogBody, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogOverlay, 
    Button, 
    useToast,
    Modal,
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
    useDisclosure,
    ModalCloseButton } from '@chakra-ui/react'
import React, {useState} from 'react'
import { showInterest, getUserBalance } from '../utils';

const Alert = ({isOpen, cancelRef, onClose, choiceRole, contest, loading}) => {
        return (
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold"> Contest for {choiceRole}</AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to contest for the post of {choiceRole}. You cannot undo this afterwards.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="orange" onClick={contest} ml={3} isLoading={loading}>
                                Yes, go ahead
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        )
    }

export default function ContestAlert({isModalOpen, onModalClose,role, name, resetBal, currentAccount}) {
    const [choiceRole, setChoiceRole] = useState("");
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef= React.useRef();
    const toast = useToast();

    const getBal = () => {
        let  bal;
        getUserBalance(window.ethereum, currentAccount).then((res) => {
                const r = parseInt((res._hex), 16);
                bal =  r/(10 ** 18);
            })
        return bal;
    }

    const contest = () => {
        setLoading(true)
        showInterest(name,choiceRole, window.ethereum).then(r=> {
            setLoading(false);
            onClose();
            resetBal(getBal)
            toast({
                title:"Congratulations",
                description:"Your wish to contest has been successfully noted",
                status:"success",
                duration: 5000,
                isClosable:true
            });

        }).catch(r => {
            setLoading(false);
             onClose();
            let x = r.toString().split("}")[0].split("{")[1].replace(',"data":', "")
            x = JSON.parse(`{${x}}`)
            toast({
                title:"Sorry",
                description:x.message,
                status:"error",
                duration: 5000,
                isClosable:true
            });
        })
    }

    const showAlert = () => {
        onModalClose();
        onOpen();
    }

  return (
    <>
        <Modal
        isOpen={isModalOpen}
        onClose={onModalClose}
      >
        <ModalOverlay />
        <ModalContent>

          <ModalHeader>
            What role are you contesting for?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              <Text color="orange"> Note: You can only contest for one role in this election</Text>

              <FormLabel as="view" mt={3}>Select one role of your choice</FormLabel>
              <RadioGroup value={choiceRole} mb={4} >
                <VStack align="stretch">
                {/*<p>candidates list</p>*/}
                    {role.map( r => <Radio value={r.role} mb={3} onChange={e => setChoiceRole(e.target.value)}>{r.role}</Radio>)}       
                </VStack>
              </RadioGroup>
              <ModalFooter>
                
                <Button 
                    colorScheme="orange" 
                    mr={3} 
                    onClick={showAlert}
                >
                  Contest
                </Button>
                <Button onClick={onModalClose}>Cancel</Button>
              </ModalFooter>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Alert isOpen={isOpen} onClose={onClose} loading={loading} cancelRef={cancelRef} contest={contest} choiceRole={choiceRole}/>
    </>
  )
}
