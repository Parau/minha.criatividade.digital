import { PromptTemplate, PromptInputField } from './promptTypes';
import { ReactNode } from 'react';
import { IconTextSpellcheck, IconPencilStar, IconListTree, IconTextGrammar, IconChecks, IconAlertCircle } from '@tabler/icons-react';
import yaml from 'js-yaml';

// Mapeamento de ícones por nome
const iconMap: Record<string, ReactNode> = {
  'IconTextSpellcheck': <IconTextSpellcheck size={18} />,
  'IconPencilStar': <IconPencilStar size={18} />,
  'IconListTree': <IconListTree size={18} />,
  'IconTextGrammar': <IconTextGrammar size={18} />,
  'IconChecks': <IconChecks size={18} />,
  'IconAlertCircle': <IconAlertCircle size={18} />,
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
  bkColor: string;
  inputs: PromptInputField[];
}

/**
 * Carrega um template a partir de um arquivo de texto com frontmatter
 */
export function parseTemplateFile(fileContent: string): PromptTemplate {
  try {
    // Log the first few characters to help with debugging
    console.log('Template content starts with:', fileContent.substring(0, 40));
    
    // Identificar e separar o frontmatter e o conteúdo do template
    // More robust pattern that handles both Unix (LF) and Windows (CRLF) line endings
    // and is more forgiving with whitespace
    const frontmatterMatch = fileContent.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/);
    
    if (!frontmatterMatch) {
      console.error('Frontmatter não encontrado no conteúdo:', fileContent.substring(0, 100) + '...');
      throw new Error('Formato de arquivo de template inválido. Frontmatter não encontrado.');
    }
    
    const [, frontmatterYaml, templateContent] = frontmatterMatch;
    
    // Check if we successfully extracted the frontmatter
    if (!frontmatterYaml || frontmatterYaml.trim() === '') {
      throw new Error('Frontmatter está vazio no arquivo de template.');
    }
    
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
    console.error('Conteúdo problemático:', fileContent.substring(0, 200) + '...');
    throw new Error(`Falha ao carregar o template: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Carrega vários templates a partir de um objeto com caminhos e conteúdos de arquivos
 */
export function loadTemplatesFromFiles(fileContents: Record<string, string>): PromptTemplate[] {
  return Object.values(fileContents).map(parseTemplateFile);
}

/**
 * Carrega templates via HTTPS a partir da pasta pública do Next.js
 */
export async function loadTemplatesFromPublicDir(): Promise<Record<string, string>> {
  try {
    // Lista de nomes de arquivos de template
    const templateFileNames = [
      'revisaoOrtografica.md',
      'revisaoEstilo.md',
      'revisaoTipografica.md',
      'acidentesPercurso.md'
    ];
    
    const templateFiles: Record<string, string> = {};
    
    // Fetch each template file in parallel
    const fetchPromises = templateFileNames.map(async (fileName) => {
      try {
        const response = await fetch(`/Templates/${fileName}`);
        
        if (!response.ok) {
          console.warn(`Não foi possível carregar o template ${fileName}: ${response.status} ${response.statusText}`);
          return;
        }
        
        const content = await response.text();
        
        // Check if content has the correct format
        if (!content.startsWith('---')) {
          console.warn(`Template ${fileName} não tem o formato correto. Conteúdo inicia com: ${content.substring(0, 20)}`);
          return;
        }
        
        const templateId = fileName.replace(/\.(md|txt)$/, '');
        templateFiles[templateId] = content;
      } catch (error) {
        console.warn(`Erro ao carregar o template ${fileName}:`, error);
      }
    });
    
    // Wait for all fetches to complete
    await Promise.all(fetchPromises);
    
    return templateFiles;
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
    return {};
  }
}

/**
 * Obtém todos os templates disponíveis
 * Tenta carregar via HTTP
 */
export async function getAvailableTemplates(): Promise<PromptTemplate[]> {
  try {
    // Tentar carregar os templates via HTTP
    const templateFiles = await loadTemplatesFromPublicDir();
    
    // Se encontrou templates, use-os
    if (Object.keys(templateFiles).length > 0) {
      return loadTemplatesFromFiles(templateFiles);
    }
    
    // Se não encontrou, retornar array vazio
    console.info('Não foram encontrados templates no diretório público');
    return [];
  } catch (error) {
    console.error('Erro ao obter templates disponíveis:', error);
    return [];
  }
}