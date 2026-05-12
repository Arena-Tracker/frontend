import { Heading, Container, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const UserPage = ({ user }) => {
  const navigate = useNavigate();
  return (
    <Container py={10}>
      <Heading>Salut, {user.name}! (Rol: Utilizator)</Heading>
      <Button mt={4} onClick={() => navigate("/")}>
        Logout
      </Button>
    </Container>
  );
};
export default UserPage;
