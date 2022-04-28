import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useToast } from '@chakra-ui/react'
import React from 'react'
import { showInterest } from '../utils';

export default function ContestAlert({isOpen, onClose,role, name}) {
    const cancelRef= React.useRef();
    const toast = useToast();

    const contest = () => {

        showInterest(name,role, window.ethereum).then(r=> {
            onClose();
            toast({
                title:"Congratulations",
                description:"Your wish to contest has been successfully noted",
                status:"success",
                duration: 5000,
                isClosable:true
            });
        }).catch(r => {
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

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold"> Contest for {role}</AlertDialogHeader>
                <AlertDialogBody>
                    Are you sure you want to contest for the post of {role}. You cannot undo this afterwards.
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="orange" onClick={contest} ml={3}>
                        Yes, go ahead
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
  )
}
