---
id: revisao-ortografica
name: Correção de erros gramaticais e ortográficos
description: |
  Esta revisão considera os seguintes aspectos:
  <li> Correção de erros gramaticais e ortográficos;</li>
  <li> Padrões de pontuação e espaçamento, garantindo uniformidade.</li>
category: revisao-texto
icon: IconTextSpellcheck
bkColor: '#f0f8ff'
inputs:
  - id: texto
    type: HiddenInput
    label: Texto para revisão
    placeholder: Cole aqui o texto que você deseja revisar...
    required: true
    validation:
      errorMessage: ⛔ Por favor, insira um texto para revisão!
  - id: preservarOriginal
    type: switch
    label: Preservar ao máximo o texto original
    description: ""
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
</texto>

