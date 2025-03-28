import { PromptTemplate } from './promptTypes';

// Template cache to avoid redundant loading
const templateCache: Record<string, PromptTemplate> = {};

/**
 * Loads a template by filename
 */
export async function loadTemplate(filename: string): Promise<PromptTemplate | null> {
  // Check if template is already in cache
  if (templateCache[filename]) {
    return templateCache[filename];
  }
  
  try {
    // Load template from server
    const response = await fetch(`/templates/${filename}.json`);
    if (!response.ok) {
      console.error(`Failed to load template ${filename}: ${response.statusText}`);
      return null;
    }
    
    const template = await response.json() as PromptTemplate;
    
    // Cache the template
    templateCache[filename] = template;
    return template;
  } catch (error) {
    console.error(`Error loading template ${filename}:`, error);
    return null;
  }
}

/**
 * Loads multiple templates by filename
 */
export async function loadTemplates(filenames: string[]): Promise<PromptTemplate[]> {
  const promises = filenames.map(filename => loadTemplate(filename));
  const templates = await Promise.all(promises);
  
  // Filter out failed template loads (null values)
  return templates.filter(template => template !== null) as PromptTemplate[];
}

/**
 * Gets a template by ID from cache
 */
export function getTemplateById(id: string): PromptTemplate | null {
  const templates = Object.values(templateCache);
  return templates.find(template => template.id === id) || null;
}

/**
 * Gets templates by category from cache
 */
export function getTemplatesByCategory(category: string): PromptTemplate[] {
  const templates = Object.values(templateCache);
  return templates.filter(template => template.category === category);
}
