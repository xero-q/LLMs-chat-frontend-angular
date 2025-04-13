export interface Thread {
  id: number;
  model_id: number;
  title: string;
  first_prompt_datetime: Date;
  model_name: string;
  is_online: boolean;
}
