import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
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
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

import PersonDB from "../data/PersonDB";
import Login from "./Login";
import { UniqueReservations } from "../models/Models";
import { Timestamp } from "firebase/firestore";

interface AdminHeaderProps {
  DrawerOpen: boolean;
  SetDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function AdminHeader(props: AdminHeaderProps) {
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
          Reservation Requests
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function DrawerList(
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItemButton onClick={() => (window.location.href = "/")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            PersonDB.SignOutAsAdmin();
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Logout"} />
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

interface AdminMainComponentProps {
  Reserves: Object[]; // This will contain list of UniqueReservations
}
function AdminMainComponent(props: AdminMainComponentProps) {
  const columns: GridColDef<(typeof props.Reserves)[number]>[] = [
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
  const [person, setPerson] = useState<UniqueReservations>({
    id: "",
    ClientName: "",
    DeceasedPersonName: "",
    GraveLocation: 1,
    Born: "",
    Died: "",
    ReservationCreatedAt: Timestamp.fromDate(new Date()).toDate(),
  });

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setPerson(params.row);
    setOpenDialog(true);
  };

  const deleteReservationRequest = () => {
    const cb = (isSuccess: boolean) => {
      if (!isSuccess) {
        alert("Failed to delete document in Reservations");
      }
    };
    PersonDB.DeleteReservation(person.id, cb);
    setOpenDialog(false);
  };

  const approveReservationRequest = () => {
    const cbApprove = (isSuccess: boolean) => {
      if (!isSuccess) {
        alert(
          "While approving reservation request it failed to add document in DeceasedPersons"
        );
      }
    };

    const cbDelete = (isSuccess: boolean) => {
      if (!isSuccess) {
        alert(
          "While approving reservation request it failed to delete document in Reservations"
        );
      } else {
        PersonDB.AccomodatePerson(person, cbApprove);
      }
    };

    const cbCheckSlot = (isOccupied: boolean) => {
      if (isOccupied) {
        alert(`Grave location ${person.GraveLocation} is already occupied`);
      } else {
        PersonDB.DeleteReservation(person.id, cbDelete);
      }
    };

    PersonDB.IsGraveSlotAvailable(person.GraveLocation, cbCheckSlot);
    setOpenDialog(false);
  };

  return (
    <>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {DrawerList(setDrawerOpen)}
      </Drawer>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Approve reservation?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to approve reservation request and allocate slot for the
            deceased person {person.DeceasedPersonName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={deleteReservationRequest}>
            Delete
          </Button>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={approveReservationRequest} autoFocus>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
      <div className="font-inter">
        <AdminHeader DrawerOpen={drawerOpen} SetDrawerOpen={setDrawerOpen} />
        <section className="mx-8 my-8">
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              onRowClick={handleRowClick}
              rows={props.Reserves}
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

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // NOTE: reserves contains objects of type UniqueReservations
  const [reserves, setReserves] = useState<Object[]>([]);

  useEffect(() => {
    const unsubscribeAuth = PersonDB.ListenAuth((value) =>
      setIsLoggedIn(value)
    );
    const unsubscribeReservations = PersonDB.ListenReservation((reservations) =>
      setReserves(reservations)
    );

    return () => {
      // Cleanup listener when the component unmounts
      unsubscribeAuth();
      unsubscribeReservations();
    };
  }, []);

  return isLoggedIn ? <AdminMainComponent Reserves={reserves} /> : <Login />;
}

export default Admin;
