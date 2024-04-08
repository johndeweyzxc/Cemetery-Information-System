import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonDB from "../data/PersonDB";
import { useEffect, useState } from "react";
import { UniqueAccomodatedPersons } from "../models/Models";
import { Timestamp } from "firebase/firestore";

function DrawerList(
  isLoggedIn: boolean,
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  let logoutBtn;
  if (isLoggedIn) {
    logoutBtn = (
      <ListItemButton>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary={"Logout"} />
      </ListItemButton>
    );
  }

  return (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItemButton onClick={() => (window.location.href = "/")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItemButton>

        {logoutBtn}

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

interface PeopleHeaderProps {
  DrawerOpen: boolean;
  SetDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function PeopleHeader(props: PeopleHeaderProps) {
  return (
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
          People
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function People() {
  const columns: GridColDef<(typeof peoples)[number]>[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "ClientName",
      headerName: "Client Name",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "DeceasedPersonName",
      headerName: "Deceased Person Name",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "GraveLocation",
      headerName: "Location",
      type: "number",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Born",
      headerName: "Born",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Died",
      headerName: "Died",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [person, setPerson] = useState<UniqueAccomodatedPersons>({
    id: "",
    ClientName: "",
    DeceasedPersonName: "",
    GraveLocation: 0,
    Born: "",
    Died: "",
    AccommodatedAt: Timestamp.fromDate(new Date()).toDate(),
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // NOTE: peoples contains objects of type UniqueAccomodatedPersons
  const [peoples, setPeoples] = useState<Object[]>([]);

  useEffect(() => {
    const unsubscribeAuth = PersonDB.ListenAuth((value) =>
      setIsLoggedIn(value)
    );
    const unsubscribePeoples = PersonDB.ListenPeople((values) =>
      setPeoples(values)
    );

    return () => {
      // Cleanup listener when the component unmounts
      unsubscribeAuth();
      unsubscribePeoples();
    };
  }, []);

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    if (isLoggedIn) {
      setPerson(params.row);
      setOpenDialog(true);
    }
  };

  const deleteCb = (isSuccess: boolean) => {
    if (!isSuccess) {
      alert("Failed to delete document in DeceasedPersons");
    }
  };

  return (
    <>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {DrawerList(isLoggedIn, setDrawerOpen)}
      </Drawer>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{"Delete document"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete document with id {person.id} from the
            database?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button
            color="error"
            onClick={() => {
              PersonDB.DeletePerson(person.id, deleteCb);
              setOpenDialog(false);
            }}
          >
            Delete Person
          </Button>
        </DialogActions>
      </Dialog>
      <div className="font-inter">
        <PeopleHeader DrawerOpen={drawerOpen} SetDrawerOpen={setDrawerOpen} />
        <section className="mx-8 my-8">
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              onRowClick={handleRowClick}
              rows={peoples}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              disableColumnResize={true}
            />
          </Box>
        </section>
      </div>
    </>
  );
}

export default People;
