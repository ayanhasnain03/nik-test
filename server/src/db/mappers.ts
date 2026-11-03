import type { Admin } from './schema/admins.js';
import type { Category } from './schema/categories.js';
import type { FoodTest } from './schema/foodTests.js';
import type { FoodInvestigation, FoodInvestigationActivity } from './schema/investigations.js';
import type { UserJournal } from './schema/journals.js';
import type { Tip } from './schema/tips.js';
import type { User } from './schema/users.js';

export function mapUser(row: User) {
  return {
    id: row.id,
    uuid: row.uuid,
    first_name: row.firstName,
    last_name: row.lastName ?? null,
    gender: row.gender ?? null,
    phone: row.phone ?? null,
    email: row.email ?? null,
    image_url: row.imageUrl ?? null,
    dob: row.dob ?? null,
    height: row.height ?? null,
    weight: row.weight ?? null,
    blood_group: row.bloodGroup ?? null,
    status: row.status ?? 0,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    verified_at: row.verifiedAt ?? null,
  };
}

export function mapAdmin(row: Admin) {
  return {
    id: row.id,
    first_name: row.firstName,
    last_name: row.lastName,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    photo: row.photo ?? null,
    status: row.status ?? null,
    role: row.role,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function mapInvestigation(row: FoodInvestigation) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    image_url: row.imageUrl ?? null,
    category_id: row.categoryId ?? null,
    user_id: row.userId,
    status: row.status ?? 0,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function mapFoodTest(row: FoodTest) {
  return {
    id: row.id,
    description: row.description ?? '',
    before_heart_rate: row.beforeHeartRate,
    during_heart_rate: row.duringHeartRate,
    after1_heart_rate: row.after1HeartRate,
    after2_heart_rate: row.after2HeartRate,
    diff_heart_rate: row.diffHeartRate,
    result: row.result,
    total_time: row.totalTime,
    std_dev: row.stdDev !== null && row.stdDev !== undefined ? Number(row.stdDev) : null,
    had_symptom: row.hadSymptom ?? false,
    note: row.note ?? '',
    food_investigation_id: row.foodInvestigationId,
    status: row.status,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    ended_at: row.endedAt ?? null,
  };
}

export function mapActivity(row: FoodInvestigationActivity) {
  return {
    id: row.id,
    reason: row.reason ?? '',
    food_investigation_id: row.foodInvestigationId,
    status: row.status,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function mapJournal(row: UserJournal) {
  return {
    id: row.id,
    name: row.name,
    content: row.content ?? '',
    user_id: row.userId,
    status: row.status,
    journal_date: row.journalDate,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function mapTip(row: Tip) {
  return {
    id: row.id,
    title: row.title,
    content: row.content ?? '',
    view_count: row.viewCount ?? 0,
    admin_id: row.adminId,
    status: row.status,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function mapCategory(row: Category) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    image_url: row.imageUrl ?? null,
    parent_id: row.parentId ?? null,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}
