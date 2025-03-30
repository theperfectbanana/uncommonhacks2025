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
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useBudget } from "../context/BudgetContext";
import { useState, useEffect } from "react";

const InvestmentDetails = ({
  button,
  assets,
  initialInvestments,
  finalValues,
}) => {
  const { remainingBudget } = useBudget();
  const initialBudget = 5000;

  // Calculate total profit
  const totalInvested = Object.values(initialInvestments).reduce(
    (sum, val) => sum + val,
    0,
  );
  const totalFinalValue = Object.values(finalValues).reduce(
    (sum, val) => sum + val,
    0,
  );
  const totalProfit = totalFinalValue - totalInvested;
  const percentageProfit = ((totalProfit / totalInvested) * 100 || 0).toFixed(
    2,
  );

  // Calculate individual profits
  const individualProfits = assets.map((asset) => {
    const initial = initialInvestments[asset.id] || 0;
    const final = finalValues[asset.id] || 0;
    const profit = final - initial;
    const roi = initial > 0 ? ((profit / initial) * 100).toFixed(2) : 0;

    return {
      name: asset.name,
      invested: initial,
      profit: profit,
      roi: roi,
    };
  });

  return (
    <VStack spacing={6} h={"full"} w={"full"}>
      <StatGroup>
        <Stat flex={1} borderRight pr={10} marginRight={5}>
          <StatLabel>Total Profit</StatLabel>
          <StatNumber color={totalProfit >= 0 ? "green.400" : "red.400"}>
            ${Math.abs(totalProfit).toFixed(2)}
          </StatNumber>
          <StatHelpText>
            <StatArrow type={totalProfit >= 0 ? "increase" : "decrease"} />
            {percentageProfit}%
          </StatHelpText>
        </Stat>
        <Stack direction="row" h="100px" borderColor={"gray"} p={2}>
          <Divider orientation="vertical" />
        </Stack>
        <Stat flex={1} pl={10} marginLeft={5}>
          <StatLabel>Portfolio Value</StatLabel>
          <StatNumber>${totalFinalValue.toFixed(2)}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {((totalFinalValue / initialBudget) * 100).toFixed(2)}%
          </StatHelpText>
        </Stat>
      </StatGroup>

      <TableContainer w={"full"} h={"70%"}>
        <Table variant={"simple"} size={"md"}>
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th>Invested</Th>
              <Th>Profit</Th>
              <Th>ROI</Th>
            </Tr>
          </Thead>
          <Tbody>
            {individualProfits.map((profitData, index) => (
              <Tr key={index}>
                <Td>{profitData.name}</Td>
                <Td>${profitData.invested.toFixed(2)}</Td>
                <Td color={profitData.profit >= 0 ? "green.400" : "red.400"}>
                  ${Math.abs(profitData.profit).toFixed(2)}
                </Td>
                <Td color={profitData.roi >= 0 ? "green.400" : "red.400"}>
                  {profitData.roi}%
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {button}
    </VStack>
  );
};

export default InvestmentDetails
