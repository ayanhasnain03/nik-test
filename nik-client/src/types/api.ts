export interface User {
  id: number;
  uuid?: string;
  first_name: string;
  last_name?: string | null;
  gender?: number | null;
  email: string;
  phone?: string | null;
  image_url?: string | null;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface Tip {
  id: number;
  title: string;
  content: string;
  view_count: number;
  admin_id: number;
  status: number;
  created_at?: string;
}

export interface Investigation {
  id: number;
  name: string;
  description: string;
  image_url?: string | null;
  category_id?: number | null;
  user_id: number;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface FoodTest {
  id: number;
  description: string;
  before_heart_rate: number;
  during_heart_rate: number;
  after1_heart_rate: number;
  after2_heart_rate: number;
  diff_heart_rate: number;
  result: number;
  total_time: number;
  std_dev: number | null;
  had_symptom: boolean;
  note: string;
  food_investigation_id: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FoodTestRequest {
  total_time: number;
  during_start_time: number;
  during_end_time: number;
  after_start_time: number;
  after_end_time: number;
  heart_rates: number[];
  description?: string;
  skipped_after?: boolean;
}

export interface Journal {
  id: number;
  name: string;
  content: string;
  user_id: number;
  status?: number;
  journal_date: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string | null;
  description: string;
  image_url?: string | null;
  parent_id?: number | null;
}

export interface InvestigationActivity {
  id: number;
  reason: string;
  food_investigation_id: number;
  status: number;
  created_at?: string;
}
