export type NavItem = {
  title: string;
  link: string;
};

export type EntityType = {
  label: string;
  value: string;
};

export type WorkshopSessionType = {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
  link: string;
  title: string;
  description: string;
};

export type WorkshopParticipantType = {
  id: number;
  name: string;
  name_en: string;
  national_code: string;
  gender: string;
  phone: string;
  approved: number;
};

export type WorkshopType = {
  id: number;
  title: string;
  description: string;
  organizers: string;
  start_date: string;
  end_date: string;
  week_day: string;
  time: string;
  img_path: string;
  sessions: WorkshopSessionType[];
  participants: WorkshopParticipantType[];
};
