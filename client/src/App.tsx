import { useNavigate } from "./hooks/useNavigation";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Countdown from "./components/Countdown";
import OurStory from "./components/OurStory";
import WeddingDetails from "./components/WeddingDetails";
import Gallery from "./components/Gallery";
// import WeddingParty from "./components/WeddingParty";
import Rsvp from "./components/Rsvp";
import Footer from "./components/Footer";
import Admin from "./components/Pages/admin/Admin";

const App = () => {
  const { currentPath, navigateTo } = useNavigate();

  if (currentPath === "/admin" || currentPath.startsWith("/admin/")) {
    return <Admin onNavigateHome={() => navigateTo("/")} />;
  }

  return (
    <Box component="main" sx={{ overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <Countdown />
      <OurStory />
      <WeddingDetails />
      <Gallery />
      {/* <WeddingParty /> */}
      <Rsvp />
      <Footer />
    </Box>
  );
};

export default App;
