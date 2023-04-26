import React, { useState, useEffect } from "react";
import {
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
  ModalCloseButton,
  Button,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { getCandidates, castVote, getUserBalance, getContract } from "../utils";

const VoteModal = ({ isOpen, onClose, roles, resetBal, currentAccount }) => {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [choiceCandidateForRole, setChoiceCandidateForRole] = useState({});
  /////
  const [choiceCandidate, setChoiceCandidate] = useState([]);
  const [choiceRole, setChoiceRole] = useState([]);
  const [choiceCategoryId, setChoiceCategoryId] = useState([]);
  /////

  const toast = useToast();

  const getBal = () => {
    let bal;
    getUserBalance(window.ethereum, currentAccount).then((res) => {
      const r = parseInt(res._hex, 16);
      bal = r / 10 ** 18;
    });
    return bal;
  };

  const submitVote = () => {
    setLoading(true);
    console.log(choiceCandidateForRole);
    //////
    console.log(choiceCandidate);
    console.log(choiceRole);
    console.log(choiceCategoryId);
    //////
    castVote(window.ethereum, choiceCandidate, choiceRole, choiceCategoryId)
      .then(() => {
        setLoading(false);
        resetBal(getBal);
        onClose();
        toast({
          title: "Congratulations",
          description: "Your Vote has been recorded",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((r) => {
        setLoading(false);
        onClose();
        //  let x = r.toString().split("}")[0].split("{")[1].replace(',"data":', "")
        //  x = JSON.parse(`{${x}}`)
        toast({
          title: "Sorry",
          description: "An error occoured",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const parseContestants = (names, addr, category) => {
    if (names.length === 0) {
      setCandidates([]);
    } else {
      let newArr = [];
      for (let i = 0; i < names.length; i++) {
        let obj = {
          name: names[i],
          addr: addr[i],
          category: category[i],
        };
        newArr.push(obj);
      }
      setCandidates(newArr);
    }
  };

  useEffect(() => {
    //console.log("open")
    getCandidates(window.ethereum)
      .then((r) => parseContestants(r[0], r[1], r[2]))
      .catch((e) =>
        toast({
          title: "Sorry",
          description:
            "An error occured while trying to fetch election contestants",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      );
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cast your vote here</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box>
            <Text mb={3} color="orange">
              {" "}
              Note: You can only select one candidate of your choice for each
              role{" "}
            </Text>
            <form onSubmit={submitVote} mt={2}>
              {roles.map((role, id) => (
                <>
                  <Divider bg="orange" mb={2} h="1px" />
                  <FormLabel as="view">For the position of {role}</FormLabel>
                  <RadioGroup
                    value={setChoiceCandidateForRole.choiceAddr}
                    mb={4}
                  >
                    <VStack spacing="15px">
                      {candidates
                        .filter((x) => x.category === role)
                        .map((candidate, cid) => (
                          <Radio
                            key={cid}
                            value={candidate.addr}
                            mb={3}
                            onChange={async (e) => {
                              const contract = await getContract(
                                window.ethereum
                              );
                              const categoryId = await contract.getCategoryId(
                                role
                              );
                              setChoiceCandidateForRole({
                                choiceAddr: e.target.value,
                                post: role,
                                categoryID: Number(categoryId),
                              });
                              //////
                              setChoiceCandidate([
                                ...choiceCandidate,
                                e.target.value,
                              ]);
                              setChoiceRole([...choiceRole, role]);
                              setChoiceCategoryId([
                                ...choiceCategoryId,
                                Number(categoryId),
                              ]);
                              //////
                            }}
                          >
                            {candidate.name} - {candidate.addr}
                          </Radio>
                        ))}
                    </VStack>
                  </RadioGroup>
                </>
              ))}

              <ModalFooter>
                <Button
                  colorScheme="orange"
                  mr={3}
                  onClick={submitVote}
                  isLoading={loading ? true : false}
                >
                  Submit
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VoteModal;
