# Registro de SEO (atualizar toda segunda-feira)

Como usar: copie o bloco "Modelo" no fim, preencha com a data e acrescente acima do registro anterior. O plano de ação e os critérios para agir estão em `seo-acompanhamento.md`.

---

## 24/10/2026 (linha de base)

### Posição no Google (busca orgânica, Florianópolis)
Medido no Chrome do Mac, com personalização desligada (`pws=0`). É uma aproximação: a posição real varia por pessoa e local. A posição conta só os resultados orgânicos, sem anúncios.

| Busca | Onde o site aparece | Observação |
|---|---|---|
| fotógrafo corporativo em florianópolis | página 2, cerca de 14ª | na página 1 (fora anúncios): Instagram do Junior Schmitt, Júlio Trindade, Thiago Mangrich, Alonso, Nereu Santos, Jonathas Pare, Fabrício Sousa, Julia Dutra, JR Schmitt |
| retrato corporativo florianópolis | página 1, 5ª | melhor posição das buscas testadas |
| ensaio de família florianópolis | página 1, 8ª | |
| fotógrafo de família em florianópolis | página 2, cerca de 17ª | |
| fotógrafo profissional em florianópolis | fora das 20 primeiras | busca genérica, a mais disputada |
| Mac Frois (busca pelo nome) | 1º, com 4 links da página (home, contato, portfólio, blog) | sem problema |

Em todas as buscas, a página que o Google mostra é a **home**. As páginas dedicadas (`/fotografo-corporativo-florianopolis`, `/ensaio-de-familia-florianopolis`) não apareceram nas posições que verifiquei.

### Google Meu Negócio
- Perfil confirmado: "Mac Frois", R. Fúlvio Aducci, 757, sala 201, Estreito, Florianópolis.
- Nota 5,0 com 85 avaliações.
- Desempenho de mai a out/2026: 317 interações no perfil, sendo 286 pedidos de rota, 27 cliques no site e 4 ligações. Agosto foi o mês mais fraco (cerca de 28 interações); os outros meses ficaram entre 40 e 70.
- Posição no Google Maps (resultados em lista, sem anúncios):

| Busca no Maps | Posição |
|---|---|
| fotógrafo corporativo em florianópolis | 5ª |
| fotógrafo de família em florianópolis | 5ª |
| fotógrafo profissional em florianópolis | 7ª |

- Na busca comum do Google, o perfil **não aparece** entre os 3 destaques do mapa. Nesse bloco apareceram Gabi Gauzi (33 avaliações), Zanetta Fotografia (112) e Cyntia Costa (80).
- O Google marcou o perfil com "Força do perfil: informações incompletas" e pediu para completar o cadastro.

### Site (auditoria técnica das 42 páginas do sitemap)
- Todas respondem 200. Há 24 artigos no blog, 1 página de landing de serviço corporativo e a família de ensaios.
- `robots.txt` correto, com rastreadores de IA liberados, e `llms.txt` publicado.
- **Títulos longos demais (mais de 65 caracteres, são cortados no Google): 22 páginas**, quase todos os artigos do blog (de 66 a 97 caracteres).
- **Descrição fora do tamanho ideal:** home (176), portfólio (172), ensaio de casal (178), ensaio na Praia do Maço (173), minicurso (190).
- **Páginas com pouquíssimo texto no HTML inicial e sem H1:** `/portfolio`, `/servicos`, `/blog`, `/contato` (de 8 a 11 palavras no HTML pré-renderizado). O Google consegue ler depois de executar o JavaScript, mas é mais lento e menos confiável.
- `/retratos-que-vendem` está sem descrição, sem canonical e sem dados estruturados. `/metodo-frois/captura.html` está sem canonical e sem dados estruturados.

### Search Console
**Não foi possível ler.** A propriedade `macfrois.com.br` não está acessível nas duas contas Google logadas no Chrome do Mac. Falta o Mac dizer em qual conta ela está ou conceder acesso. Sem isso, estes números não existem ainda: páginas indexadas, cliques, impressões, consultas e Core Web Vitals.

### O que fazer (em ordem de impacto)
1. Resolver o acesso ao Search Console e exportar a linha de base (3 meses).
2. Completar o perfil do Meu Negócio (a "força do perfil") e pedir mais avaliações com o link próprio. O perfil está na posição 5 do Maps, e subir para a posição 3 tem efeito direto sobre os contatos.
3. Reduzir os títulos do blog para até 60 caracteres e acertar as descrições fora do tamanho.
4. Dar texto e H1 estáticos para `/portfolio`, `/servicos`, `/blog` e `/contato`.
5. Fazer as páginas dedicadas (corporativo e família) serem as que aparecem nas buscas, reforçando os links internos da home para elas. Hoje o Google prefere a home.

---

## Modelo (copiar para cada semana)

```
## DD/MM/AAAA
Buscas (posição orgânica): corporativo __ | retrato corporativo __ | ensaio de família __ | fotógrafo de família __ | profissional __
Maps (posição): corporativo __ | família __ | profissional __
Meu Negócio: avaliações __ | interações do mês __ | rotas __ | cliques no site __ | ligações __
Search Console (4 semanas vs 4 anteriores): cliques __ | impressões __ | CTR __ | posição média __ | páginas indexadas __ | erros de indexação __
Ajustes feitos nesta semana: __
```
