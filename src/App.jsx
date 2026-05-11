import { Button, HStack, Container } from "@chakra-ui/react";

function App() {
  return (
    <Container padding="10">
      <HStack gap="4">
        <Button colorPalette="blue" variant="solid">
          Buton Albastru
        </Button>
        <Button colorPalette="red" variant="outline">
          Buton Roșu
        </Button>
      </HStack>
    </Container>
  );
}

export default App;
