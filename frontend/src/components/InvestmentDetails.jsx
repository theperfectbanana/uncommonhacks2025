import {
  Box,
  Divider,
  Stack,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

const InvestmentDetails = () => {
  return (
    <VStack spacing={6} h={"full"} w={"full"}>
      <StatGroup>
        <Stat flex={1} borderRight pr={10} marginRight={5}>
          <StatLabel>Portfolio</StatLabel>
          <StatNumber>$23,489</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            134.89%
          </StatHelpText>
        </Stat>
        <Stack direction="row" h="100px" borderColor={"gray"} p={2}>
          <Divider orientation="vertical" />
        </Stack>
        <Stat flex={1} pl={10} marginLeft={5}>
          <StatLabel>Bank Account</StatLabel>
          <StatNumber>$173</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            {10000 - 173}
          </StatHelpText>
        </Stat>
      </StatGroup>
      <TableContainer w={"full"}>
        <Table variant={"simple"} size={"md"}>
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th>Invested Amt</Th>
              <Th>ROI</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>100</Td>
              <Td>+10%</Td>
            </Tr>
            <Tr>
              <Td>1</Td>
              <Td>100</Td>
              <Td>+10%</Td>
            </Tr>
            <Tr>
              <Td>1</Td>
              <Td>100</Td>
              <Td>+10%</Td>
            </Tr>
            <Tr>
              <Td>1</Td>
              <Td>100</Td>
              <Td>+10%</Td>
            </Tr>
            <Tr>
              <Td>1</Td>
              <Td>100</Td>
              <Td>+10%</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default InvestmentDetails;
