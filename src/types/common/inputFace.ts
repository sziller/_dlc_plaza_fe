export interface InputProps {
  type: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  autoComplete?: string;
  readOnly?: boolean;
}