import AssetCard from "../components/AssetCard";
import { Box, Button, Center, HStack, SimpleGrid } from "@chakra-ui/react";
import Graph from "../components/Graph";
import InvestmentDetails from "../components/InvestmentDetails";
import predictAssetValues from "../../../backend/retroGameAssets.js";
import { useState } from "react";
import { useBudget } from "../context/BudgetContext";

const CreateSimulation = () => {
  const { remainingBudget, deductPurchase } = useBudget();
  const [submissionObject, setSubmissionObject] = useState({});
  const [graphDataSet, setGraphDataSet] = useState([]); // State for graph data
  const [initialInvestments, setInitialInvestments] = useState({});
  const [finalValues, setFinalValues] = useState({});

  const assets = [
    {
      id: 1,
      name: "NES Cartridge",
      price: 750,
      image:
        "https://i.etsystatic.com/8948780/r/il/d05f1c/2249784869/il_fullxfull.2249784869_m0jy.jpg",
      stock: "NTDOY",
    },
    {
      id: 2,
      name: "SNES Console",
      price: 425,
      image:
        "https://s.yimg.com/ny/api/res/1.2/wFkwHBZRWi62yYz4l0QQag--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD03ODQ-/https://s.yimg.com/os/en_US/News/BGR_News/nintendo-snes-console.jpg?quality=98&strip=all",
      stock: "NTDOY",
    },
    {
      id: 3,
      name: "Sega Genesis",
      price: 250,
      image:
        "https://retrogamingofdenver.com/cdn/shop/products/image_19a34d5d-7ef8-4b4c-83a6-534f56023e5e.jpg?v=1723739633",
      stock: "SGAMY",
    },
    {
      id: 4,
      name: "Arcade Machine",
      price: 2500,
      image:
        "https://assets.wfcdn.com/im/95366789/resize-h400-w400%5Ecompr-r85/2705/270509742/412+Classic+Retro+Games+Tabletop+Arcade+Machine+by+Doc+and+Pies+Arcade+Factory+%28Yellow%29.jpg",
      stock: "NTDOY",
    },
    {
      id: 5,
      name: "Pokémon Cartridge",
      price: 1300,
      image:
        "https://ae01.alicdn.com/kf/S3fe6bad037af4061a826071dda2b8f060/Pokemon-GB-GBC-Card-16-Bit-Video-Game-Cartridge-Console-Card-Gameboy-Color-Classic-Game-Collect.jpg",
      stock: "NTDOY",
    },
  ];

  const handleAssetPurchase = (assetId, quantity) => {
    console.log("ID:", assetId);
    console.log("Quantity:", quantity);

    const asset = assets.find((a) => a.id === assetId);
    const totalCost = asset.price * quantity;

    deductPurchase(totalCost);

    setSubmissionObject((prev) => ({
      ...prev,
      [assetId]: quantity,
    }));
  };

  const handleSubmission = async () => {
    try {
      if (!submissionObject || Object.keys(submissionObject).length === 0) {
        console.log("No assets selected");
        return;
      }

      let dataset = [];
      const newInitialInvestments = {};
      const newFinalValues = {};

      for (const [assetIdStr, quantity] of Object.entries(submissionObject)) {
        const assetId = parseInt(assetIdStr);
        const asset = assets.find((a) => a.id === assetId);

        // Get predictions for this asset
        const predictions = await predictAssetValues(assetId);

        if (predictions?.length > 0) {
          const initialInvestment = asset.price * quantity;
          const finalValue = predictions[predictions.length - 1] * quantity;

          newInitialInvestments[assetId] = initialInvestment;
          newFinalValues[assetId] = finalValue;

          dataset.push(predictions.map((value) => value * quantity));
        }
      }

      setInitialInvestments(newInitialInvestments);
      setFinalValues(newFinalValues);

      const graphDataSet = sumColumns(dataset);
      setGraphDataSet(graphDataSet);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const sumColumns = (matrix) => {
    if (matrix.length === 0 || matrix[0].length === 0) return [];

    return matrix[0].map((_, columnIndex) =>
      matrix.reduce((sum, row) => sum + (row[columnIndex] || 0), 0),
    );
  };

  return (
    <Box>
      <HStack spacing={4} align={"stretch"} w={"full"}>
        <Box
          flex={1}
          maxW={"65%"}
          rounded={"xl"}
          padding={8}
          margin={9}
          marginRight={4}
          bgColor={"rgb(35,20,60)"}
          overflow={"hidden"}
          shadow={"lg"}
          transition={"all 0.3s"}
          position={"relative"}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <Graph data={graphDataSet} /> {/* Pass updated graph data */}
          </div>
        </Box>
        <Box
          flex={1}
          maxW={"35%"}
          rounded={"xl"}
          padding={8}
          margin={9}
          marginLeft={4}
          bgColor={"rgb(35,20,60)"}
          overflow={"hidden"}
          shadow={"lg"}
          transition={"all 0.3s"}
          position={"relative"}
        >
          <InvestmentDetails
            button={[
              <Box mt={0} key={0}>
                <Button onClick={handleSubmission}>Run Simulation</Button>
              </Box>,
            ]}
            assets={assets}
            initialInvestments={initialInvestments}
            finalValues={finalValues}
          />
        </Box>
      </HStack>
      <SimpleGrid
        columns={{
          base: 1,
          md: 3,
          lg: 5,
        }}
        spacing={9}
        w={"full"}
        padding={9}
        paddingTop={2}
      >
        {assets.map((asset, index) => (
          <AssetCard
            key={index}
            asset={asset}
            purchase={handleAssetPurchase}
            remainingBudget={remainingBudget}
            currentQuantity={submissionObject[asset.id] || 0}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CreateSimulation;
