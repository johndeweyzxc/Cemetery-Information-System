import { initializeApp } from "firebase/app";
import {
  Timestamp,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  firebaseConfig,
  ColReservations,
  ColDeceasedPersons,
} from "../DBConfig";
import {
  AccommodatedDeceasedPerson,
  DeceasedPerson,
  ReserveDeceasedPerson,
  UniqueAccomodatedPersons,
  UniqueReservations,
} from "../models/Models";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class PersonDB {
  static async UploadReservation(
    deceasedPerson: DeceasedPerson,
    cb: (isSuccess: boolean) => void
  ) {
    const reserve: ReserveDeceasedPerson = {
      ...deceasedPerson,
      ReservationCreatedAt: Timestamp.fromDate(new Date()).toDate(),
    };

    await addDoc(collection(db, ColReservations), reserve)
      .then((doc) => {
        console.log(
          `PersonDB.UploadReservation: Document written in Reservations with id ${doc.id}`
        );
        console.log(
          `PersonDB.UploadReservation: ${JSON.stringify(reserve, null, 2)}`
        );
        cb(true);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            "PersonDB.UploadReservation: Failed to write document in Reservations"
          );
          cb(false);
        }
      });
  }

  static async DeleteReservation(id: string, cb: (isSuccess: boolean) => void) {
    await deleteDoc(doc(db, ColReservations, id))
      .then(() => {
        console.log(
          `PersonDB.DeleteReservation: Docment deleted in Reservations where id is ${id}`
        );
        cb(true);
      })
      .catch((error) => {
        if (error !== null || error !== undefined) {
          console.log(error);
          console.log(
            `PersonDB.DeleteReservation: Failed to delete document in Reservations where id is ${id}`
          );
          cb(false);
        }
      });
  }

  static async AccomodatePerson(
    reserved: ReserveDeceasedPerson,
    cb: (isSuccess: boolean) => void
  ) {
    const accomodate: AccommodatedDeceasedPerson = {
      ClientName: reserved.ClientName,
      DeceasedPersonName: reserved.DeceasedPersonName,
      GraveLocation: reserved.GraveLocation,
      Born: reserved.Born,
      Died: reserved.Died,
      AccommodatedAt: Timestamp.fromDate(new Date()).toDate(),
    };

    await addDoc(collection(db, ColDeceasedPersons), accomodate)
      .then((doc) => {
        console.log(
          `PersonDB.AccomodatePerson: Document written in DeceasedPersons with id ${doc.id}`
        );
        console.log(
          `PersonDB.AccomodatePerson: ${JSON.stringify(accomodate, null, 2)}`
        );
        cb(true);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            "PersonDB.AccomodatePerson: Failed to write document in DeceasedPersons"
          );
          cb(false);
        }
      });
  }

  static async DeletePerson(id: string, cb: (isSuccess: boolean) => void) {
    await deleteDoc(doc(db, ColDeceasedPersons, id))
      .then(() => {
        console.log(
          `PersonDB.DeletePerson: Document deleted in DeceasedPersons where id is ${id}`
        );
        cb(true);
      })
      .catch((error) => {
        if (error !== null || error !== undefined) {
          console.log(error);
          console.log(
            `PersonDB.DeletePerson: Failed to delete document in DeceasedPersons where id is ${id}`
          );
          cb(false);
        }
      });
  }

  static async IsAvailaleForAccommodation(
    id: string | null,
    location: number,
    cb: (isOccupied: boolean | null) => void,
    usingForUpdation: boolean
  ) {
    const q = query(
      collection(db, ColDeceasedPersons),
      where("GraveLocation", "==", location)
    );

    await getDocs(q)
      .then((snapshot) => {
        // Determine if function is being use for creation of updation
        if (usingForUpdation && snapshot.docs.length === 1) {
          const doc = snapshot.docs[0];
          console.log(
            `PersonDB.IsAvailaleForAccommodation: Comparing two ids: ${id}, ${doc.id}`
          );

          /*
            If the id fetched from the database is different from the id being updated then grave location is already taken
          */
          if (doc.id !== id) {
            console.log(
              `PersonDB.IsAvailaleForAccommodation: ID not equal: ${id}, ${doc.id}`
            );
            cb(true);
          } else {
            console.log(
              "PersonDB.IsAvailableForReservation: ID is equal, grave location is from the user, function being use for updation"
            );
            cb(false);
          }
        } else if (snapshot.docs.length > 0) {
          console.log(
            `PersonDB.IsAvailaleForAccommodation: Grave location ${location} is already occupied`
          );
          cb(true);
        } else if (snapshot.docs.length === 0) {
          console.log(
            `PersonDB.IsAvailaleForAccommodation: Grave location ${location} is free`
          );
          cb(false);
        }
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(
            `PersonDB.IsAvailaleForAccommodation: There is an error checking grave location at ${location}`
          );
          console.log(reason);
          cb(null);
        }
      });
  }

  static async IsAvailableForReservation(
    id: string | null,
    location: number,
    cb: (isAvail: boolean | null) => void,
    usingForUpdation: boolean
  ) {
    const q = query(
      collection(db, ColReservations),
      where("GraveLocation", "==", location)
    );

    await getDocs(q)
      .then((snapshot) => {
        // Determine if function is being use for creation of updation
        if (usingForUpdation && snapshot.docs.length === 1) {
          const doc = snapshot.docs[0];
          console.log(
            `PersonDB.IsAvailableForReservation: Comparing two ids: ${id}, ${doc.id}`
          );

          /*
            If the id fetched from the database is different from the id being updated then grave location is already taken
          */
          if (doc.id !== id) {
            console.log(
              `PersonDB.IsAvailableForReservation: ID not equal: ${id}, ${doc.id}`
            );
            cb(false);
          } else {
            console.log(
              "PersonDB.IsAvailableForReservation: ID is equal, grave location is from the user, function being use for updation"
            );
            cb(true);
          }
        } else if (snapshot.docs.length > 0) {
          console.log(
            `PersonDB.IsAvailableForReservation: Grave location ${location} has already been reserve`
          );
          cb(false);
        } else if (snapshot.docs.length === 0) {
          console.log(
            `PersonDB.IsAvailableForReservation: Grave location ${location} is free for reservation`
          );
          cb(true);
        }
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(
            `PersonDB.IsAvailableForReservation: There is an error checking grave location at ${location}`
          );
          console.log(reason);
          cb(null);
        }
      });
  }

  static ListenReservation(cb: (reserves: Object[]) => void) {
    const q = query(collection(db, ColReservations));

    return onSnapshot(q, (snapshot) => {
      const reservations: Object[] = [];
      snapshot.forEach((doc) => {
        const document = doc.data() as UniqueReservations;
        document.id = doc.id;

        const parsedDoc: Object = JSON.parse(JSON.stringify(document));
        console.log(
          `PersonDB.ListenReservation: Got reservation document with id ${doc.id}`
        );
        reservations.push(parsedDoc);
      });

      cb(reservations);
    });
  }

  static async EditReservation(
    id: string,
    person: UniqueReservations,
    cb: (isSuccess: boolean) => void
  ) {
    console.log("PersonDB.EditReservation: Updating");
    console.log(`PersonDB.EditReservation: ${JSON.stringify(person, null, 2)}`);

    await setDoc(
      doc(db, "Reservations", id),
      {
        ClientName: person.ClientName,
        DeceasedPersonName: person.DeceasedPersonName,
        GraveLocation: person.GraveLocation,
        Born: person.Born,
        Died: person.Died,
      },
      { merge: true }
    )
      .then(() => {
        console.log(
          `PersonDB.EditReservation: Document updated in Reservations where id is ${id}`
        );
        cb(true);
      })
      .catch((error) => {
        if (error !== null || error !== undefined) {
          console.log(error);
          console.log(
            `PersonDB.EditReservation: Failed to update document in Reservations where id is ${id}`
          );
          cb(false);
        }
      });
  }

  static async EditPerson(
    id: string,
    person: UniqueAccomodatedPersons,
    cb: (isSuccess: boolean) => void
  ) {
    console.log("PersonDB.EditPerson: Updating");
    console.log(`PersonDB.EditPerson: ${JSON.stringify(person, null, 2)}`);

    await setDoc(
      doc(db, "DeceasedPersons", id),
      {
        ClientName: person.ClientName,
        DeceasedPersonName: person.DeceasedPersonName,
        GraveLocation: person.GraveLocation,
        Born: person.Born,
        Died: person.Died,
      },
      { merge: true }
    )
      .then(() => {
        console.log(
          `PersonDB.EditPerson: Document updated in DeceasedPersons where id is ${id}`
        );
        cb(true);
      })
      .catch((error) => {
        if (error !== null || error !== undefined) {
          console.log(error);
          console.log(
            `PersonDB.EditPerson: Failed to update document in DeceasedPersons where id is ${id}`
          );
          cb(false);
        }
      });
  }

  static ListenPeople(cb: (people: Object[]) => void) {
    const q = query(collection(db, ColDeceasedPersons));

    return onSnapshot(q, (snapshot) => {
      const peoples: Object[] = [];
      snapshot.forEach((doc) => {
        const document = doc.data() as UniqueAccomodatedPersons;
        document.id = doc.id;

        const parsedDoc: Object = JSON.parse(JSON.stringify(document));
        console.log(
          `PersonDB.ListenPeople: Got person document with id ${doc.id}`
        );
        peoples.push(parsedDoc);
      });

      cb(peoples);
    });
  }

  static ListenAuth(cb: (value: boolean) => void): Unsubscribe {
    return onAuthStateChanged(getAuth(), (user) => {
      // Checks if admin is signed in or not
      user ? cb(true) : cb(false);
    });
  }

  static SignInAsAdmin(username: string, password: string) {
    signInWithEmailAndPassword(getAuth(), username, password)
      .then(() => {
        // Admin is signed in
        console.log("PersonDB.SignInAsAdmin: Admin signed in");
      })
      .catch((error) => {
        // Admin is not signed in
        if (error !== null || error !== undefined) {
          console.log(error);
          console.log("PersonDB.SignInAsAdmin: Error logging in as admin");
        }
      });
  }

  static SignOutAsAdmin() {
    signOut(getAuth())
      .then(() => {
        // Admin signed out successfully
        console.log("PersonDB.SignOutAsAdmin: Admin signed out");
      })
      .catch((error) => {
        // An error happened.
        if (error !== null || error !== undefined) {
          console.log(error);
          console.log(
            "PersonDB.SignOutAsAdmin: Error while signing out as admin"
          );
        }
      });
  }
}

export default PersonDB;
