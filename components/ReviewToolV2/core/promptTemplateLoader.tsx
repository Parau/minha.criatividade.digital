import { PromptTemplate, PromptInputField } from './promptTypes';
import { ReactNode } from 'react';
import { IconTextSpellcheck, IconPencilStar, IconListTree, IconTextGrammar, IconChecks } from '@tabler/icons-react';
import yaml from 'js-yaml';

// Mapeamento de ícones por nome
const iconMap: Record<string, ReactNode> = {
  'IconTextSpellcheck': <IconTextSpellcheck size={18} />,
  'IconPencilStar': <IconPencilStar size={18} />,
  'IconListTree': <IconListTree size={18} />,
  'IconTextGrammar': <IconTextGrammar size={18} />,
  'IconChecks': <IconChecks size={18} />,
};

/**
 * Interface para o frontmatter do arquivo de template
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  inputs: PromptInputField[];
}

/**
 * Carrega um template a partir de um arquivo de texto com frontmatter
 */
export function parseTemplateFile(fileContent: string): PromptTemplate {
  try {
    // Identificar e separar o frontmatter e o conteúdo do template
    const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!frontmatterMatch) {
      throw new Error('Formato de arquivo de template inválido. Frontmatter não encontrado.');
    }
    
    const [, frontmatterYaml, templateContent] = frontmatterMatch;
    
    // Analisar o frontmatter YAML usando js-yaml
    const metadata = yaml.load(frontmatterYaml) as TemplateMetadata;
    
    // Verificar campos obrigatórios
    if (!metadata.id || !metadata.name || !metadata.category || !Array.isArray(metadata.inputs)) {
      throw new Error('Metadados de template inválidos. Campos obrigatórios não encontrados.');
    }
    
    // Converter nome do ícone para componente React
    const icon = metadata.icon ? iconMap[metadata.icon] : undefined;
    
    // Retornar o objeto PromptTemplate com os metadados e conteúdo do template
    return {
      ...metadata,
      icon,
      template: templateContent.trim(),
      validateInputs: (values) => {
        const errors: Record<string, string | null> = {};
        
        // Validação básica: verificar campos obrigatórios
        for (const input of metadata.inputs) {
          if (input.required && (!values[input.id] || String(values[input.id]).trim() === '')) {
            errors[input.id] = `O campo ${input.label} é obrigatório`;
          }
          
          // Verificar validação de comprimento mínimo
          if (input.validation?.minLength && typeof values[input.id] === 'string' && 
              values[input.id].length < input.validation.minLength) {
            errors[input.id] = input.validation.errorMessage || 
              `O campo deve ter pelo menos ${input.validation.minLength} caracteres`;
          }
        }
        
        return errors;
      }
    };
  } catch (error) {
    console.error('Erro ao analisar arquivo de template:', error);
    throw new Error(`Falha ao carregar o template: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Carrega vários templates a partir de um objeto com caminhos e conteúdos de arquivos
 */
export function loadTemplatesFromFiles(fileContents: Record<string, string>): PromptTemplate[] {
  return Object.values(fileContents).map(parseTemplateFile);
}

// Templates estáticos incluídos no pacote
export const staticTemplateFiles: Record<string, string> = {
  'revisaoOrtografica': `---
id: revisao-ortografica
name: Revisão Ortográfica
description: Corrige erros gramaticais, ortográficos e de pontuação no texto
category: revisao-texto
icon: IconTextSpellcheck
inputs:
  - id: texto
    type: textarea
    label: Texto para revisão
    placeholder: Cole aqui o texto que você deseja revisar...
    required: true
    validation:
      minLength: 10
      errorMessage: Por favor, insira um texto para revisão
  - id: preservarOriginal
    type: switch
    label: Preservar ao máximo o texto original
    description: Realiza apenas as intervenções estritamente necessárias para correção
    defaultValue: true
---
Assuma o papel de um revisor experiente e revise o <texto> a seguir, garantindo correção ortográfica e gramatical. Concentre-se nos seguintes aspectos:
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

  'revisaoEstilo': `---
id: revisao-estilo
name: Padronização de Estilo e Voz Narrativa
description: Padroniza o estilo de escrita e a voz narrativa do texto
category: revisao-texto
icon: IconPencilStar
inputs:
  - id: texto
    type: textarea
    label: Texto para revisão
    placeholder: Cole aqui o texto que você deseja revisar...
    required: true
    validation:
      minLength: 10
      errorMessage: Por favor, insira um texto para revisão
  - id: estiloTexto
    type: combobox
    label: Estilo de escrita
    description: Escolha ou defina o estilo de escrita a ser padronizado
    placeholder: Escolha ou escreva o estilo
    options:
      - value: 📝 Descritivo
        label: 📝 Descritivo
      - value: 📜 Dissertativo/argumentativo
        label: 📜 Dissertativo/argumentativo
      - value: 📃 Expositivo
        label: 📃 Expositivo
      - value: 📐 Instrucional
        label: 📐 Instrucional
      - value: 📣 Narrativo
        label: 📣 Narrativo
      - value: 🥕 Persuasivo
        label: 🥕 Persuasivo
  - id: vozNarrativa
    type: combobox
    label: Voz narrativa
    description: Escolha ou defina a voz narrativa a ser padronizada
    placeholder: Escolha ou escreva a voz narrativa
    options:
      - value: ☝️ Narrador em primeira pessoa
        label: ☝️ Narrador em primeira pessoa
      - value: ✌️ Narrador em segunda pessoa
        label: ✌️ Narrador em segunda pessoa
      - value: 3️⃣ Narrador em terceira pessoa
        label: 3️⃣ Narrador em terceira pessoa
  - id: preservarOriginal
    type: switch
    label: Preservar ao máximo o texto original
    description: Realiza apenas as intervenções estritamente necessárias para padronização
    defaultValue: true
---
Assuma o papel de um revisor experiente e revise o <texto> a seguir, garantindo a padronização do estilo e das vozes narrativas. Concentre-se nos seguintes aspectos:
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
</texto>`
};