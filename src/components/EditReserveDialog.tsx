import {
  Alert,
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublishIcon from "@mui/icons-material/Publish";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UniqueReservations } from "../models/Models";
import { ChangeEvent, FormEvent, useState } from "react";
import PersonDB from "../data/PersonDB";

interface EditReserveDialogFormProps {
  SetOpenThisDialog: React.Dispatch<React.SetStateAction<boolean>>;
  Person: UniqueReservations;
  SetSnackBar: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      text: string;
      severity: string;
    }>
  >;
}
function EditReserveDialogForm(props: EditReserveDialogFormProps) {
  // TODO: Check all available slot in the database and only show available slot in the UI
  const availaleLocations: number[] = Array.from(
    { length: 30 },
    (_, i) => i + 1
  );

  const [person, setPerson] = useState<UniqueReservations>({
    ClientName: props.Person.ClientName,
    DeceasedPersonName: props.Person.DeceasedPersonName,
    GraveLocation: props.Person.GraveLocation,
    Born: props.Person.Born,
    Died: props.Person.Died,
    ReservationCreatedAt: props.Person.ReservationCreatedAt,
    id: props.Person.id,
  });

  const [btnDisabled, setBtnDisabled] = useState(true);

  const detectChange = (name: string, value: string) => {
    /*
      Compares if there is any changes made into the reservation request,
      if there is then enable the SAVE CHANGES button
    */
    const oldPersonJson = JSON.parse(JSON.stringify(props.Person));

    if (value !== oldPersonJson[name]) {
      // If new value is not equals to the old value
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    detectChange(name, value);
    setPerson({ ...person, [name]: value });
  };

  const onChangeDateInput = (value: Dayjs | null, isBorn: boolean) => {
    const dateStr = (value! as Dayjs).format("YYYY-MM-DD");

    if (value !== null || value !== undefined) {
      if (isBorn) {
        detectChange("Born", dateStr);
        setPerson({
          ...person,
          Born: dateStr,
        });
        return;
      }

      detectChange("Died", dateStr);
      setPerson({
        ...person,
        Died: dateStr,
      });
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    // TODO: Implement input validation
    e.preventDefault();

    const cbUpdate = (isSuccess: boolean) => {
      if (isSuccess) {
        props.SetOpenThisDialog(false);
      } else {
        props.SetSnackBar({
          isOpen: true,
          text: "Update was not successfull",
          severity: "error",
        });
      }
    };

    const cbAvailability = (isAvail: boolean) => {
      if (!isAvail) {
        props.SetSnackBar({
          isOpen: true,
          text: "Grave location unavailable",
          severity: "error",
        });

        // Reset the input values to default values
        setPerson({
          ClientName: props.Person.ClientName,
          DeceasedPersonName: props.Person.DeceasedPersonName,
          GraveLocation: props.Person.GraveLocation,
          Born: props.Person.Born,
          Died: props.Person.Died,
          ReservationCreatedAt: props.Person.ReservationCreatedAt,
          id: props.Person.id,
        });
        setBtnDisabled(true);
      } else {
        PersonDB.EditReservation(person.id, person, cbUpdate);
      }
    };

    PersonDB.IsAvailableForReservation(
      person.id,
      person.GraveLocation,
      cbAvailability,
      true
    );
  };

  return (
    <form className="m-0 p-0 min-w-[50vw]" onSubmit={onSubmit}>
      <Typography
        variant="h5"
        color="inherit"
        component="div"
        sx={{ marginBottom: "1.5rem" }}
      >
        Edit Reservation Requests
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
        value={person.ClientName}
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
        value={person.DeceasedPersonName}
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
        value={person.GraveLocation}
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
            value={dayjs(person.Born)}
            onChange={(value) => onChangeDateInput(value, true)}
          />
          <DatePicker
            label="Died"
            sx={{ width: "100%", marginLeft: ".25rem" }}
            value={dayjs(person.Died)}
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
        disabled={btnDisabled}
      >
        Save changes
      </Button>
    </form>
  );
}

export interface EditReserveDialogProps {
  SetOpenThisDialog: React.Dispatch<React.SetStateAction<boolean>>;
  Person: UniqueReservations;
}
export function EditReserveDialog(props: EditReserveDialogProps) {
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

  // Dialog
  const [dialog, setDialog] = useState({
    isOpen: false,
    text: "",
  });

  const deleteReservationRequest = () => {
    const cb = (isSuccess: boolean) => {
      if (!isSuccess) {
        setSnackBar({
          isOpen: true,
          text: "Failed to delete document in Reservations",
          severity: "error",
        });
      } else {
        props.SetOpenThisDialog(false);
      }
    };
    PersonDB.DeleteReservation(props.Person.id, cb);
  };

  const approveReservationRequest = () => {
    const cbApprove = (isSuccess: boolean) => {
      if (!isSuccess) {
        setSnackBar({
          isOpen: true,
          text: "Failed to add document in DeceasedPersons",
          severity: "error",
        });
      } else {
        props.SetOpenThisDialog(false);
      }
    };

    const cbDelete = (isSuccess: boolean) => {
      if (!isSuccess) {
        setSnackBar({
          isOpen: true,
          text: "Failed to delete document in Reservations",
          severity: "error",
        });
      } else {
        PersonDB.AccomodatePerson(props.Person, cbApprove);
      }
    };

    const cbCheckSlot = (isOccupied: boolean) => {
      if (isOccupied) {
        setSnackBar({
          isOpen: true,
          text: `Grave location ${props.Person.GraveLocation} is already occupied`,
          severity: "error",
        });
      } else {
        PersonDB.DeleteReservation(props.Person.id, cbDelete);
      }
    };

    PersonDB.IsAvailaleForAccommodation(
      props.Person.GraveLocation,
      cbCheckSlot
    );
    props.SetOpenThisDialog(false);
  };

  return (
    <>
      <AppBar sx={{ position: "relative", backgroundColor: "green" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              props.SetOpenThisDialog(false);
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Close
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              setDialog({
                isOpen: true,
                text: "Do you want to delete this reservation request, this action is irreversible",
              });
            }}
          >
            Delete
          </Button>
          <Button color="inherit" onClick={approveReservationRequest}>
            Approve
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog
        open={dialog.isOpen}
        onClose={() => {
          setDialog({
            isOpen: false,
            text: dialog.text,
          });
        }}
      >
        <DialogTitle>{"Delete reservation"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={deleteReservationRequest}>
            Delete
          </Button>
          <Button
            onClick={() => {
              setDialog({
                isOpen: false,
                text: dialog.text,
              });
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <section className="my-12 flex justify-center items-center ml-4 mr-4">
        <EditReserveDialogForm
          Person={props.Person}
          SetSnackBar={setSnackBar}
          SetOpenThisDialog={props.SetOpenThisDialog}
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
