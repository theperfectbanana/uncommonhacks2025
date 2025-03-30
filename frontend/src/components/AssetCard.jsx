import { PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  Image,
  Heading,
  Text,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  ModalFooter,
  Button,
  IconButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { useBudget } from "../context/BudgetContext";

const AssetCard = ({ asset, purchase }) => {
  const { remainingBudget } = useBudget();
  const [quantity, setQuantity] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const potentialCost = asset.price * quantity;
  const wouldExceedBudget = potentialCost > remainingBudget;

  return (
    <Box
      shadow={"lg"}
      rounded={"lg"}
      overflow={"hidden"}
      transition={"all 0.3s"}
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      // bgColor={"black"}
      bgColor={"rgb(243,26,26)"}
      // bgColor={"rgb(231,126,125)"}
      position={"relative"}
    >
      <Image
        src={asset.image}
        alt={asset.name}
        h={"60%"}
        w={"full"}
        objectFit={"cover"}
      />
      <Box position={"absolute"} top={2} left={2}>
        <IconButton
          size={"sm"}
          icon={<PlusSquareIcon />}
          onClick={onOpen}
          colorScheme="purple"
          aria-label="Add Asset"
        />
      </Box>

      <Box padding={3}>
        <Heading as={"h3"} size={"sm"} mb={2}>
          {asset.name}
        </Heading>
        <Text fontWeight={"bold"} fontSize={"sm"} mb={4}>
          ${asset.price}
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader alignSelf={"center"}>Purchase Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Quantity to Purchase"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              onFocus={(e) => e.currentTarget.select()}
            />
          </ModalBody>

          <ModalFooter>
            <Flex direction="column" w="100%" justifyContent="flex-start">
              <Text color={wouldExceedBudget ? "red.500" : "inherit"}>
                Price: ${potentialCost}
                {wouldExceedBudget && " (Exceeds budget!)"}
              </Text>
            </Flex>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                purchase(asset.id, quantity);
                onClose();
              }}
              isDisabled={wouldExceedBudget || quantity <= 0}
            >
              Buy
            </Button>
            <Button variant={"ghost"} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AssetCard;
