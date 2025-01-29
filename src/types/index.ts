export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  language: 'hu' | 'en';
  lastLogin?: Date;
  mfaEnabled: boolean;
  mfaSecret?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STAFF = 'staff',
  CLIENT = 'client',
  PARTNER = 'partner'
}

export interface Case {
  id: number;
  clientId: number;
  type: CaseType;
  status: CaseStatus;
  assignedTo: number;
  createdAt: Date;
  updatedAt: Date;
  documents: Document[];
  timeline: TimelineEvent[];
}

export enum CaseType {
  RESIDENCE_PERMIT = 'residence_permit',
  WORK_PERMIT = 'work_permit',
  CITIZENSHIP = 'citizenship',
  FAMILY_REUNION = 'family_reunion'
}

export enum CaseStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  PENDING_DOCS = 'pending_docs',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Document {
  id: number;
  caseId: number;
  name: string;
  type: string;
  size: number;
  uploadedBy: number;
  uploadedAt: Date;
  status: DocumentStatus;
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface TimelineEvent {
  id: number;
  caseId: number;
  type: TimelineEventType;
  description: string;
  createdBy: number;
  createdAt: Date;
}

export enum TimelineEventType {
  CASE_CREATED = 'case_created',
  STATUS_CHANGED = 'status_changed',
  DOCUMENT_UPLOADED = 'document_uploaded',
  NOTE_ADDED = 'note_added',
  APPOINTMENT_SCHEDULED = 'appointment_scheduled'
}
