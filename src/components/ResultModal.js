import React, { useState } from "react";
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

import { seePublicResults, getContract } from "../utils";
const ResultModal = ({ isOpen, onClose }) => {
  const [electionResults, setElectionResults] = useState(null);

  const ElectionResults = () => {
    getContract(window.ethereum).then((contract) => {
      contract.getAllCategories().then((result) => {
        const electionCategories = result;
        seePublicResults(window.ethereum)
          .then((result) => {
            const candidates = result[0];
            let candidateNames = result[1];
            let votesScored = [];
            let candidatesCategory = result[3];

            // parse votes from bigNumber to number
            for (let i = 0; i < result[1].length; i++) {
              votesScored.push(Number(result[2][i]));
            }
            setElectionResults({
              candidates,
              candidateNames,
              votesScored,
              candidatesCategory,
              electionCategories,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });

    return (
      <>
        {electionResults ? (
          <>
            <ol>
              {electionResults.electionCategories.map((category) => (
                <li>
                  {category}
                  <ul>
                    {electionResults.candidatesCategory.map(
                      (canCategory, i) => (
                        <>
                          {category === canCategory && (
                            <li>
                              Candidate Address: {electionResults.candidates[i]}
                              <br /> Candidate Name:
                              {electionResults.candidateNames[i]}
                              <br /> Score:
                              {electionResults.votesScored[i]}
                              <br />
                            </li>
                          )}
                        </>
                      )
                    )}
                  </ul>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p>Loading election results...</p>
        )}
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onOpen={ElectionResults}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Election Results </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ElectionResults />
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

export default ResultModal;