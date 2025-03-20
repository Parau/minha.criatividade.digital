# Templates de Prompt

Este diretório contém os templates de prompt usados pelo ReviewToolV2. Os templates são arquivos de texto com extensão `.tmpl` que seguem uma estrutura específica.

## Estrutura de um arquivo de template

Cada arquivo de template tem duas partes principais:

1. **Frontmatter**: Seção de metadados no formato YAML, delimitada por `---` no início e no fim.
2. **Conteúdo do Template**: O texto do template propriamente dito, usando a sintaxe do Handlebars.

### Exemplo de estrutura

```
---
id: exemplo-template
name: Exemplo de Template
description: Descrição do que este template faz
category: categoria-do-template
icon: IconName
inputs:
  - id: campo1
    type: textarea
    label: Rótulo do campo
    placeholder: Texto de placeholder...
    required: true
  - id: campo2
    type: switch
    label: Opção de toggle
    defaultValue: true
---
Este é o conteúdo do template com placeholders do Handlebars:

{{#if campo2}}
  Texto condicional baseado no valor de campo2.
{{/if}}

<texto>
{{campo1}}
</texto>
```

## Metadados do Template

Os metadados do template são especificados no formato YAML e incluem:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único do template |
| `name` | string | Nome exibido na interface |
| `description` | string | Descrição do propósito do template |
| `category` | string | Categoria para agrupamento (ex: revisao-texto, revisao-final) |
| `icon` | string | Nome do ícone (deve corresponder a um ícone registrado) |
| `inputs` | array | Definição dos campos de entrada que o usuário preencherá |

### Definição de inputs

Cada item no array `inputs` define um campo de formulário e pode incluir:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único do campo |
| `type` | string | Tipo de campo: text, textarea, select, multiselect, switch, combobox |
| `label` | string | Rótulo exibido para o usuário |
| `description` | string | (Opcional) Descrição ou ajuda para o campo |
| `placeholder` | string | (Opcional) Texto placeholder |
| `defaultValue` | any | (Opcional) Valor padrão |
| `required` | boolean | (Opcional) Se o campo é obrigatório |
| `options` | array | (Para select/multiselect/combobox) Lista de opções |
| `validation` | object | (Opcional) Regras de validação |

## Conteúdo do Template

O conteúdo do template usa a sintaxe Handlebars, permitindo:

- Interpolação simples: `{{variavel}}`
- Blocos condicionais: `{{#if variavel}}...{{/if}}`
- Iterações: `{{#each array}}...{{/each}}`
- Helpers: `{{helper arg1 arg2}}`

## Como criar um novo template

1. Crie um novo arquivo com extensão `.tmpl` neste diretório
2. Adicione o frontmatter com os metadados necessários
3. Escreva o conteúdo do template usando a sintaxe Handlebars
4. O template será automaticamente carregado na próxima inicialização do aplicativo

## Ícones disponíveis

Os seguintes ícones estão registrados e podem ser usados no campo `icon`:

- IconTextSpellcheck
- IconPencilStar
- IconListTree
- IconTextGrammar
- IconChecks

Para adicionar mais ícones, edite o arquivo `promptTemplateLoader.tsx`.
