import "./App.css";
import { Card, Container, Nav, Navbar } from "react-bootstrap";
import {
  BsFillGearFill,
  BsFillPeopleFill,
  BsFillPersonPlusFill,
} from "react-icons/bs";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";

import Logo from "./assets/images/logo.png";
import Background from "./assets/images/background.jpg";
import MapPhoto from "./assets/images/map-photo.png";
import Card1 from "./assets/images/cards/1.png";
import Card2 from "./assets/images/cards/2.png";
import Card3 from "./assets/images/cards/3.png";
import Reservation from "./pages/Reservation";
import People from "./pages/People";
import Admin from "./pages/Admin";
import { useState } from "react";

function DrawerList(
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItemButton onClick={() => (window.location.href = "/Reservation")}>
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary={"Reservation"} />
        </ListItemButton>

        <ListItemButton onClick={() => (window.location.href = "/People")}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={"People"} />
        </ListItemButton>

        <ListItemButton onClick={() => setDrawerOpen(false)}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText primary={"Close"} />
        </ListItemButton>
      </List>
    </Box>
  );
}

interface AppHeaderSmallDeviceProps {
  DrawerOpen: boolean;
  SetDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function AppHeaderSmallDevice(props: AppHeaderSmallDeviceProps) {
  return (
    <div className="hidden max-sm:block">
      <AppBar position="static" sx={{ backgroundColor: "green" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => props.SetDrawerOpen(props.DrawerOpen ? false : true)}
          >
            <MenuIcon className="cursor-pointer" />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Eternal Ease
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

function AppHeader() {
  return (
    <div className="block max-sm:hidden">
      <Navbar className="border font-inter">
        <div className="mx-12 flex w-full justify-between">
          <Navbar.Brand href="#home">
            <img
              alt="Eternal Ease logo"
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Eternal Ease
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="/Reservation">
              <div className="flex items-center">
                <BsFillPersonPlusFill className="mr-1" />
                Reservation
              </div>
            </Nav.Link>
            <Nav.Link href="/People">
              <div className="flex items-center">
                <BsFillPeopleFill className="mr-1" />
                People
              </div>
            </Nav.Link>
          </Nav>
        </div>
      </Navbar>
    </div>
  );
}

function AppFooter() {
  return (
    <section className="pt-12 max-md:hidden">
      <Navbar className="font-inter">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt="Eternal Ease logo"
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Eternal Ease
          </Navbar.Brand>
          <div>
            <Nav.Link href="/Reservation">
              <div className="flex items-center">
                <BsFillPersonPlusFill className="mr-1" />
                Reservation
              </div>
            </Nav.Link>
            <Nav.Link href="/People">
              <div className="flex items-center my-3">
                <BsFillPeopleFill className="mr-1" />
                People
              </div>
            </Nav.Link>
            <Nav.Link href="/Admin">
              <div className="flex items-center">
                <BsFillGearFill className="mr-1" />
                Admin
              </div>
            </Nav.Link>
          </div>
          <div>
            <b>Contact Information:</b>
            <br />
            <p className="m-0">Head Office: 4/F Dominga Bldg. III, Chino</p>
            <p className="m-0">Roces Ave. corner Dela Rosa St., Makati City</p>
            <p className="m-0">Trunkline: (02) 8810-01-76 to 80</p>
            <p className="m-0">Office Hours: Mon - Fri, 8:00 am to 5:00 pm</p>
            <p className="m-0">Email: info@eternalease.ph</p>
          </div>
        </Container>
      </Navbar>
      <div className="flex bg-green-700 justify-between text-white py-6 px-6 mt-12">
        <div>© Copyright 2024 | All Rights Reserved.</div>
        <div>Terms & Conditions | Privacy Policy</div>
      </div>
    </section>
  );
}

function AppBody() {
  return (
    <div className="w-full h-full font-inter">
      <img
        src={Background}
        className="z-[-1] absolute w-screen h-[75%] object-cover"
        alt="Background grave yard for Eternal Ease"
      />
      <div className="absolute w-screen h-[75%] z-[-1] bg-black/50" />
      <section className="w-screen h-[75%] text-white flex justify-around items-center">
        <div className="mx-8">
          <h2>Digital Mapping of Eternal Ease</h2>
          <p>
            Welcome to Eternal Ease, where tradition meets technology.{" "}
            <br className="lg:visible max-md:hidden" /> Explore a modern
            approach to managing and honoring the{" "}
            <br className="lg:visible max-md:hidden" /> departed. Our
            comprehensive cemetery information system{" "}
            <br className="lg:visible max-md:hidden" /> offers seamless grave
            plotting, meticulous management, and{" "}
            <br className="lg:visible max-md:hidden" /> thoughtful allocation
            services, ensuring a dignified and{" "}
            <br className="lg:visible max-md:hidden" /> compossionate resting
            place for your loved ones.
          </p>
        </div>
        <img
          src={MapPhoto}
          className="w-96 mx-8 size-fit rounded-2xl max-md:collapse"
          alt="Digital map of Eternal Ease"
        />
      </section>
      <section className="pb-12 border">
        <h3 className="text-center my-12 mx-8">
          High-quality service for your ease and convenience
        </h3>
        <div className="flex max-md:flex-col">
          <Card className="ml-8 max-md:ml-4 max-md:mr-4">
            <Card.Img
              variant="top"
              src={Card1}
              className="h-[32rem] object-cover"
            />
            <Card.Body>
              <Card.Text>
                Our grave plotting feature empowers you to intricately map out
                and organize gravesites within the cemetery grounds. Utilize our
                user-friendly interface to designate specific locations, view
                plot availability, and ensure an efficient and organized layout
                for your loved ones.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="ml-8 mr-8 max-md:ml-4 max-md:mr-4 max-md:my-4">
            <Card.Img
              variant="top"
              src={Card2}
              className="h-[32rem] object-cover"
            />
            <Card.Body>
              <Card.Text>
                We manage all aspects of cemetery with our comprehensive grave
                management system. Keep detailed records of each grave slots,
                including occupant information, burial dates, and reservations.
                Simplify administrative tasks, enhance data accuracy, and gain
                valuable insights.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mr-8 max-md:ml-4 max-md:mr-4">
            <Card.Img
              variant="top"
              src={Card3}
              className="h-[32rem] object-cover"
            />
            <Card.Body>
              <Card.Text>
                Our cemetery information system provides robust allocation
                services, allowing you to submit reservations. Seamlessly
                navigate through available plots, select spaces based on
                preferences. Ensure a dignified and personalized resting place
                for every individual with our allocation services.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </section>
      <AppFooter />
    </div>
  );
}

function AppPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="m-0 p-0 w-screen h-screen">
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {DrawerList(setDrawerOpen)}
      </Drawer>
      <AppHeaderSmallDevice
        DrawerOpen={drawerOpen}
        SetDrawerOpen={setDrawerOpen}
      />
      <AppHeader />
      <AppBody />
    </div>
  );
}

function App() {
  let component = <AppPage />;
  switch (window.location.pathname) {
    case "/":
      component = <AppPage />;
      break;
    case "/Reservation":
      component = <Reservation />;
      break;
    case "/People":
      component = <People />;
      break;
    case "/Admin":
      component = <Admin />;
      break;
    default:
      break;
  }

  return component;
}

export default App;
