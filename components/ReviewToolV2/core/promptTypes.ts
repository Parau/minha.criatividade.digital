import { ReactNode } from 'react';

/**
 * Tipos de entrada de dados que podem ser solicitados ao usuário
 */
export type InputFieldType = 
  | 'text'         // Campo de texto simples
  | 'textarea'     // Área de texto multilinha
  | 'select'       // Seleção de item único a partir de uma lista
  | 'multiselect'  // Seleção múltipla
  | 'switch'       // Toggle booleano
  | 'combobox';    // Campo com autocomplete e opção de criar novos itens

/**
 * Definição de uma opção para campos de seleção
 */
export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * Definição de um campo de entrada para o template de prompt
 */
export interface PromptInputField {
  id: string;                 // Identificador único do campo
  type: InputFieldType;       // Tipo de campo
  label: string;              // Rótulo exibido para o usuário
  description?: string;       // Descrição ou ajuda para o campo
  placeholder?: string;       // Texto placeholder
  defaultValue?: any;         // Valor padrão
  required?: boolean;         // Se o campo é obrigatório
  options?: SelectOption[];   // Opções para select/multiselect/combobox
  icon?: ReactNode;           // Ícone associado ao campo
  validation?: {              // Regras de validação
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    errorMessage?: string;
  };
  dependsOn?: {               // Dependência condicional
    field: string;            // ID do campo do qual este campo depende
    value: any;               // Valor que ativa este campo
  };
}

/**
 * Interface de metadados para template de prompt
 */
export interface PromptTemplate {
  id: string;                 // Identificador único do template
  name: string;               // Nome exibido
  description: string;        // Descrição do tipo de prompt
  category: string;           // Categoria para agrupamento
  icon?: ReactNode;           // Ícone representativo
  inputs: PromptInputField[]; // Campos de entrada necessários
  template: string;           // Template de prompt usando sintaxe Handlebars
  validateInputs?: (values: Record<string, any>) => Record<string, string | null>; // Validação customizada
}

/**
 * Resultado da avaliação de um prompt
 */
export interface PromptEvaluation {
  tokens: number;           // Número de tokens estimados
  chars: number;            // Número de caracteres
  isValid: boolean;         // Se o prompt é válido
  warnings: string[];       // Avisos sobre o prompt
  errors: string[];         // Erros encontrados
  isWithinLimits: boolean;  // Se está dentro dos limites de tokens
}
