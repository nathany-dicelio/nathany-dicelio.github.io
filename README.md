# Nathany Di Celio · Ateliê

Sistema de uso próprio para controlar **desenhos**, **consumos**, **tarefas (Fazer)**, **medidas por cliente** e o **catálogo de peças** com fotos.
Site estático (HTML + CSS + JavaScript puro) com banco **Supabase**, no mesmo estilo do Dello Eventos.

## Telas

| Menu | O que faz |
|---|---|
| Início | Relatório: desenhos e consumos feitos, tarefas, peças; totais por cliente; pedidos por mês; pendências e prazos |
| Meu ponto | Bater entrada, almoço, volta e saída; atraso/adiantamento de cada dia, banco de horas, período de assinatura (16 a 15), feriados automáticos, planilha do mês |
| Desenho | Pedidos de desenho com checklist (Desenho, Conferido, Sisplan, ISA) e a Tabela depois de finalizado |
| Mini consumo | Pedidos de consumo com checklist (Consumo, Sisplan, Foto, ISA) e a sala da peça (Farm, Blue Steel, Plus size…) |
| Produto | Onde cada peça nasce. Lista como a do Desenho (criado em, referência, OP, por, status e etapa, separada por dia, com filtros de cliente, status, pessoa, sala e período) e cadastro direto de novos produtos (que já entram com a Criação feita nas etapas). A página de cada referência tem fotos e PDFs, status (inclui Vendido), responsáveis, comprador, data de cadastro, entrega, código 2, datas, a modelagem liberada e os materiais editáveis — tecidos, aviamentos e etiquetas são os mesmos da ficha de consumo e mudam juntos. Imprime ou baixa em PDF numa folha A4 |
| Materiais | Cadastro de tecidos, aviamentos e etiquetas (código, gramatura, largura, composição, fornecedor, cores disponíveis) com a situação do estoque de cada um: em estoque, chega em tal dia (vira atrasado quando a data passa) ou não tem, marcada por quem cuida do estoque na própria lista. Ao abrir o material aparece onde ele é usado (data, OP, produto e material, tirado das fichas de consumo), e a busca aceita a OP para ver de uma vez se todos os materiais daquela OP já chegaram. A situação também aparece, só para leitura, nas tabelas de materiais do produto e da ficha de consumo; na ficha, escolher o material preenche a linha |
| Ficha técnica | Pesquisa a peça e abre a ficha técnica + ficha de consumo (no final), tudo editável; o relatório de encaixe do Audaces (PDF), lido na ficha ou anexado no mini consumo, preenche a largura e o consumo do tecido. Impressão em 3 folhas A4: 1) dados, desenho, obs. e etiquetas; 2) desenho das cotas, foto da tabela de medidas, acabamento e aviamentos; 3) ficha de consumo |
| Programação de corte | Calendário do mês com as OPs de cada dia de corte; cada OP tem previsto corte/mod, status (atrasado, em dia, adiantado), semana, data de corte e da OP, quantidades, prazo, oficina, tecidos (cor, estoque, previsto), andamento (pedido, mod, pil. engenharia, engenharia revisão, req. tecido, aviamento, encaixe) e o histórico da peça |
| Fazer | Tarefas: quem pediu, prazo e entrega (data/hora e para quem) |
| Etapas | Caminho de cada modelo (Criação → Corte produção PCP) em linha do tempo ou quadro; cada etapa abre com o resumo da peça ao lado e as abas Status (arquivos, status, responsável e prazo), Pendências (gravadas na hora, com quem resolve) e Histórico (tudo da peça: pedidos, tarefas, etapas, pendências, arquivos e medição); o botão Responsáveis define quem cuida de cada etapa em todos os modelos e dá para filtrar por pessoa; na Liberação modelagem a modelista registra a modelagem liberada (print do molde, tamanho, OPs, lacre, tecido, forro e resultado da engenharia), que aparece na página do produto; o modo Tempos mostra quanto tempo os modelos passam em cada etapa e onde está travando; etapas com prazo vencido ficam marcadas e aparecem no Início, com atalhos para a peça, desenho, mini consumo e fichas |
| Catálogo | Cartões com foto, REF, OP e situação; abre a ficha da peça |
| Medidas | Guia de consulta dos manuais (Renner, C&A, Havan): busca por código ou nome, desenho, como medir, página do PDF; e arquivos avulsos |
| Medição | Busca a peça (filtro por tipo e cliente) e abre a ficha de medição. Cada vez que a peça é medida de novo (depois de uma alteração na costura ou no molde) vira uma medição separada, com a sua data, e os dias aparecem em caixinhas para escolher qual ver; a nova já vem com os mesmos POMs. Cada dia tem OP, lacre, tamanho, a tabela de POM e descrição com molde e duas medidas de peça pronta, anotações da medição e quem assina. Imprime ou baixa em PDF numa folha A4. A tabela vem do modelo salvo do cliente e tipo, da ficha técnica ou do guia do cliente; "Usar como modelo" deixa as próximas peças iguais |
| Engenharia | Engenharia e graduação, do mesmo jeito da Medição (um dia por medição): POM, descrição, medida do tamanho, antes de passar, ≠, depois de passar, ≠ e ajuste; observações da engenharia (aprovado sem/com restrição ou reprovado), da modelagem e instrução de montagem, quem assina e os aviamentos da peça, os mesmos do produto e da ficha de consumo. Na primeira vez começa com o que já foi digitado na Medição. Imprime ou baixa em PDF igual à ficha de engenharia em papel |
| Pessoas e clientes | Cores das pessoas e siglas dos clientes (RNN, CeA, IND…) |
| Conta e dados | Também abre clicando no nome, no rodapé do menu. Armazenamento, backup (o sistema guarda sozinho uma cópia de todas as tabelas por dia no Supabase, dos últimos 30 dias, com a lista para baixar) e "Baixar tudo em Excel" (uma aba para peças, pedidos, etapas, fichas, consumo, materiais, corte, tarefas, clientes e pessoas) |

