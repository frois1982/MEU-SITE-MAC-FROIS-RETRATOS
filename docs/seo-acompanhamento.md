# Acompanhamento no Search Console

**Mudança a acompanhar:** em 18/10/2026 a Jornada virou a página inicial (`/`). O título e a descrição de busca da home foram mantidos, a logo saiu do topo e do rodapé (fica só o nome) e o código foi dividido por página (site mais rápido). `/jornada` leva para `/`.

## Antes de tudo: guardar a linha de base
Os dados até ~17/10/2026 representam o "antes". Exporte agora:
Search Console > Desempenho > Resultados da pesquisa > Datas: últimos 3 meses > Exportar. Guarde também a aba "Páginas" e a aba "Consultas".

## Toda semana (segunda-feira), 10 minutos
1. **Desempenho, filtro Página = `https://www.macfrois.com.br/`:** cliques, impressões, CTR e posição média. Compare "últimas 4 semanas" com "4 semanas anteriores".
2. **Consultas principais** (as que aparecem no seu export): confira a posição de cada uma. Ex.: "fotógrafo corporativo florianópolis", "retrato corporativo florianópolis", "ensaio de família florianópolis".
3. **Páginas que ranqueiam:** `/fotografo-corporativo-florianopolis`, `/ensaio-de-familia-florianopolis`, `/portfolio`, `/servicos`.
4. **Indexação > Páginas:** novos erros ou "Rastreada, mas não indexada".
5. **Experiência > Core Web Vitals:** URLs classificadas como "ruins" ou "precisam melhorar".

## Quando agir
Oscilar nas primeiras 2 a 4 semanas depois de mudar a página inicial é normal. Só aja se, por **3 semanas seguidas**:
- os cliques da home caírem 30% ou mais contra as 4 semanas anteriores; **ou**
- a posição média das 5 consultas principais piorar mais de 3 posições; **ou**
- páginas internas que ranqueavam (lista acima) perderem posições.

**O que fazer nesse caso:** (a) acrescentar mais texto descritivo à home (o HTML estático em `scripts/prerender.cjs` e a seção final da Jornada); (b) se não resolver, voltar à home antiga: em `App.tsx`, trocar a rota `/` de `<Jornada />` para `<Home />` (o arquivo `pages/Home.tsx` continua no projeto, só deixou de ser usado). O Vercel também guarda cada versão publicada, e dá para restaurar a anterior em um clique.

## Datas de conferência sugeridas
Semana 1 (25/10), semana 2 (01/11), semana 4 (15/11), semana 8 (13/12/2026).
