import AssetCard from "../components/AssetCard";
import { Box, HStack, SimpleGrid } from "@chakra-ui/react";
import Graph from "../components/Graph";
import InvestmentDetails from "../components/InvestmentDetails";

const CreateSimulation = () => {
  const assets = [
    {
      id: 1,
      name: "NES Cartridge",
      price: 10,
      image:
        "https://i.etsystatic.com/8948780/r/il/d05f1c/2249784869/il_fullxfull.2249784869_m0jy.jpg",
    },
    {
      id: 2,
      name: "SNES Console",
      price: 10,
      image:
        "https://s.yimg.com/ny/api/res/1.2/wFkwHBZRWi62yYz4l0QQag--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD03ODQ-/https://s.yimg.com/os/en_US/News/BGR_News/nintendo-snes-console.jpg?quality=98&strip=all",
    },
    {
      id: 3,
      name: "Sega Genesis",
      price: 10,
      image: "https://retrogamingofdenver.com/cdn/shop/products/image_19a34d5d-7ef8-4b4c-83a6-534f56023e5e.jpg?v=1723739633"
    },
    {
      id: 4,
      name: "Arcade Machine",
      price: 10,
      image: "https://assets.wfcdn.com/im/95366789/resize-h400-w400%5Ecompr-r85/2705/270509742/412+Classic+Retro+Games+Tabletop+Arcade+Machine+by+Doc+and+Pies+Arcade+Factory+%28Yellow%29.jpg"
    },
    {
      id: 5,
      name: "Pokémon Cartridge",
      price: 10,
      image: "https://ae01.alicdn.com/kf/S3fe6bad037af4061a826071dda2b8f060/Pokemon-GB-GBC-Card-16-Bit-Video-Game-Cartridge-Console-Card-Gameboy-Color-Classic-Game-Collect.jpg"
    },
  ];

  return (
    <Box>
      <HStack spacing={4} align={"stretch"} w={"full"}>
        <Box
          flex={1}
          maxW={"65%"}
          maxH={"100%"}
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
            <Graph
              data={[
                9450, 9145, 9495, 8642, 8646, 7887, 8615, 8285, 7546, 8094,
                8464, 7951,
              ]}
            />
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
          <InvestmentDetails />
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
          <AssetCard key={index} asset={asset} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CreateSimulation;
