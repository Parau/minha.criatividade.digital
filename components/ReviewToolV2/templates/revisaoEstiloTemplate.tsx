import { PromptTemplate } from '../core/promptTypes';
import { IconPencilStar } from '@tabler/icons-react';

// Lista de estilos de texto predefinidos
const tiposDeEstilo = [
  { value: '📝 Descritivo', label: '📝 Descritivo' },
  { value: '📜 Dissertativo/argumentativo', label: '📜 Dissertativo/argumentativo' },
  { value: '📃 Expositivo', label: '📃 Expositivo' },
  { value: '📐 Instrucional', label: '📐 Instrucional' },
  { value: '📣 Narrativo', label: '📣 Narrativo' },
  { value: '🥕 Persuasivo', label: '🥕 Persuasivo' },
];

// Lista de vozes narrativas predefinidas
const tiposDeNarrativa = [
  { value: '☝️ Narrador em primeira pessoa', label: '☝️ Narrador em primeira pessoa' },
  { value: '✌️ Narrador em segunda pessoa', label: '✌️ Narrador em segunda pessoa' },
  { value: '3️⃣ Narrador em terceira pessoa', label: '3️⃣ Narrador em terceira pessoa' },
];

export const revisaoEstiloTemplate: PromptTemplate = {
  id: 'revisao-estilo',
  name: 'Padronização de Estilo e Voz Narrativa',
  description: 'Padroniza o estilo de escrita e a voz narrativa do texto',
  category: 'revisao-texto',
  icon: <IconPencilStar size={18} />,
  inputs: [
    {
      id: 'texto',
      type: 'textarea',
      label: 'Texto para revisão',
      placeholder: 'Cole aqui o texto que você deseja revisar...',
      required: true,
      validation: {
        minLength: 10,
        errorMessage: 'Por favor, insira um texto para revisão'
      }
    },
    {
      id: 'estiloTexto',
      type: 'combobox',
      label: 'Estilo de escrita',
      description: 'Escolha ou defina o estilo de escrita a ser padronizado',
      placeholder: 'Escolha ou escreva o estilo',
      options: tiposDeEstilo,
    },
    {
      id: 'vozNarrativa',
      type: 'combobox',
      label: 'Voz narrativa',
      description: 'Escolha ou defina a voz narrativa a ser padronizada',
      placeholder: 'Escolha ou escreva a voz narrativa',
      options: tiposDeNarrativa,
    },
    {
      id: 'preservarOriginal',
      type: 'switch',
      label: 'Preservar ao máximo o texto original',
      description: 'Realiza apenas as intervenções estritamente necessárias para padronização',
      defaultValue: true
    }
  ],
  
  template: `Assuma o papel de um revisor experiente e revise o <texto> a seguir, garantindo a padronização do estilo e das vozes narrativas. Concentre-se nos seguintes aspectos:
{{#if estiloTexto}}
- Padronizar o estilo de escrita para o tipo: {{estiloTexto}}.
{{/if}}
{{#if vozNarrativa}}
- Padronizar a voz narrativa para o tipo: {{vozNarrativa}}.
{{/if}}
{{#if preservarOriginal}}
Mantenha o texto o mais próximo possível do original, realizando apenas as intervenções estritamente necessárias para a padronização do estilo e da voz narrativa, sem modificar tom ou conteúdo.
{{/if}}
<texto>
{{texto}}
</texto>`,
  
  validateInputs: (values) => {
    const errors: Record<string, string | null> = {};
    
    if (!values.texto || values.texto.trim().length < 10) {
      errors.texto = 'Por favor, insira um texto válido para revisão';
    }
    
    // Verificar se pelo menos um tipo de padronização foi selecionado
    if (!values.estiloTexto && !values.vozNarrativa) {
      errors.estiloTexto = 'Selecione pelo menos um tipo de padronização (estilo ou voz narrativa)';
    }
    
    return errors;
  }
};
