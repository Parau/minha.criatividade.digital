---
id: revisao-estilo
name: Padronização de Estilo e Voz Narrativa
description: ""
category: revisao-texto
icon: IconPencilStar
bkColor: '#fef8e3'
inputs:
  - id: texto
    type: HiddenInput
    label: Texto para revisão
    placeholder: Cole aqui o texto que você deseja revisar...
    required: true
    validation:
      errorMessage: ⛔ Por favor, insira um texto para revisão!
  - id: estiloTexto
    type: combobox
    label: Padronizar o estilo de escrita para o tipo
    description: ""
    placeholder: Escolha ou escreva o estilo
    required: true
    validation:
      errorMessage: ⛔ Escolha um estilo para validação.
    options:
      - value: Descritivo
        label: 📝 Descritivo
      - value: Dissertativo/argumentativo
        label: 📜 Dissertativo/argumentativo
      - value: Expositivo
        label: 📃 Expositivo
      - value: Instrucional
        label: 📐 Instrucional
      - value: Narrativo
        label: 📣 Narrativo
      - value: Persuasivo
        label: 🥕 Persuasivo
  - id: vozNarrativa
    type: combobox
    label: Padronizar a voz narrativa para o tipo
    description: ""
    placeholder: Escolha ou escreva a voz narrativa
    required: true
    validation:
      errorMessage: ⚠️ Não foi escolhido um opção de voz narrativa para validação.
    options:
      - value: Narrador em primeira pessoa
        label: ☝️ Narrador em primeira pessoa
      - value: Narrador em segunda pessoa
        label: ✌️ Narrador em segunda pessoa
      - value: Narrador em terceira pessoa
        label: 3️⃣ Narrador em terceira pessoa
  - id: preservarOriginal
    type: switch
    label: Preservar ao máximo o texto original
    description: ""
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
</texto>
