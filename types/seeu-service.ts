export interface Person {
  id?: string;
  name: string;
  mothers_name: string;
  fathers_name?: string | null;
  date_of_birth: string;
  cpf: string;
  schooling_id: number;
  schooling?: { id: number; name: string };
  telephones?: Telephone[];
  addresses?: Address[];
  lawsuits?: Lawsuit[];
}

export interface Lawsuit {
  id?: string;
  person_id?: string;
  number: string;
  regime_progression: string;
  penalty_regime_id: number;
  penalty_regime?: { id: number; name: string };
  person?: Person;
}

export interface Telephone {
  id?: number;
  telephone: string;
  person_id?: string;
}

export interface CepData {
  id: number;
  cep: string;
  street?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
}

export interface Address {
  id?: number;
  cep_id?: number | null;
  cep?: CepData | null;
  not_cep?: string | null;
  number?: string | null;
  complement?: string | null;
  person_id?: string;
}

export interface SeeuService {
  id: string;
  lawsuit_id: string;
  telephone_id?: number | null;
  address_id?: number | null;
  proof_of_residence: string;
  proof_of_employment: string;
  proof_of_legal_waiver?: string | null;
  is_first_signature: boolean;
  created_by: string;
  updated_by: string;
  deleted_by?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  lawsuit?: Lawsuit;
  telephone?: Telephone | null;
  address?: Address | null;
  creator_profile?: {
    name: string;
    avatar_url?: string | null;
    position?: {
      name: string;
      department?: { name: string } | null;
    } | null;
  };
}

export interface QuestionnaireData {
  proof_of_residence: string;
  proof_of_employment: string;
  proof_of_legal_waiver: string;
}

export interface CepPreview {
  cep: string;
  street: string;
  neighborhood: string;
  city?: string;
  state?: string;
  id?: number;
  source: 'internal' | 'external';
}
