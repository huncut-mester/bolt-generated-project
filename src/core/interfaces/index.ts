// Core interfaces following Interface Segregation Principle
export interface IEntity {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends IEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  preferences: UserPreferences;
}

export interface ICase extends IEntity {
  type: CaseType;
  status: CaseStatus;
  clientId: string;
  assignedTo: string;
  priority: CasePriority;
  documents: IDocument[];
  timeline: ITimelineEvent[];
}

export interface IDocument extends IEntity {
  name: string;
  type: DocumentType;
  size: number;
  status: DocumentStatus;
  uploadedBy: string;
  metadata: Record<string, any>;
}

export interface ITimelineEvent extends IEntity {
  type: TimelineEventType;
  description: string;
  metadata: Record<string, any>;
  userId: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hu';
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  desktop: boolean;
  categories: string[];
}

export enum UserRole {
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  Staff = 'staff',
  Client = 'client',
  Partner = 'partner'
}

export enum CaseType {
  ResidencePermit = 'residence_permit',
  WorkPermit = 'work_permit',
  Citizenship = 'citizenship',
  FamilyReunion = 'family_reunion'
}

export enum CaseStatus {
  New = 'new',
  InProgress = 'in_progress',
  PendingDocuments = 'pending_documents',
  UnderReview = 'under_review',
  Approved = 'approved',
  Rejected = 'rejected'
}

export enum CasePriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent'
}

export enum DocumentType {
  Passport = 'passport',
  IDCard = 'id_card',
  BirthCertificate = 'birth_certificate',
  MarriageCertificate = 'marriage_certificate',
  PoliceRecord = 'police_record',
  Other = 'other'
}

export enum DocumentStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

export enum TimelineEventType {
  CaseCreated = 'case_created',
  StatusChanged = 'status_changed',
  DocumentUploaded = 'document_uploaded',
  NoteAdded = 'note_added',
  AppointmentScheduled = 'appointment_scheduled'
}
