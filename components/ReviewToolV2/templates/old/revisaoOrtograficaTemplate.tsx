import { PromptTemplate } from '../core/promptTypes';
import { IconTextSpellcheck } from '@tabler/icons-react';

export const revisaoOrtograficaTemplate: PromptTemplate = {
  id: 'revisao-ortografica',
  name: 'Revisão Ortográfica',
  description: 'Corrige erros gramaticais, ortográficos e de pontuação no texto',
  category: 'revisao-texto',
  icon: <IconTextSpellcheck size={18} />,
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
      id: 'preservarOriginal',
      type: 'switch',
      label: 'Preservar ao máximo o texto original',
      description: 'Realiza apenas as intervenções estritamente necessárias para correção',
      defaultValue: true
    }
  ],
  
  template: `Assuma o papel de um revisor experiente e revise o <texto> a seguir, garantindo correção ortográfica e gramatical. Concentre-se nos seguintes aspectos:
- Ortografia correta;
- Gramática precisa;
- Pontuação adequada;
- Construção sintática correta.
{{#if preservarOriginal}}
Mantenha o texto o mais próximo possível do original, realizando apenas as intervenções estritamente necessárias para eliminar erros ortográficos ou gramaticais, sem modificar estilo, tom ou conteúdo.
{{/if}}
<texto>
{{texto}}
</texto>`,
  
  validateInputs: (values) => {
    const errors: Record<string, string | null> = {};
    
    if (!values.texto || values.texto.trim().length < 10) {
      errors.texto = 'Por favor, insira um texto válido para revisão';
    }
    
    return errors;
  }
};