export const PromptRevisaoTextoEstilo = (texto: string, estilo: string ="", voz: string="", preservarOriginal: boolean = true) => {
const notaEstilo = estilo ? `
- Padronizar o estilo de escrita para o tipo: ${estilo}.` : '';

const notaVoz = voz ? `
- Padronizar a voz narrativa para o tipo: ${voz}.` : '';

const notaPreservarOriginal = preservarOriginal ? `
Mantenha o texto o mais próximo possível do original, realizando apenas as intervenções estritamente necessárias para a padronização do estilo e da voz narrativa tom ou conteúdo.` : '';

  return (
`Assuma o papel de um revisor experiente e revise o <texto> a seguir, garantindo a padronização do estilo e da vozes narrativas. Concentre-se nos seguintes aspectos:
${notaEstilo}
${notaVoz}
${notaPreservarOriginal}
<texto>
${texto}
</texto>`);
};
