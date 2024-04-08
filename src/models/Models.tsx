export interface DeceasedPerson {
  ClientName: string;
  DeceasedPersonName: string;
  GraveLocation: number;
  Born: string;
  Died: string;
}

export interface AccommodatedDeceasedPerson extends DeceasedPerson {
  AccommodatedAt: Date;
}

export interface ReserveDeceasedPerson extends DeceasedPerson {
  ReservationCreatedAt: Date;
}

export interface UniqueReservations extends ReserveDeceasedPerson {
  id: string;
}

export interface UniqueAccomodatedPersons extends AccommodatedDeceasedPerson {
  id: string;
}
