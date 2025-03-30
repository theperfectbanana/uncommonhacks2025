import { Container, Flex, Text, HStack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { GiConsoleController } from "react-icons/gi";
import { SiApplearcade } from "react-icons/si";
import { FaTrophy } from "react-icons/fa";
import "@fontsource/fusion-pixel-12px-proportional-sc";

const Navbar = () => {
  return (
    <Container maxW={"100%"} px={0}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
        bgGradient={"linear(to-r, yellow.500, orange.500)"}
        padding={4}
      >
        <Text
          fontSize={{ base: "22", sm: "40" }}
          fontWeight={"bold"}
          fontFamily={"Tiny5"}
          display={"flex"}
          alignItems={"center"}
          gap={"8px"}
        >
          <Link to={"/"}>Retro Trader</Link>
          <SiApplearcade />
        </Text>
        <HStack spacing={2} alignItems={"center"}>
          <Link to={"/create"}>
            <Button>
              <HStack>
                <Text>Simulate Portfolio</Text>
                <GiConsoleController fontSize={30} />
              </HStack>
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
