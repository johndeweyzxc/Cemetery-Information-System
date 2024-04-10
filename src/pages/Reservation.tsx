import { DeceasedPerson } from "../models/Models";
import { ChangeEvent, FormEvent, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Alert,
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import dayjs, { Dayjs } from "dayjs";
import Button from "@mui/material/Button";
import PublishIcon from "@mui/icons-material/Publish";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import PersonDB from "../data/PersonDB";

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

interface AdminHeaderProps {
  DrawerOpen: boolean;
  SetDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function ReservationHeader(props: AdminHeaderProps) {
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
          Reservation
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

interface ReservationFormProps {
  SetOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  SetDialogText: React.Dispatch<React.SetStateAction<string>>;
  SetSnackBar: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      text: string;
      severity: string;
    }>
  >;
}
function ReservationForm(props: ReservationFormProps) {
  // TODO: Check all available slot in the database and only show available slot in the UI
  const availaleLocations: number[] = Array.from(
    { length: 30 },
    (_, i) => i + 1
  );

  const [deceasedPerson, setDeceasedPerson] = useState<DeceasedPerson>({
    ClientName: "",
    DeceasedPersonName: "",
    GraveLocation: 1,
    Born: "2023-04-04",
    Died: "2023-04-04",
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement input validation
    if (deceasedPerson.ClientName.length === 0) {
      props.SetSnackBar({
        isOpen: true,
        text: "Text input cannot be empty",
        severity: "error",
      });
      return;
    }

    const cbUpload = (isSuccess: boolean) => {
      if (isSuccess) {
        window.location.href = "/";
      } else {
        props.SetOpenDialog(true);
      }
    };

    const cbAvailability = (isAvail: boolean) => {
      if (!isAvail) {
        props.SetDialogText(
          `Grave location ${deceasedPerson.GraveLocation} is not available for reservation, please select another grave location.`
        );
        props.SetOpenDialog(true);
      } else {
        PersonDB.UploadReservation(deceasedPerson, cbUpload);
      }
    };

    PersonDB.IsAvailableForReservation(
      null,
      deceasedPerson.GraveLocation,
      cbAvailability,
      false
    );
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeceasedPerson({ ...deceasedPerson, [name]: value });
  };

  const onChangeDateInput = (value: Dayjs | null, isBorn: boolean) => {
    if (value !== null || value !== undefined) {
      if (isBorn) {
        setDeceasedPerson({
          ...deceasedPerson,
          Born: (value! as Dayjs).format("YYYY-MM-DD"),
        });
        return;
      }
      setDeceasedPerson({
        ...deceasedPerson,
        Died: (value! as Dayjs).format("YYYY-MM-DD"),
      });
    }
  };

  return (
    <form className="m-0 p-0 min-w-[50vw]" onSubmit={onSubmit}>
      <Typography
        variant="h5"
        color="inherit"
        component="div"
        sx={{ marginBottom: "1.5rem" }}
      >
        Create Reservation Requests
      </Typography>
      <TextField
        id="outlined-basic"
        label="Client Name"
        variant="outlined"
        type="text"
        name="ClientName"
        sx={{ width: "100%", marginBottom: "1rem" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
        value={deceasedPerson.ClientName}
        onChange={onChangeInput}
      />
      <TextField
        id="outlined-basic"
        label="Deceased Person Name"
        variant="outlined"
        type="text"
        name="DeceasedPersonName"
        sx={{ width: "100%", marginBottom: "1rem" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
        value={deceasedPerson.DeceasedPersonName}
        onChange={onChangeInput}
      />
      <TextField
        id="outlined-basic"
        label="Grave Location"
        variant="outlined"
        type="text"
        name="GraveLocation"
        placeholder="Available locations from 1 to 30"
        select
        sx={{ width: "100%", marginBottom: "1rem" }}
        value={deceasedPerson.GraveLocation}
        onChange={onChangeInput}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      >
        {availaleLocations.map((value, index) => {
          return (
            <MenuItem key={index} value={value}>
              {value}
            </MenuItem>
          );
        })}
      </TextField>
      <div className="flex w-full mb-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Born"
            sx={{ width: "100%", marginRight: ".25rem" }}
            value={dayjs(deceasedPerson.Born)}
            onChange={(value) => onChangeDateInput(value, true)}
          />
          <DatePicker
            label="Died"
            sx={{ width: "100%", marginLeft: ".25rem" }}
            value={dayjs(deceasedPerson.Died)}
            onChange={(value) => onChangeDateInput(value, false)}
          />
        </LocalizationProvider>
      </div>
      <Button
        variant="contained"
        size="large"
        endIcon={<PublishIcon />}
        type="submit"
        sx={{ width: "100%" }}
      >
        Submit
      </Button>
    </form>
  );
}

function Reservation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogText, setDialogText] = useState(
    "There is an error creating reservation requests, it could be an insufficient permission to the database."
  );
  const [openDialog, setOpenDialog] = useState(false);

  // Snackbar
  const [snackBar, setSnackBar] = useState({
    isOpen: false,
    text: "",
    severity: "success",
  });
  const closeSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBar({
      isOpen: false,
      text: snackBar.text,
      severity: snackBar.severity,
    });
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
          {"Reservation failed"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <ReservationHeader
        DrawerOpen={drawerOpen}
        SetDrawerOpen={setDrawerOpen}
      />
      <section className="my-12 flex justify-center items-center ml-4 mr-4">
        <ReservationForm
          SetOpenDialog={setOpenDialog}
          SetDialogText={setDialogText}
          SetSnackBar={setSnackBar}
        />
      </section>
      <Snackbar
        open={snackBar.isOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
      >
        {snackBar.severity === "success" ? (
          <Alert
            onClose={closeSnackbar}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackBar.text}
          </Alert>
        ) : (
          <Alert
            onClose={closeSnackbar}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackBar.text}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}

export default Reservation;
