-- =====================================================================
-- Nathany Di Celio · Ateliê — esquema do banco (Supabase / Postgres)
-- Rode este arquivo inteiro no SQL Editor do projeto "nathany-atelie".
-- Pode ser rodado de novo sem perder dados (usa "if not exists").
-- =====================================================================

-- ---------- Pessoas (quem pede / para quem vai) ----------
create table if not exists public.pessoas (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  cor        text not null default '#781026',
  ativo      boolean not null default true,
  criado_em  timestamptz not null default now()
);

-- ---------- Clientes (Renner, C&A...) ----------
create table if not exists public.clientes (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  sigla      text,                       -- sufixo usado na referência (RNN, CeA, IND...)
  cor        text not null default '#781026',
  ordem      int  not null default 0,
  criado_em  timestamptz not null default now()
);

-- ---------- Peças (o catálogo: uma por referência) ----------
create table if not exists public.pecas (
  id            uuid primary key default gen_random_uuid(),
  ref           text not null unique,
  op            text,
  cliente_id    uuid references public.clientes(id) on delete set null,
  descricao     text,
  detalhes      jsonb not null default '[]'::jsonb,  -- lista de observações/itens
  fotos         jsonb not null default '[]'::jsonb,  -- caminhos no Storage
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ---------- Pedidos de desenho e de consumo ----------
create table if not exists public.pedidos (
  id            uuid primary key default gen_random_uuid(),
  tipo          text not null check (tipo in ('desenho', 'consumo')),
  peca_id       uuid not null references public.pecas(id) on delete cascade,
  op            text,
  pedido_em     timestamptz not null default now(),
  de_id         uuid references public.pessoas(id) on delete set null,
  para_id       uuid references public.pessoas(id) on delete set null,
  etapas        jsonb not null default '{}'::jsonb,   -- {"desenho":true,"sisplan":false,...}
  finalizado_em timestamptz,
  obs           text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists pedidos_tipo_data on public.pedidos (tipo, pedido_em desc);
create index if not exists pedidos_peca on public.pedidos (peca_id);

-- ---------- Tarefas (tela "Fazer") ----------
create table if not exists public.tarefas (
  id               uuid primary key default gen_random_uuid(),
  pedido_em        timestamptz not null default now(),
  por_id           uuid references public.pessoas(id) on delete set null,
  tarefa           text not null,
  prazo            timestamptz,
  peca_id          uuid references public.pecas(id) on delete set null,
  entregue_em      timestamptz,
  entregue_para_id uuid references public.pessoas(id) on delete set null,
  obs              text,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

-- ---------- Medidas (tabelas/arquivos por cliente) ----------
create table if not exists public.medidas (
  id           uuid primary key default gen_random_uuid(),
  cliente_id   uuid references public.clientes(id) on delete cascade,
  titulo       text not null,
  arquivo      text,          -- caminho no Storage
  nome_arquivo text,
  tipo_arquivo text,
  tamanho      bigint,
  obs          text,
  criado_em    timestamptz not null default now()
);

-- ---------- atualizado_em automático ----------
create or replace function public.tocar_atualizado() returns trigger
language plpgsql set search_path = '' as $$
begin new.atualizado_em := now(); return new; end $$;

drop trigger if exists t_pecas_upd on public.pecas;
create trigger t_pecas_upd before update on public.pecas for each row execute function public.tocar_atualizado();
drop trigger if exists t_pedidos_upd on public.pedidos;
create trigger t_pedidos_upd before update on public.pedidos for each row execute function public.tocar_atualizado();
drop trigger if exists t_tarefas_upd on public.tarefas;
create trigger t_tarefas_upd before update on public.tarefas for each row execute function public.tocar_atualizado();

-- ---------- Segurança (RLS): só quem está logado acessa ----------
do $$
declare t text;
begin
  foreach t in array array['pessoas','clientes','pecas','pedidos','tarefas','medidas'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "logado" on public.%I', t);
    execute format('create policy "logado" on public.%I for all to authenticated using (true) with check (true)', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- ---------- Storage: bucket privado para fotos e arquivos ----------
insert into storage.buckets (id, name, public, file_size_limit)
values ('arquivos', 'arquivos', false, 15728640)
on conflict (id) do nothing;

drop policy if exists "arquivos_logado" on storage.objects;
create policy "arquivos_logado" on storage.objects for all to authenticated
  using (bucket_id = 'arquivos') with check (bucket_id = 'arquivos');

-- ---------- Dados iniciais ----------
insert into public.clientes (nome, sigla, cor, ordem)
select * from (values
  ('Renner',        'RNN', '#C8102E', 1),
  ('C&A',           'CeA', '#1F4E9C', 2),
  ('Havan',         'HAV', '#0B5FA5', 3),
  ('Insider',       'IND', '#2B2B2B', 4),
  ('Pernambucanas', 'PER', '#D9541E', 5)
) v(nome, sigla, cor, ordem)
where not exists (select 1 from public.clientes);

insert into public.pessoas (nome, cor)
select * from (values
  ('Shot',     '#D23B3B'),
  ('Karen',    '#3B4FD2'),
  ('Marino',   '#9B3BD2'),
  ('Anderson', '#17925A'),
  ('Kath',     '#0E8FA0'),
  ('Lu',       '#C98A06')
) v(nome, cor)
where not exists (select 1 from public.pessoas);

-- =====================================================================
-- MEU PONTO (adicionado em 2026-10-05)
-- =====================================================================
create table if not exists public.ponto (
  id            uuid primary key default gen_random_uuid(),
  dia           date not null unique,
  entrada       text check (entrada ~ '^\d{2}:\d{2}$'),
  almoco        text check (almoco  ~ '^\d{2}:\d{2}$'),
  volta         text check (volta   ~ '^\d{2}:\d{2}$'),
  saida         text check (saida   ~ '^\d{2}:\d{2}$'),
  tipo          text not null default 'normal' check (tipo in ('normal','feriado','atestado','ferias','folga','falta')),
  ajuste_min    int  not null default 0,
  obs           text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- "Assinatura do ponto até dia 15" — fechamento do período
create table if not exists public.ponto_fechamentos (
  id         uuid primary key default gen_random_uuid(),
  ate        date not null,
  saldo_min  int,
  zera       boolean not null default false,   -- zera o banco de horas a partir daqui
  obs        text,
  criado_em  timestamptz not null default now()
);

-- configurações (jornada de trabalho etc.)
create table if not exists public.config (
  id            uuid primary key default gen_random_uuid(),
  chave         text not null unique,
  valor         jsonb not null default '{}'::jsonb,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

drop trigger if exists t_ponto_upd on public.ponto;
create trigger t_ponto_upd before update on public.ponto for each row execute function public.tocar_atualizado();
drop trigger if exists t_config_upd on public.config;
create trigger t_config_upd before update on public.config for each row execute function public.tocar_atualizado();

do $$
declare t text;
begin
  foreach t in array array['ponto','ponto_fechamentos','config'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "logado" on public.%I', t);
    execute format('create policy "logado" on public.%I for all to authenticated using (true) with check (true)', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- =====================================================================
-- AJUSTE DAS FOTOS (adicionado em 2026-10-05): posição e zoom por imagem
-- formato: { "<caminho da foto>": { "m": "cover|contain", "z": 1.2, "x": 10, "y": -5 } }
-- =====================================================================
alter table public.pecas add column if not exists foto_ajustes jsonb not null default '{}'::jsonb;

-- =====================================================================
-- ARQUIVOS DO CONSUMO (adicionado em 2026-10-06): separados das fotos do catálogo
-- =====================================================================
alter table public.pecas add column if not exists arquivos_consumo jsonb not null default '[]'::jsonb;

-- =====================================================================
-- GUIA DE MEDIDAS (adicionado em 2026-10-07): pontos de medida dos manuais dos clientes
-- importados pelo botão "Importar guia" da tela Medidas (arquivos no bucket privado "arquivos")
-- =====================================================================
create table if not exists public.guia_manuais (
  id         uuid primary key default gen_random_uuid(),
  manual     text not null unique,            -- renner | cea | havan
  cliente_id uuid references public.clientes(id) on delete set null,
  titulo     text,
  arquivo    text,                            -- PDF completo no Storage
  paginas    int,
  criado_em  timestamptz not null default now()
);
create table if not exists public.guia_pontos (
  id         uuid primary key default gen_random_uuid(),
  manual     text not null,
  codigo     text not null,
  nome       text not null,
  como_medir text,
  grupo      text,
  pagina     int,
  imagem     text,
  extra      jsonb not null default '{}'::jsonb,
  ordem      int not null default 0,
  favorito   boolean not null default false,
  criado_em  timestamptz not null default now()
);
create index if not exists guia_pontos_manual on public.guia_pontos (manual, ordem);

do $$
declare t text;
begin
  foreach t in array array['guia_manuais','guia_pontos'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "logado" on public.%I', t);
    execute format('create policy "logado" on public.%I for all to authenticated using (true) with check (true)', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- =====================================================================
-- FICHA TÉCNICA e FICHA DE CONSUMO (adicionado em 2026-10-07): uma linha por peça
-- tecnica: cabeçalho, desenho, obs., etiquetas, tabela de medidas, consumos por tamanho
-- consumo: tecidos e aviamentos
-- =====================================================================
create table if not exists public.fichas (
  id            uuid primary key default gen_random_uuid(),
  peca_id       uuid not null unique references public.pecas(id) on delete cascade,
  tecnica       jsonb not null default '{}'::jsonb,
  consumo       jsonb not null default '{}'::jsonb,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
drop trigger if exists t_fichas_upd on public.fichas;
create trigger t_fichas_upd before update on public.fichas for each row execute function public.tocar_atualizado();
alter table public.fichas enable row level security;
drop policy if exists "logado" on public.fichas;
create policy "logado" on public.fichas for all to authenticated using (true) with check (true);
revoke all on public.fichas from anon;
grant select, insert, update, delete on public.fichas to authenticated;

-- =====================================================================
-- ETAPAS e SALA (adicionado em 2026-10-08)
-- fluxos: uma linha por modelo na tela Etapas
--   etapas = { <etapa>: { st, em, hist[], arquivos[{p,n,em}], pend[{id,t,ok,em}], resp, prazo, obs } }
-- pecas.sala: sala/linha do cliente (Farm, Blue Steel, Plus size…)
-- =====================================================================
alter table public.pecas add column if not exists sala text;

create table if not exists public.fluxos (
  id            uuid primary key default gen_random_uuid(),
  peca_id       uuid not null unique references public.pecas(id) on delete cascade,
  etapas        jsonb not null default '{}'::jsonb,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
drop trigger if exists t_fluxos_upd on public.fluxos;
create trigger t_fluxos_upd before update on public.fluxos for each row execute function public.tocar_atualizado();
alter table public.fluxos enable row level security;
drop policy if exists "logado" on public.fluxos;
create policy "logado" on public.fluxos for all to authenticated using (true) with check (true);
revoke all on public.fluxos from anon;
grant select, insert, update, delete on public.fluxos to authenticated;

-- Modelista do mini consumo (adicionado em 2026-10-09)
alter table public.pedidos add column if not exists modelista_id uuid references public.pessoas(id) on delete set null;
