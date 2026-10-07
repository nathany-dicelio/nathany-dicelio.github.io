# Nathany Di Celio · Ateliê

Sistema de uso próprio para controlar **desenhos**, **consumos**, **tarefas (Fazer)**, **medidas por cliente** e o **catálogo de peças** com fotos.
Site estático (HTML + CSS + JavaScript puro) com banco **Supabase**, no mesmo estilo do Dello Eventos.

## Telas

| Menu | O que faz |
|---|---|
| Início | Relatório: desenhos e consumos feitos, tarefas, peças; totais por cliente; pedidos por mês; pendências e prazos |
| Meu ponto | Bater entrada, almoço, volta e saída; atraso/adiantamento de cada dia, banco de horas, período de assinatura (16 a 15), feriados automáticos, planilha do mês |
| Desenho | Pedidos de desenho com checklist (Desenho, Conferido, Sisplan, ISA) e a Tabela depois de finalizado |
| Mini consumo | Pedidos de consumo com checklist (Consumo, Sisplan, Foto, ISA) |
| Ficha técnica | Pesquisa a peça e abre a ficha técnica + ficha de consumo (no final), tudo editável. Impressão em 3 folhas A4: 1) dados, desenho, obs. e etiquetas; 2) tabela de medidas; 3) ficha de consumo |
| Fazer | Tarefas: quem pediu, prazo e entrega (data/hora e para quem) |
| Catálogo | Cartões com foto, REF, OP e situação; abre a ficha da peça |
| Medidas | Guia de consulta dos manuais (Renner, C&A, Havan): busca por código ou nome, desenho, como medir, página do PDF; e arquivos avulsos |
| Pessoas e clientes | Cores das pessoas, siglas dos clientes (RNN, CeA, IND…) |

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
- Tabelas: `pessoas`, `clientes`, `pecas`, `pedidos` (desenho/consumo), `tarefas`, `medidas`, `ponto`, `ponto_fechamentos`, `config`, `guia_manuais`, `guia_pontos`, `fichas`.
- Fotos e arquivos no bucket privado `arquivos` (só quem está logado vê).
- Só usuários logados acessam os dados (RLS).

### Depois que a Nathany criar a conta

1. Em `assets/config.js`, mude `permitirCadastro` para `false`.
2. No Supabase: **Authentication → Sign In / Providers → desligar "Allow new users to sign up"**.

## Publicação

- Site: **https://nathany-dicelio.github.io/** (demonstração: `https://nathany-dicelio.github.io/?demo`).
- GitHub Pages da organização `nathany-dicelio`, repositório `nathany-dicelio.github.io`, ramo `main`. Basta dar `git push` que o site atualiza em cerca de 1 minuto.
- Ao mudar CSS/JS, troque o `?v=` em `index.html` para o navegador não usar a versão antiga.
- Supabase → Authentication → URL Configuration: Site URL `https://nathany-dicelio.github.io/` e Redirect URL `https://nathany-dicelio.github.io/**` (já configurados).
