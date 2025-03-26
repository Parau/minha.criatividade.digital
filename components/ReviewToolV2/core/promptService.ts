import * as tokenizer from 'gpt-tokenizer';
import { PromptTemplate, PromptEvaluation } from './promptTypes';
import Handlebars from 'handlebars';
import { loadTemplatesFromFiles, fallbackTemplateFiles, getAvailableTemplates } from './promptTemplateLoader';

// Limite de tokens para o ChatGPT
export const CHATGPT_TOKEN_LIMIT = 8192;

// Registro central de templates
export class PromptTemplateRegistry {
  private templates: Map<string, PromptTemplate> = new Map();
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;

  // Inicializar o registro com templates
  async initialize(): Promise<void> {
    if (this.isInitialized || this.isInitializing) return;
    
    try {
      this.isInitializing = true;
      
      // Carregar templates dinamicamente
      const templates = await getAvailableTemplates();
      templates.forEach(template => this.register(template));
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Erro ao inicializar templates:', error);
      
      // Em caso de erro, usar os templates de fallback
      const fallbackTemplates = loadTemplatesFromFiles(fallbackTemplateFiles);
      fallbackTemplates.forEach(template => this.register(template));
      
      this.isInitialized = true;
    } finally {
      this.isInitializing = false;
    }
  }

  // Registrar um template
  register(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  // Registrar vários templates de uma vez
  registerBulk(templates: PromptTemplate[]): void {
    templates.forEach(template => this.register(template));
  }

  // Obter um template pelo ID
  async get(id: string): Promise<PromptTemplate | undefined> {
    if (!this.isInitialized) await this.initialize();
    return this.templates.get(id);
  }

  // Listar todos os templates
  async getAll(): Promise<PromptTemplate[]> {
    if (!this.isInitialized) await this.initialize();
    return Array.from(this.templates.values());
  }

  // Listar templates por categoria
  async getByCategory(category: string): Promise<PromptTemplate[]> {
    if (!this.isInitialized) await this.initialize();
    const allTemplates = await this.getAll();
    const filtered = allTemplates.filter(template => {
      //console.log(`Template ${template.id}: comparing category '${template.category}' with '${category}'`, template.category === category);
      return template.category === category;
    });
    return filtered;
  }
}

// Instância singleton do registro
export const templateRegistry = new PromptTemplateRegistry();

/**
 * Renderiza um template Handlebars com os valores fornecidos
 */
export function renderPromptTemplate(template: string, values: Record<string, any>): string {
  try {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(values);
  } catch (error) {
    console.error('Erro ao renderizar template:', error);
    return `Erro ao processar o template: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
  }
}

/**
 * Calcula tokens e avalia qualidade do prompt
 */
export function evaluatePrompt(promptText: string): PromptEvaluation {
  const tokens = tokenizer.encode(promptText).length;
  const chars = promptText.length;
  
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Verificar se o texto está vazio ou muito curto
  if (!promptText.trim()) {
    errors.push('O prompt está vazio.');
  } else if (chars < 10) {
    warnings.push('O prompt é muito curto e pode não ser eficaz.');
  }
  
  // Verificar limites de tokens
  const isWithinLimits = tokens <= CHATGPT_TOKEN_LIMIT;
  if (!isWithinLimits) {
    warnings.push(`O prompt excede o limite de ${CHATGPT_TOKEN_LIMIT} tokens do ChatGPT.`);
  }
  
  return {
    tokens,
    chars,
    isValid: errors.length === 0,
    warnings,
    errors,
    isWithinLimits,
  };
}

/**
 * Copia o prompt para a área de transferência
 */
export async function copyPromptToClipboard(promptText: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(promptText);
    return true;
  } catch (error) {
    console.error('Falha ao copiar para a área de transferência:', error);
    return false;
  }
}