No **Meu ponto**, a jornada (entrada 07:30, saída, almoço, tolerância, dia da assinatura) fica em *Minha jornada* e pode ser mudada a qualquer momento — os saldos são recalculados.

A pesquisa por **OP ou REF** fica sempre no topo (atalho: tecla `/`).
Digitar `BL115546 CeA` no campo de referência já escolhe o cliente C&A pela sigla.
Quando todas as etapas são marcadas, o pedido vira **finalizado** com data e hora.

## Rodar no computador

```bash
python -m http.server 5510
```

Abra `http://localhost:5510` (dados reais, pede login) ou `http://localhost:5510/?demo` (modo demonstração com dados de exemplo salvos só no navegador).

## Estrutura

```
index.html               página única (rotas com #/)
manifest.webmanifest     permite instalar como aplicativo
assets/app.js            todo o sistema
assets/styles.css        visual (marsala #781026, tema claro/escuro)
assets/config.js         URL e chave pública do Supabase
assets/img, assets/icons logos e ícones
supabase/schema.sql      tabelas, regras de acesso (RLS) e bucket de fotos
```

## Supabase

- Organização **Nathany Di Celio** → projeto **nathany-atelie** (região São Paulo).
- Tabelas: `pessoas`, `clientes`, `pecas`, `pedidos` (desenho/consumo), `tarefas`, `medidas`, `ponto`, `ponto_fechamentos`, `config`, `guia_manuais`, `guia_pontos`, `fichas`, `fluxos` (etapas), `materiais`, `cortes`.
- Fotos e arquivos no bucket privado `arquivos` (só quem está logado vê).
- Backup: o plano grátis não tem backup, então ao abrir o site logado, uma vez por dia, o sistema manda todas as tabelas (JSON comprimido) para `backups/AAAA-MM-DD.json.gz` nesse bucket e apaga o que passou de 30 dias.
- Só usuários logados acessam os dados (RLS).

### Depois que a Nathany criar a conta

1. Em `assets/config.js`, mude `permitirCadastro` para `false`.
2. No Supabase: **Authentication → Sign In / Providers → desligar "Allow new users to sign up"**.

## Publicação

- Site: **https://nathany-dicelio.github.io/** (demonstração: `https://nathany-dicelio.github.io/?demo`).
- GitHub Pages da organização `nathany-dicelio`, repositório `nathany-dicelio.github.io`, ramo `main`. Basta dar `git push` que o site atualiza em cerca de 1 minuto.
- Ao mudar CSS/JS, troque o `?v=` em `index.html` para o navegador não usar a versão antiga.
- Supabase → Authentication → URL Configuration: Site URL `https://nathany-dicelio.github.io/` e Redirect URL `https://nathany-dicelio.github.io/**` (já configurados).
