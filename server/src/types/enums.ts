export enum UserStatus {
  Active = 0,
  Inactive = 1,
  Blocked = 2,
}

export enum InvestigationStatus {
  Open = 0,
  Closed = 1,
  Deleted = 2,
}

export enum FoodTestStatus {
  Open = 0,
  Closed = 1,
  Deleted = 2,
}

export enum FoodTestResult {
  High = 0,
  Moderate = 1,
  Low = 2,
  NoReaction = 3,
}

export enum JournalStatus {
  Draft = 0,
  Active = 1,
  Inactive = 2,
  Deleted = 3,
}

export enum TipStatus {
  Active = 1,
  Inactive = 0,
  Deleted = 5,
}

export enum AuthActorType {
  User = 'user',
  Admin = 'admin',
}
