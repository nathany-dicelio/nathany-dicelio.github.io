/* Nathany Di Celio · Ateliê */
'use strict';
(() => {

/* ================================================================
   Constantes
   ================================================================ */
const CFG = window.ND_CONFIG || {};
const DEMO = !(CFG.supabaseUrl && CFG.supabaseAnonKey) || new URLSearchParams(location.search).has('demo');

const ETAPAS = {
  desenho: [['desenho', 'Desenho'], ['conferido', 'Conferido'], ['sisplan', 'Sisplan'], ['isa', 'ISA']],
  consumo: [['consumo', 'Consumo'], ['sisplan', 'Sisplan'], ['foto', 'Foto'], ['isa', 'ISA']],
};
// etapas feitas depois do finalizado: não mudam o "Finalizado"
const POS_ETAPAS = { desenho: [['tabela', 'Tabela']], consumo: [] };
const TIPO = {
  desenho: { nome: 'Desenho', plural: 'Desenhos', rota: 'desenhos', novo: 'Novo desenho', icone: 'pen' },
  consumo: { nome: 'Consumo', plural: 'Consumos', rota: 'consumos', novo: 'Novo consumo', icone: 'scissors' },
};
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_LONGO = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const PERIODOS = [['tudo', 'Qualquer data'], ['mes', 'Este mês'], ['30', 'Últimos 30 dias'], ['ano', 'Este ano']];
const CORES = ['#781026', '#D23B3B', '#3B4FD2', '#9B3BD2', '#17925A', '#0E8FA0', '#C98A06', '#D9541E', '#B4507A', '#2B2B2B'];
const TABS = ['pessoas', 'clientes', 'pecas', 'pedidos', 'tarefas', 'medidas', 'ponto', 'ponto_fechamentos', 'config', 'guia_manuais', 'guia_pontos', 'fichas', 'fluxos'];

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9"/><path d="M14.5 14.5 20 20"/><path d="M8.1 8.1 12 12"/>',
  list: '<path d="m3 7 2 2 4-4"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  arrowR: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  dress: '<path d="M9.5 2.5h5"/><path d="M10 2.5 9 7l1.5 2L5 21.5h14L13.5 9 15 7l-1-4.5"/><path d="M9 7h6"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  note: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2"/><path d="M6.6 6.6A17.4 17.4 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  star: '<path d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z"/>',
  flow: '<circle cx="5" cy="12" r="2.6"/><circle cx="12" cy="12" r="2.6"/><circle cx="19" cy="12" r="2.6"/><path d="M7.6 12h1.8"/><path d="M14.6 12h1.8"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ================================================================
   Utilidades
   ================================================================ */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
}));
const clone = o => JSON.parse(JSON.stringify(o));
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const normRef = s => String(s ?? '').trim().replace(/\s+/g, ' ').toUpperCase();
const agoraISO = () => new Date().toISOString();
const dt = v => (v ? new Date(v) : null);
const fData = v => { const d = dt(v); return d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : ''; };
const fDia = v => { const d = dt(v); return d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}` : ''; };
const fHora = v => { const d = dt(v); return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : ''; };
const fQuando = v => (v ? `${fDia(v)} às ${fHora(v)}` : '');
const inData = v => { const d = dt(v); return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : ''; };
const inHora = v => { const d = dt(v); return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : ''; };
const inDT = v => (v ? `${inData(v)}T${inHora(v)}` : '');
const juntar = (data, hora) => (data ? new Date(`${data}T${hora || '00:00'}`).toISOString() : null);
const mesmoDia = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const plural = (n, s, p) => `${n} ${n === 1 ? s : (p || s + 's')}`;
const iniciais = s => String(s || '?').split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase();

function duracao(ini, fim) {
  const ms = new Date(fim) - new Date(ini);
  if (!(ms >= 0)) return '';
  const h = Math.round(ms / 36e5);
  if (h < 1) return 'em menos de 1h';
  if (h < 24) return `em ${h}h`;
  const d = Math.floor(h / 24), r = h % 24;
  return `em ${plural(d, 'dia')}${r ? ` e ${r}h` : ''}`;
}
function inicioPeriodo(p) {
  const n = new Date();
  if (p === 'mes') return new Date(n.getFullYear(), n.getMonth(), 1);
  if (p === 'ano') return new Date(n.getFullYear(), 0, 1);
  if (p === '30') return new Date(Date.now() - 30 * 864e5);
  return null;
}
function hojeExtenso() {
  const d = new Date();
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES_LONGO[d.getMonth()]}`;
}
function tamanhoArq(b) {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1).replace('.', ',')} MB`;
}

const pref = {
  _d: (() => { try { return JSON.parse(localStorage.getItem('nd.pref')) || {}; } catch (e) { return {}; } })(),
  get(k, def) { return this._d[k] ?? def; },
  set(k, v) { this._d[k] = v; try { localStorage.setItem('nd.pref', JSON.stringify(this._d)); } catch (e) { /* sem armazenamento */ } },
};

function msgErro(e) {
  const m = String((e && (e.message || e.error_description)) || e || '');
  if (e && e.code === '23505') return 'Já existe uma peça com essa referência.';
  if (/Invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(m)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (/already registered|already been registered/i.test(m)) return 'Este e-mail já tem conta. Use "Entrar".';
  if (/Signups not allowed|signup.*disabled/i.test(m)) return 'O cadastro de novas contas está desativado.';
  if (/Password should be at least/i.test(m)) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (/rate limit|too many/i.test(m)) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'Sem conexão com a internet. Tente de novo.';
  if (/JWT|expired/i.test(m)) return 'Sua sessão expirou. Entre de novo.';
  if (/Payload too large|exceeded the maximum/i.test(m)) return 'Arquivo grande demais (máx. 15 MB).';
  return m || 'Algo deu errado. Tente de novo.';
}

/* ---------- toast / modal / confirmação ---------- */
function toast(msg, tipo) {
  let box = $('.toasts');
  if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.append(box); }
  const t = document.createElement('div');
  t.className = 'toast' + (tipo === 'erro' ? ' erro' : '');
  t.innerHTML = ic(tipo === 'erro' ? 'alert' : 'check') + `<span>${esc(msg)}</span>`;
  box.append(t);
  setTimeout(() => t.remove(), tipo === 'erro' ? 5000 : 2600);
}

function modal({ titulo, corpo, rodape = '', tamanho = '', aoAbrir, aoFechar }) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal ${tamanho}" role="dialog" aria-modal="true" aria-label="${esc(titulo)}">
    <div class="modal-h"><h3>${esc(titulo)}</h3><button type="button" class="icon-btn" data-x aria-label="Fechar">${ic('x')}</button></div>
    <div class="modal-b">${corpo}</div>${rodape ? `<div class="modal-f">${rodape}</div>` : ''}</div>`;
  const onKey = e => { if (e.key === 'Escape' && $$('.modal-bg').pop() === bg && !$('.lightbox')) fechar(); };
  function fechar() { bg.remove(); document.removeEventListener('keydown', onKey); aoFechar && aoFechar(); }
  bg.addEventListener('click', e => { if (e.target.closest('[data-x],[data-cancelar]')) fechar(); });
  document.addEventListener('keydown', onKey);
  document.body.append(bg);
  const m = { el: bg, fechar, $: s => $(s, bg), $$: s => $$(s, bg) };
  if (aoAbrir) aoAbrir(m);
  if (!matchMedia('(max-width: 640px)').matches) {
    const f = $('[autofocus]', bg) || $('.modal-b input:not([type=hidden]):not([type=radio]):not([type=checkbox]):not([type=file]):not([type=color]), .modal-b textarea', bg);
    if (f) setTimeout(() => f.focus(), 40);
  }
  return m;
}

function confirmar(msg, { titulo = 'Tem certeza?', ok = 'Excluir', perigo = true } = {}) {
  return new Promise(res => {
    let r = false;
    modal({
      titulo, tamanho: 'sm',
      corpo: `<p style="margin:0;color:var(--ink-2)">${msg}</p>`,
      rodape: `<button type="button" class="btn" data-cancelar>Cancelar</button><button type="button" class="btn ${perigo ? 'primary' : 'primary'}" data-ok>${esc(ok)}</button>`,
      aoAbrir: m => { m.$('[data-ok]').onclick = () => { r = true; m.fechar(); }; setTimeout(() => m.$('[data-ok]').focus(), 40); },
      aoFechar: () => res(r),
    });
  });
}

function ocupado(btn, sim, texto = 'Salvando…') {
  if (!btn) return;
  if (sim) { btn.dataset.txt = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spinner" style="width:16px;height:16px;border-width:2px"></span>${esc(texto)}`; }
  else { btn.disabled = false; if (btn.dataset.txt) btn.innerHTML = btn.dataset.txt; }
}

/* ---------- imagens ---------- */
async function comprimir(file, max = 1600, q = 0.85) {
  if (!file.type.startsWith('image/') || /gif|svg/.test(file.type)) return file;
  let bmp = null;
  try { bmp = await createImageBitmap(file); } catch (e) { return file; }
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  if (s === 1 && file.size < 900 * 1024) return file;
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const b = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
  return b || file;
}
const extDe = (blob, nome) => (blob.type === 'image/jpeg' ? 'jpg' : blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp'
  : (String(nome || '').split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5));
const nomeSeguro = n => norm(n).replace(/[^a-z0-9.\-_]+/g, '-').replace(/-+/g, '-').slice(-80) || 'arquivo';

/* ================================================================
   Banco de dados — Supabase ou demonstração (no navegador)
   ================================================================ */
function SupaAPI() {
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  const ok = ({ data, error }) => { if (error) throw error; return data; };
  const base = () => location.origin + location.pathname;
  const B = () => sb.storage.from('arquivos');
  return {
    demo: false,
    async sessao() { return ok(await sb.auth.getSession()).session; },
    aoMudarAuth(cb) { sb.auth.onAuthStateChange((ev, s) => setTimeout(() => cb(ev, s), 0)); },
    async entrar(email, senha) { ok(await sb.auth.signInWithPassword({ email, password: senha })); },
    async cadastrar(nome, email, senha) { return ok(await sb.auth.signUp({ email, password: senha, options: { data: { nome }, emailRedirectTo: base() } })); },
    async recuperar(email) { ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: base() })); },
    async trocarSenha(senha) { ok(await sb.auth.updateUser({ password: senha })); },
    async sair() { await sb.auth.signOut(); },
    async listar(tab) {
      let out = [];
      for (let de = 0; ; de += 1000) {
        const d = ok(await sb.from(tab).select('*').order('criado_em', { ascending: true }).range(de, de + 999));
        out = out.concat(d);
        if (d.length < 1000) break;
      }
      return out;
    },
    async inserir(tab, row) { return ok(await sb.from(tab).insert(row).select().single()); },
    async atualizar(tab, id, patch) { return ok(await sb.from(tab).update(patch).eq('id', id).select().single()); },
    async excluir(tab, id) { ok(await sb.from(tab).delete().eq('id', id)); },
    async enviar(path, blob, upsert = false) { ok(await B().upload(path, blob, { contentType: blob.type || 'application/octet-stream', upsert, cacheControl: upsert ? '3600' : '31536000' })); return path; },
    async inserirVarios(tab, rows) {
      let out = [];
      for (let i = 0; i < rows.length; i += 200) out = out.concat(ok(await sb.from(tab).insert(rows.slice(i, i + 200)).select()));
      return out;
    },
    async excluirOnde(tab, col, val) { ok(await sb.from(tab).delete().eq(col, val)); },
    async urls(paths) {
      const d = ok(await B().createSignedUrls(paths, 3600));
      const m = {}; d.forEach(x => { if (x.signedUrl) m[x.path] = x.signedUrl; }); return m;
    },
    async urlArquivo(path, nome) { return ok(await B().createSignedUrl(path, 600, nome ? { download: nome } : undefined)).signedUrl; },
    async removerArquivos(paths) { if (paths.length) ok(await B().remove(paths)); },
  };
}

function DemoAPI() {
  const K = 'nd.demo.v2', KA = 'nd.demo.arquivos.v2';
  const ler = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  let db = ler(K), arqs = ler(KA) || {};
  if (!db) { const s = demoSeed(); db = s.db; arqs = s.arquivos; gravar(); gravarArqs(); }
  function gravar() { try { localStorage.setItem(K, JSON.stringify(db)); } catch (e) { /* cheio */ } }
  function gravarArqs() {
    try { localStorage.setItem(KA, JSON.stringify(arqs)); }
    catch (e) { throw new Error('Sem espaço no navegador para mais arquivos na demonstração.'); }
  }
  const comAtualizado = ['pecas', 'pedidos', 'tarefas', 'ponto', 'config', 'fichas', 'fluxos'];
  const blobUrl = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
  return {
    demo: true,
    async sessao() { return { user: { id: 'demo', email: 'demo@atelie.local', user_metadata: { nome: 'Nathany' } } }; },
    aoMudarAuth() {},
    async entrar() {}, async cadastrar() {}, async recuperar() {}, async trocarSenha() {},
    async sair() { localStorage.removeItem(K); localStorage.removeItem(KA); location.reload(); },
    async listar(tab) { return clone(db[tab] || []); },
    async inserir(tab, row) {
      if (tab === 'pecas' && db.pecas.some(p => p.ref === row.ref)) throw { code: '23505', message: 'duplicate' };
      if (tab === 'ponto' && (db.ponto || []).some(p => p.dia === row.dia)) throw { code: '23505', message: 'duplicate' };
      const r = { id: uid(), criado_em: agoraISO(), ...row };
      if (comAtualizado.includes(tab)) r.atualizado_em = agoraISO();
      (db[tab] || (db[tab] = [])).push(r); gravar(); return clone(r);
    },
    async atualizar(tab, id, patch) {
      const r = (db[tab] || []).find(x => x.id === id);
      if (!r) throw new Error('Registro não encontrado');
      if (tab === 'pecas' && patch.ref && db.pecas.some(p => p.ref === patch.ref && p.id !== id)) throw { code: '23505', message: 'duplicate' };
      Object.assign(r, patch);
      if (comAtualizado.includes(tab)) r.atualizado_em = agoraISO();
      gravar(); return clone(r);
    },
    async excluir(tab, id) {
      db[tab] = (db[tab] || []).filter(x => x.id !== id);
      if (tab === 'pecas') { db.pedidos = db.pedidos.filter(p => p.peca_id !== id); ['fichas', 'fluxos'].forEach(t => { db[t] = (db[t] || []).filter(x => x.peca_id !== id); }); db.tarefas.forEach(t => { if (t.peca_id === id) t.peca_id = null; }); }
      if (tab === 'pessoas') { db.pedidos.forEach(p => { if (p.de_id === id) p.de_id = null; if (p.para_id === id) p.para_id = null; }); db.tarefas.forEach(t => { if (t.por_id === id) t.por_id = null; if (t.entregue_para_id === id) t.entregue_para_id = null; }); }
      if (tab === 'clientes') { db.pecas.forEach(p => { if (p.cliente_id === id) p.cliente_id = null; }); db.medidas = db.medidas.filter(m => m.cliente_id !== id); }
      gravar();
    },
    async inserirVarios(tab, rows) { const out = []; for (const r of rows) out.push(await this.inserir(tab, r)); return out; },
    async excluirOnde(tab, col, val) { db[tab] = (db[tab] || []).filter(x => x[col] !== val); gravar(); },
    async enviar(path, blob) {
      const b = blob.type.startsWith('image/') ? await comprimir(blob, 900, 0.75) : blob;
      arqs[path] = await blobUrl(b); gravarArqs(); return path;
    },
    async urls(paths) { const m = {}; paths.forEach(p => { if (arqs[p]) m[p] = arqs[p]; }); return m; },
    async urlArquivo(path) { const r = await fetch(arqs[path]); return URL.createObjectURL(await r.blob()); },
    async removerArquivos(paths) { paths.forEach(p => delete arqs[p]); gravarArqs(); },
  };
}

function demoFoto(cor, fundo) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fundo}"/><stop offset="1" stop-color="#E7DCD3"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><path d="M128 52h44l-5 34 13 22-10 44 72 196H58l72-196-10-44 13-22z" fill="${cor}"/><path d="M122 108h56" stroke="#fff" stroke-opacity=".35" stroke-width="4"/><path d="M150 152v190" stroke="#000" stroke-opacity=".08" stroke-width="3"/></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function demoSeed() {
  const D = 864e5, H = 36e5, now = Date.now();
  const em = (dias, hora = 10, min = 0) => { const d = new Date(now - dias * D); d.setHours(hora, min, 0, 0); return d.toISOString(); };
  const clientes = [['Renner', 'RNN', '#C8102E'], ['C&A', 'CeA', '#1F4E9C'], ['Havan', 'HAV', '#0B5FA5'], ['Insider', 'IND', '#2B2B2B'], ['Pernambucanas', 'PER', '#D9541E']]
    .map(([nome, sigla, cor], i) => ({ id: uid(), nome, sigla, cor, ordem: i + 1, criado_em: em(200) }));
  const pessoas = [['Shot', '#D23B3B'], ['Karen', '#3B4FD2'], ['Marino', '#9B3BD2'], ['Anderson', '#17925A'], ['Kath', '#0E8FA0'], ['Lu', '#C98A06']]
    .map(([nome, cor]) => ({ id: uid(), nome, cor, ativo: true, criado_em: em(200) }));
  const C = s => clientes.find(c => c.sigla === s).id;
  const P = n => (n ? pessoas.find(p => p.nome === n).id : null);
  const arquivos = {};
  const defs = [
    ['BL115546', '13972', 'CeA', 'Vestido midi com amarração na cintura', ['Viscose estampada', 'Forro somente no corpo', 'Botões forrados (8 un.)'], '#8E3B4E', '#F4E9E4'],
    ['V115329', '13947', 'IND', 'Blusa cropped canelada', ['Malha canelada 2x1', 'Bordado no decote'], '#2F2A2B', '#EFEAE6'],
    ['V116237', '14010', 'RNN', 'Saia longa plissada', [], '#C9A27E', '#F6EFE8'],
    ['BL115878', '14022', 'CeA', 'Camisa oversized de linho', ['Linho misto', 'Bolso faca duplo'], '#6B7F99', '#EEF0F2'],
    ['V116410', '14035', 'HAV', 'Vestido infantil de festa', ['Tule com glitter', 'Laço removível'], '#E3A5B6', '#FBF0F2'],
    ['PN22871', '14041', 'PER', 'Jaqueta jeans cropped', ['Lavagem clara'], '#7FA1C9', '#EDF2F7'],
    ['V116502', '14055', 'RNN', 'Macacão pantalona', [], '#B9805A', '#F5ECE4'],
    ['BL115990', '14060', 'IND', 'Top faixa com bojo', [], '#781026', '#F7ECEE'],
  ];
  const pecas = defs.map(([ref, op, sig, descricao, detalhes, cor, fundo], i) => {
    const id = uid(), fotos = [];
    if (i !== 6) { const p = `demo/${id}.svg`; arquivos[p] = demoFoto(cor, fundo); fotos.push(p); }
    return { id, ref, op, cliente_id: C(sig), descricao, detalhes, fotos, criado_em: em(140 - i * 12), atualizado_em: em(12 - i) };
  });
  const tudo = t => Object.fromEntries(ETAPAS[t].map(([k]) => [k, true]));
  const algumas = (t, n) => Object.fromEntries(ETAPAS[t].map(([k], i) => [k, i < n]));
  const pedidos = [];
  const ped = (tipo, i, dias, h, m, de, para, n, horasFim, obs) => {
    const pedido_em = em(dias, h, m);
    const total = ETAPAS[tipo].length;
    const fim = n >= total ? new Date(new Date(pedido_em).getTime() + horasFim * H).toISOString() : null;
    pedidos.push({ id: uid(), tipo, peca_id: pecas[i].id, op: pecas[i].op, pedido_em, de_id: P(de), para_id: P(para),
      etapas: n >= total ? tudo(tipo) : algumas(tipo, n), finalizado_em: fim, obs: obs || null, criado_em: pedido_em, atualizado_em: fim || pedido_em });
  };
  ped('desenho', 0, 5, 15, 40, 'Shot', 'Anderson', 6, 25);
  ped('desenho', 1, 6, 15, 47, 'Karen', 'Marino', 6, 50, 'Pedido de bordado');
  ped('desenho', 3, 1, 9, 15, 'Shot', 'Marino', 2, 0);
  ped('desenho', 4, 0, 8, 30, 'Karen', 'Anderson', 0, 0);
  ped('desenho', 7, 2, 14, 5, 'Shot', 'Anderson', 4, 0, 'Conferir alça com a modelista');
  ped('desenho', 5, 38, 11, 0, 'Shot', 'Anderson', 6, 30);
  ped('desenho', 6, 66, 10, 20, 'Karen', 'Marino', 6, 20);
  ped('desenho', 2, 96, 16, 0, 'Shot', 'Marino', 6, 26);
  ped('desenho', 0, 128, 9, 0, 'Karen', 'Anderson', 6, 48);
  ped('consumo', 2, 3, 16, 32, null, 'Kath', 4, 6);
  ped('consumo', 0, 2, 10, 10, null, 'Kath', 2, 0);
  ped('consumo', 1, 4, 13, 0, null, 'Kath', 4, 20);
  ped('consumo', 5, 34, 15, 0, null, 'Kath', 4, 22);
  ped('consumo', 6, 63, 9, 30, null, 'Kath', 4, 8);
  ped('consumo', 3, 0, 11, 0, null, 'Kath', 0, 0);
  ped('consumo', 7, 92, 14, 0, null, 'Kath', 4, 30);
  const tarefa = (texto, por, diasPedido, prazoDias, prazoHora, i, entregueDias, para, obs) => ({
    id: uid(), pedido_em: em(diasPedido, 9, 30), por_id: P(por), tarefa: texto,
    prazo: prazoDias === null ? null : em(prazoDias, prazoHora), peca_id: i === null ? null : pecas[i].id,
    entregue_em: entregueDias === null ? null : em(entregueDias, 18, 32), entregue_para_id: P(para), obs: obs || null,
    criado_em: em(diasPedido), atualizado_em: em(diasPedido),
  });
  const tarefas = [
    tarefa('Ajustar a gola da camisa conforme a prova', 'Shot', 1, -1, 18, 3, null, null),
    tarefa('Enviar ficha técnica do vestido infantil', 'Karen', 0, 0, 17, 4, null, null, 'Mandar também o PDF da grade'),
    tarefa('Revisar tabela de medidas da Havan', 'Marino', 4, 1, 12, null, null, null),
    tarefa('Separar aviamentos do vestido midi', 'Anderson', 6, 3, 18, 0, 3, 'Lu'),
    tarefa('Fotografar as peças piloto da semana', 'Karen', 2, -4, 16, null, null, null),
  ];
  const guiaEx = [
    ['513', 'Largura do decote', 'Medir a largura do decote a partir do ponto mais alto do decote em linha reta entre as alças.', 'Top – lingerie – praia', 34],
    ['514', 'Altura do decote frente', 'Medir a partir do ponto mais alto do decote em linha reta.', 'Top – lingerie – praia', 34],
    ['341', 'Largura da manga', 'Medir a 2cm abaixo da cava, de dobra a dobra, paralelo à linha da abertura da manga.', 'Top', 20],
    ['400', 'Comprimento saia centro das costas', 'Medir no centro das costas desde a cintura até a barra da saia.', 'Bottom', 25],
  ];
  const guia_pontos = guiaEx.map(([codigo, nome, como_medir, grupo, pagina], i) => {
    const imagem = `demo/guia-${codigo}.svg`;
    arquivos[imagem] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#fff"/><path d="M120 40h160l-20 40 30 110H110l30-110z" fill="none" stroke="#333" stroke-width="3"/><path d="M128 95h144" stroke="#d22" stroke-width="3"/><circle cx="200" cy="95" r="20" fill="#fff" stroke="#d22" stroke-width="3"/><text x="200" y="101" font-size="16" text-anchor="middle" fill="#d22" font-family="Arial">${codigo}</text></svg>`);
    return { id: uid(), manual: 'renner', codigo, nome, como_medir, grupo, pagina, imagem, extra: {}, ordem: i + 1, favorito: i === 0, criado_em: em(10) };
  });
  const guia_manuais = [{ id: uid(), manual: 'renner', cliente_id: C('RNN'), titulo: 'Manual de POMs (exemplo)', arquivo: null, paginas: 70, criado_em: em(10) }];
  return { db: { pessoas, clientes, pecas, pedidos, tarefas, medidas: [], guia_manuais, guia_pontos, fichas: [demoFicha(pecas[0])], fluxos: demoFluxos(pecas, pessoas), ...demoPonto() }, arquivos };
}

/* ================================================================
   Estado e acesso aos dados
   ================================================================ */
const S = { api: null, user: null, db: Object.fromEntries(TABS.map(t => [t, []])), urls: {}, f: {}, carregadoEm: 0, iniciando: false, rota: {} };
const root = document.getElementById('root');
const view = () => document.getElementById('view');

async function carregarTudo() {
  const r = await Promise.all(TABS.map(t => S.api.listar(t)));
  TABS.forEach((t, i) => { S.db[t] = r[i]; });
  S.carregadoEm = Date.now();
}
const byId = (tab, id) => (id ? S.db[tab].find(x => x.id === id) : null);
const pessoa = id => byId('pessoas', id);
const cliente = id => byId('clientes', id);
const peca = id => byId('pecas', id);
const clientesOrd = () => [...S.db.clientes].sort((a, b) => (a.ordem - b.ordem) || a.nome.localeCompare(b.nome));
const pessoasOrd = () => [...S.db.pessoas].sort((a, b) => a.nome.localeCompare(b.nome));

async function salvarReg(tab, row, id) {
  const r = id ? await S.api.atualizar(tab, id, row) : await S.api.inserir(tab, row);
  const arr = S.db[tab];
  const i = arr.findIndex(x => x.id === r.id);
  if (i >= 0) arr[i] = r; else arr.push(r);
  return r;
}
async function excluirReg(tab, id) {
  await S.api.excluir(tab, id);
  S.db[tab] = S.db[tab].filter(x => x.id !== id);
  if (tab === 'pecas') { S.db.pedidos = S.db.pedidos.filter(p => p.peca_id !== id); S.db.fichas = S.db.fichas.filter(x => x.peca_id !== id); S.db.fluxos = S.db.fluxos.filter(x => x.peca_id !== id); S.db.tarefas.forEach(t => { if (t.peca_id === id) t.peca_id = null; }); }
  if (tab === 'pessoas') {
    S.db.pedidos.forEach(p => { if (p.de_id === id) p.de_id = null; if (p.para_id === id) p.para_id = null; });
    S.db.tarefas.forEach(t => { if (t.por_id === id) t.por_id = null; if (t.entregue_para_id === id) t.entregue_para_id = null; });
  }
  if (tab === 'clientes') { S.db.pecas.forEach(p => { if (p.cliente_id === id) p.cliente_id = null; }); S.db.medidas = S.db.medidas.filter(m => m.cliente_id !== id); }
}

/* referência: "BL115546 CeA" → ref BL115546 + cliente C&A */
function separarSufixo(texto) {
  const ref = normRef(texto);
  const ja = S.db.pecas.find(x => x.ref === ref);
  if (ja) return { ref, cliente: cliente(ja.cliente_id) };
  const partes = ref.split(' ');
  if (partes.length > 1) {
    const ult = partes[partes.length - 1];
    const so = t => norm(t).replace(/[^a-z0-9]/g, '');
    const c = S.db.clientes.find(x => (x.sigla && x.sigla.toUpperCase() === ult) || (so(x.nome) && so(x.nome) === so(ult)));
    if (c) return { ref: partes.slice(0, -1).join(' '), cliente: c };
  }
  return { ref, cliente: null };
}
function opsDaPeca(pc) {
  const s = new Set();
  if (pc.op) s.add(pc.op);
  S.db.pedidos.forEach(p => { if (p.peca_id === pc.id && p.op) s.add(p.op); });
  return [...s];
}
function statusPeca(id) {
  const st = {};
  ['desenho', 'consumo'].forEach(t => {
    const a = S.db.pedidos.filter(p => p.peca_id === id && p.tipo === t);
    st[t] = !a.length ? null : a.some(p => !p.finalizado_em) ? 'andamento' : 'ok';
  });
  return st;
}
function pecasQue(q) {
  const n = norm(q).replace(/\s+/g, '');
  if (!n) return [];
  const ops = {};
  S.db.pedidos.forEach(p => { if (p.op) (ops[p.peca_id] ||= new Set()).add(norm(p.op)); });
  return S.db.pecas.map(pc => {
    const ref = norm(pc.ref).replace(/\s+/g, '');
    const os = [...(ops[pc.id] || [])]; if (pc.op) os.push(norm(pc.op));
    const score = (ref === n || os.includes(n)) ? 4 : (ref.startsWith(n) || os.some(o => o.startsWith(n))) ? 3
      : (ref.includes(n) || os.some(o => o.includes(n))) ? 2 : norm(pc.descricao).includes(norm(q)) ? 1 : 0;
    return { pc, score };
  }).filter(x => x.score).sort((a, b) => (b.score - a.score) || String(b.pc.atualizado_em).localeCompare(String(a.pc.atualizado_em))).map(x => x.pc);
}

/* ---------- fotos (URLs temporárias do Storage) ---------- */
async function hidratarFotos(el = document) {
  const els = $$('[data-foto]:not([data-ok])', el);
  if (!els.length) return;
  const agora = Date.now();
  const falta = [...new Set(els.map(e => e.dataset.foto))].filter(p => !(S.urls[p] && S.urls[p].exp > agora));
  if (falta.length) {
    try {
      const m = await S.api.urls(falta);
      Object.entries(m).forEach(([p, u]) => { S.urls[p] = { u, exp: agora + 50 * 60e3 }; });
    } catch (e) { console.warn('Fotos:', e); }
  }
  const aj = mapaAjustes();
  els.forEach(e => {
    const c = S.urls[e.dataset.foto];
    if (!c) return;
    let img = e.querySelector(':scope > img.ft');
    if (!img) { img = document.createElement('img'); img.className = 'ft'; img.alt = ''; img.decoding = 'async'; img.loading = 'lazy'; e.prepend(img); }
    img.src = c.u;
    aplicarAjuste(img, aj[e.dataset.foto]);
    // data-fit: mostra a imagem inteira (fichas, guia) sem o zoom/posição do catálogo
    if (e.dataset.fit) { img.style.objectFit = e.dataset.fit; img.style.transform = ''; }
    e.dataset.ok = '1';
  });
}
/* ajuste de cada foto: m = cover (preencher) | contain (inteira), z = zoom, x/y = deslocamento em % do quadro */
function mapaAjustes() {
  const m = {};
  S.db.pecas.forEach(pc => { if (pc.foto_ajustes) Object.assign(m, pc.foto_ajustes); });
  return m;
}
function aplicarAjuste(img, a) {
  a = a || {};
  img.style.objectFit = a.m === 'contain' ? 'contain' : 'cover';
  const z = +a.z || 1, x = +a.x || 0, y = +a.y || 0;
  img.style.transform = (z !== 1 || x || y) ? `translate(${x}%, ${y}%) scale(${z})` : '';
}
function ajustarFoto(pc, path) {
  const PADRAO = { m: 'cover', z: 1, x: 0, y: 0 };
  const a = { ...PADRAO, ...((pc.foto_ajustes || {})[path] || {}) };
  const lim = (v, min, max) => Math.min(max, Math.max(min, v));
  modal({
    titulo: 'Ajustar imagem', tamanho: 'sm',
    corpo: `<div class="ajuste">
      <div class="aj-frame th" data-foto="${esc(path)}">${ic('dress')}</div>
      <div class="muted small" style="text-align:center">Arraste a imagem para posicionar · use o zoom para aproximar.<br>O ajuste vale para o catálogo, as listas e a ficha.</div>
      <div class="chips" style="justify-content:center"><button type="button" class="chip" data-m="cover">Preencher o quadro</button><button type="button" class="chip" data-m="contain">Mostrar inteira</button></div>
      <label class="fld"><span>Zoom</span><input type="range" min="0.5" max="3" step="0.05" name="z"></label>
      <div style="text-align:center"><button type="button" class="link-btn" data-reset>Voltar ao padrão</button></div>
    </div>`,
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="button" class="btn primary" data-salvar>Salvar ajuste</button>',
    aoAbrir: m => {
      const fr = m.$('.aj-frame'), zoom = m.$('[name=z]');
      const aplica = () => {
        const img = fr.querySelector('img.ft'); if (img) aplicarAjuste(img, a);
        m.$$('[data-m]').forEach(b => b.classList.toggle('on', b.dataset.m === a.m));
        zoom.value = a.z;
      };
      hidratarFotos(m.el).then(aplica); aplica();
      fr.addEventListener('pointerdown', e => {
        e.preventDefault(); fr.setPointerCapture(e.pointerId); fr.classList.add('arrastando');
        const sx = e.clientX, sy = e.clientY, ox = a.x, oy = a.y, w = fr.clientWidth, h = fr.clientHeight;
        const mv = ev => { a.x = Math.round(lim(ox + (ev.clientX - sx) / w * 100, -150, 150) * 10) / 10; a.y = Math.round(lim(oy + (ev.clientY - sy) / h * 100, -150, 150) * 10) / 10; aplica(); };
        const up = () => { fr.classList.remove('arrastando'); fr.removeEventListener('pointermove', mv); fr.removeEventListener('pointerup', up); fr.removeEventListener('pointercancel', up); };
        fr.addEventListener('pointermove', mv); fr.addEventListener('pointerup', up); fr.addEventListener('pointercancel', up);
      });
      fr.addEventListener('wheel', e => { e.preventDefault(); a.z = Math.round(lim(a.z * (e.deltaY < 0 ? 1.08 : 1 / 1.08), 0.5, 3) * 100) / 100; aplica(); }, { passive: false });
      zoom.addEventListener('input', () => { a.z = +zoom.value; aplica(); });
      m.el.addEventListener('click', async e => {
        const bm = e.target.closest('[data-m]');
        if (bm) { a.m = bm.dataset.m; aplica(); return; }
        if (e.target.closest('[data-reset]')) { Object.assign(a, PADRAO); aplica(); return; }
        const bs = e.target.closest('[data-salvar]');
        if (!bs) return;
        const novo = { ...(pc.foto_ajustes || {}) };
        if (a.m === 'cover' && a.z === 1 && !a.x && !a.y) delete novo[path]; else novo[path] = { m: a.m, z: a.z, x: a.x, y: a.y };
        ocupado(bs, true);
        try { await salvarReg('pecas', { foto_ajustes: novo }, pc.id); m.fechar(); toast('Ajuste da imagem salvo.'); rerender(); }
        catch (err) { ocupado(bs, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}
const ehPdf = p => /\.pdf$/i.test(String(p || ''));
const ehPdfArq = f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name || '');
const imagens = pc => ((pc && pc.fotos) || []).filter(p => !ehPdf(p));
const pdfs = pc => ((pc && pc.fotos) || []).filter(ehPdf);
const capa = pc => imagens(pc)[0] || null;
const arqCons = pc => (pc && pc.arquivos_consumo) || [];
const imgsCons = pc => arqCons(pc).filter(p => !ehPdf(p));
const pdfsCons = pc => arqCons(pc).filter(ehPdf);
// catálogo: só peças que têm desenho (consumo não entra)
const noCatalogo = pc => S.db.pedidos.some(p => p.peca_id === pc.id && p.tipo === 'desenho');
const campoArq = tipo => (tipo === 'consumo' ? 'arquivos_consumo' : 'fotos');
// etapa marcada guarda a data/hora (texto ISO); registros antigos guardam só "true"
const ehNC = v => typeof v === 'string' && v.startsWith('nc:');
const isoEtapa = v => (typeof v === 'string' ? v.replace(/^nc:/, '') : '');
const quandoEtapa = v => (isoEtapa(v).length > 10 ? fQuando(isoEtapa(v)) : '');
// clique: não feita → feita → não cadastrado → não feita
const proximaEtapa = v => (!v ? agoraISO() : ehNC(v) ? false : `nc:${agoraISO()}`);
const DICA_ETAPA = 'Clique 1 vez = feito · 2 vezes = não cadastrado (vermelho) · 3 vezes = desmarca';
const nomePdf = p => { const b = String(p).split('/').pop(); const i = b.indexOf('-', 36); return i > 0 ? b.slice(i + 1) : 'documento.pdf'; };
async function abrirArquivo(path, pagina) {
  const w = window.open('', '_blank');
  try { let u = await S.api.urlArquivo(path); if (pagina) u += `#page=${pagina}`; if (w) w.location = u; else location.href = u; }
  catch (e) { if (w) w.close(); toast(msgErro(e), 'erro'); }
}
async function enviarFotos(pecaId, files) {
  const paths = [];
  for (const f of files) {
    if (ehPdfArq(f)) {
      if (f.size > 15 * 1048576) throw new Error(`O PDF ${f.name} passa de 15 MB.`);
      const path = `pecas/${pecaId}/${uid()}-${nomeSeguro(f.name).replace(/\.pdf$/, '')}.pdf`;
      await S.api.enviar(path, f.type ? f : new Blob([f], { type: 'application/pdf' }));
      paths.push(path);
      continue;
    }
    const b = await comprimir(f);
    const path = `pecas/${pecaId}/${uid()}.${extDe(b, f.name)}`;
    await S.api.enviar(path, b);
    paths.push(path);
  }
  return paths;
}
async function lightbox(paths, idx = 0) {
  if (!paths.length) return;
  const agora = Date.now();
  const falta = paths.filter(p => !(S.urls[p] && S.urls[p].exp > agora));
  if (falta.length) {
    try { const m = await S.api.urls(falta); Object.entries(m).forEach(([p, u]) => { S.urls[p] = { u, exp: agora + 50 * 60e3 }; }); } catch (e) { toast(msgErro(e), 'erro'); return; }
  }
  const el = document.createElement('div');
  el.className = 'lightbox';
  el.innerHTML = `<img alt=""><button class="x" aria-label="Fechar">${ic('x')}</button>${paths.length > 1 ? `<button class="prev" aria-label="Anterior">${ic('chevL')}</button><button class="next" aria-label="Próxima">${ic('chevR')}</button><div class="cont"></div>` : ''}`;
  const mostra = () => { $('img', el).src = (S.urls[paths[idx]] || {}).u || ''; const c = $('.cont', el); if (c) c.textContent = `${idx + 1} de ${paths.length}`; };
  const mover = d => { idx = (idx + d + paths.length) % paths.length; mostra(); };
  const fechar = () => { el.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') fechar(); if (e.key === 'ArrowLeft') mover(-1); if (e.key === 'ArrowRight') mover(1); };
  el.addEventListener('click', e => {
    if (e.target.closest('.prev')) return mover(-1);
    if (e.target.closest('.next')) return mover(1);
    if (e.target.closest('.x') || e.target === el) fechar();
  });
  document.addEventListener('keydown', onKey);
  document.body.append(el);
  mostra();
}

/* ================================================================
   Pedaços de interface
   ================================================================ */
const thumb = (path, cls = 'th', extra = '') => `<div class="${cls}"${path ? ` data-foto="${esc(path)}"` : ''}>${ic('dress')}${extra}</div>`;
function pchip(id) {
  const p = pessoa(id);
  return p ? `<span class="pchip" style="--c:${esc(p.cor)}">${esc(p.nome)}</span>` : '<span class="muted">—</span>';
}
function cbadge(id) {
  const c = cliente(id);
  return c ? `<span class="cbadge" style="--c:${esc(c.cor)}" title="${esc(c.nome)}">${esc(c.sigla || c.nome)}</span>` : '';
}
const tagStatus = (t, s) => (s === 'ok' ? `<span class="tag green">${TIPO[t].nome} pronto</span>`
  : s === 'andamento' ? `<span class="tag amber">${TIPO[t].nome} em andamento</span>` : '');
function vazio(icone, titulo, texto = '', botao = '') {
  return `<div class="vazio">${ic(icone)}<b>${esc(titulo)}</b>${texto ? `<div>${texto}</div>` : ''}${botao ? `<div style="margin-top:16px">${botao}</div>` : ''}</div>`;
}
const opcoes = (lista, sel, vazioTxt) => (vazioTxt !== undefined ? `<option value="">${esc(vazioTxt)}</option>` : '')
  + lista.map(([v, t]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(t)}</option>`).join('');
const opClientes = (sel, vazioTxt) => opcoes(clientesOrd().map(c => [c.id, c.nome]), sel, vazioTxt);
const opPessoas = (sel, vazioTxt) => opcoes(pessoasOrd().map(p => [p.id, p.nome]), sel, vazioTxt);

function pickPessoas(nome, sel) {
  const lista = pessoasOrd().filter(p => p.ativo !== false || p.id === sel);
  return `<div class="pick" data-pick="${nome}">
    <label><input type="radio" name="${nome}" value=""${!sel ? ' checked' : ''}><span class="pk nenhum">Ninguém</span></label>
    ${lista.map(p => `<label><input type="radio" name="${nome}" value="${p.id}"${p.id === sel ? ' checked' : ''}><span class="pk" style="--c:${esc(p.cor)}">${esc(p.nome)}</span></label>`).join('')}
    <button type="button" class="chip" data-nova-pessoa="${nome}">${ic('plus')}Nova</button>
  </div>`;
}
function ligarNovaPessoa(form) {
  form.addEventListener('click', e => {
    const b = e.target.closest('[data-nova-pessoa]');
    if (!b) return;
    novaPessoaRapida(p => {
      $$('[data-pick]', form).forEach(box => {
        const nome = box.dataset.pick;
        const atual = (form.querySelector(`input[name="${nome}"]:checked`) || {}).value || null;
        box.outerHTML = pickPessoas(nome, nome === b.dataset.novaPessoa ? p.id : atual);
      });
    });
  });
}
function novaPessoaRapida(cb) {
  const cor = CORES[S.db.pessoas.length % CORES.length];
  modal({
    titulo: 'Nova pessoa', tamanho: 'sm',
    corpo: `<form class="form" id="fnp"><div class="grid3" style="grid-template-columns:56px 1fr"><label class="fld"><span>Cor</span><input type="color" name="cor" value="${cor}" style="width:48px;height:42px;border:0;background:none;padding:0"></label><label class="fld"><span>Nome</span><input name="nome" required maxlength="40" autofocus></label></div></form>`,
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fnp" class="btn primary">Adicionar</button>',
    aoAbrir: m => {
      m.$('#fnp').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        try { const p = await salvarReg('pessoas', { nome: String(fd.get('nome')).trim(), cor: fd.get('cor'), ativo: true }); m.fechar(); cb(p); }
        catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}

function editorFotos(box, inicial = []) {
  let exist = [...inicial], novas = [], rem = [];
  const draw = () => {
    const tilePdf = nome => `<span class="pdf-ic">PDF</span><span class="pdf-nm">${esc(nome)}</span>`;
    box.innerHTML = exist.map((p, i) => (ehPdf(p)
      ? `<div class="f pdf" title="${esc(nomePdf(p))}">${tilePdf(nomePdf(p))}<button type="button" data-rm-e="${i}" title="Remover PDF">${ic('x')}</button></div>`
      : `<div class="f th" data-foto="${esc(p)}">${ic('dress')}<button type="button" data-rm-e="${i}" title="Remover foto">${ic('x')}</button></div>`)).join('')
      + novas.map((n, i) => (n.pdf
        ? `<div class="f pdf" title="${esc(n.file.name)}">${tilePdf(n.file.name)}<button type="button" data-rm-n="${i}" title="Remover PDF">${ic('x')}</button></div>`
        : `<div class="f th" data-ok="1" style="background-image:url('${n.url}')"><button type="button" data-rm-n="${i}" title="Remover foto">${ic('x')}</button></div>`)).join('')
      + `<label class="add">${ic('camera')}<span>Foto ou PDF</span><input type="file" accept="image/*,application/pdf,.pdf" multiple></label>`;
    hidratarFotos(box);
  };
  box.addEventListener('click', e => {
    const a = e.target.closest('[data-rm-e]'), b = e.target.closest('[data-rm-n]');
    if (a) { rem.push(exist.splice(+a.dataset.rmE, 1)[0]); draw(); }
    if (b) { const n = novas[+b.dataset.rmN]; if (n.url) URL.revokeObjectURL(n.url); novas.splice(+b.dataset.rmN, 1); draw(); }
  });
  box.addEventListener('change', e => {
    if (e.target.type !== 'file') return;
    [...e.target.files].forEach(file => {
      if (ehPdfArq(file)) novas.push({ file, pdf: true });
      else if (file.type.startsWith('image/')) novas.push({ file, url: URL.createObjectURL(file) });
    });
    draw();
  });
  draw();
  return {
    novas: () => novas.map(n => n.file),
    removidas: () => rem,
    trocar(lista) { exist = [...lista]; rem = []; draw(); },
  };
}

/* ================================================================
   Tema / instalação
   ================================================================ */
const temaAtual = () => document.documentElement.getAttribute('data-theme') || 'light';
function aplicarTema(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('nd.tema', t); } catch (e) { /* sem armazenamento */ }
  const m = $('meta[name=theme-color]'); if (m) m.content = t === 'dark' ? '#141012' : '#781026';
}
const temaBotao = () => `<button type="button" class="tema" data-tema title="Alternar tema claro / noturno" aria-label="Alternar tema">${ic('moon', 'i lua')}${ic('sun', 'i sol')}</button>`;
let promptInstalar = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); promptInstalar = e; const b = $('#btn-instalar'); if (b) b.classList.remove('hidden'); });
document.addEventListener('click', e => { if (e.target.closest('[data-tema]')) aplicarTema(temaAtual() === 'dark' ? 'light' : 'dark'); });

/* ================================================================
   Login
   ================================================================ */
function renderAuth(modo = 'entrar', aviso = '') {
  const titulos = { entrar: ['Bem-vinda', 'Entre com seu e-mail e senha.'], cadastro: ['Criar conta', 'Cadastre seu acesso ao ateliê.'], recuperar: ['Recuperar senha', 'Enviaremos um link para criar uma nova senha.'] };
  const [h, sub] = titulos[modo];
  root.innerHTML = `<div class="auth">
    <section class="auth-art">
      <div style="position:relative;z-index:1">
        <img class="logo" src="assets/img/logo-escuro.png" alt="Nathany Di Celio">
      </div>
      <div style="position:relative;z-index:1">
        <h1>Seu ateliê,<br>organizado.</h1>
        <p>Desenhos, consumos, tarefas e o catálogo de peças num só lugar, com pesquisa rápida por OP ou referência.</p>
        <ul>
          <li><span>${ic('check')}</span>Checklist de cada desenho e consumo</li>
          <li><span>${ic('check')}</span>Catálogo com as fotos de cada peça</li>
          <li><span>${ic('check')}</span>Relatório por cliente: Renner, C&amp;A, Havan…</li>
        </ul>
      </div>
      <div class="rodape">© ${new Date().getFullYear()} Nathany Di Celio</div>
    </section>
    <section class="auth-side">
      <div class="tema-wrap">${temaBotao()}</div>
      <div class="auth-box">
        <h2>${h}</h2><p class="sub">${sub}</p>
        <div id="auth-msg">${aviso}</div>
        <form class="form" id="fauth" novalidate>
          ${modo === 'cadastro' ? '<label class="fld"><span>Seu nome</span><input name="nome" required autocomplete="name" placeholder="Nathany"></label>' : ''}
          <label class="fld"><span>E-mail</span><input name="email" type="email" required autocomplete="email" placeholder="voce@email.com"></label>
          ${modo !== 'recuperar' ? `<label class="fld"><span>Senha</span><input name="senha" type="password" required minlength="${modo === 'cadastro' ? 8 : 1}" autocomplete="${modo === 'cadastro' ? 'new-password' : 'current-password'}" placeholder="${modo === 'cadastro' ? 'Mínimo de 8 caracteres' : ''}"></label>` : ''}
          ${modo === 'entrar' ? '<div style="text-align:right;margin-top:-6px"><button type="button" class="link" data-modo="recuperar">Esqueci minha senha</button></div>' : ''}
          <button class="btn primary block" type="submit" style="height:46px">${modo === 'entrar' ? 'Entrar' : modo === 'cadastro' ? 'Criar conta' : 'Enviar link'}</button>
        </form>
        <div class="alt">${modo === 'entrar' ? (CFG.permitirCadastro ? 'Ainda não tem acesso? <button type="button" class="link" data-modo="cadastro">Criar conta</button>' : '')
          : '<button type="button" class="link" data-modo="entrar">Voltar para o login</button>'}</div>
      </div>
    </section>
  </div>`;
  $$('[data-modo]').forEach(b => { b.onclick = () => renderAuth(b.dataset.modo); });
  const msg = (t, erro) => { $('#auth-msg').innerHTML = `<div class="aviso ${erro ? 'erro' : ''}" style="margin-bottom:14px">${ic(erro ? 'alert' : 'info')}<span>${esc(t)}</span></div>`; };
  $('#fauth').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = String(fd.get('email') || '').trim(), senha = String(fd.get('senha') || '');
    if (!email) return msg('Informe seu e-mail.', true);
    if (modo !== 'recuperar' && !senha) return msg('Informe sua senha.', true);
    if (modo === 'cadastro' && senha.length < 8) return msg('A senha precisa ter pelo menos 8 caracteres.', true);
    const btn = $('#fauth .btn'); ocupado(btn, true, 'Aguarde…');
    try {
      if (modo === 'entrar') { await S.api.entrar(email, senha); const s = await S.api.sessao(); if (s) await iniciar(s); }
      else if (modo === 'cadastro') {
        const r = await S.api.cadastrar(String(fd.get('nome') || '').trim(), email, senha);
        if (r && r.session) await iniciar(r.session);
        else renderAuth('entrar', `<div class="aviso" style="margin-bottom:14px">${ic('info')}<span>Conta criada! Enviamos um e-mail para <b>${esc(email)}</b>. Abra o link para confirmar e depois entre aqui.</span></div>`);
      } else { await S.api.recuperar(email); ocupado(btn, false); msg('Se esse e-mail tiver conta, você vai receber um link para criar uma nova senha.'); }
    } catch (err) { ocupado(btn, false); msg(msgErro(err), true); }
  });
}

function pedirNovaSenha() {
  modal({
    titulo: 'Nova senha', tamanho: 'sm',
    corpo: '<form class="form" id="fns"><label class="fld"><span>Nova senha</span><input type="password" name="s1" minlength="8" required autocomplete="new-password" placeholder="Mínimo de 8 caracteres"></label><label class="fld"><span>Repita a senha</span><input type="password" name="s2" required autocomplete="new-password"></label></form>',
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fns" class="btn primary">Salvar senha</button>',
    aoAbrir: m => m.$('#fns').addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      if (String(fd.get('s1')).length < 8) return toast('A senha precisa ter pelo menos 8 caracteres.', 'erro');
      if (fd.get('s1') !== fd.get('s2')) return toast('As senhas não são iguais.', 'erro');
      const btn = m.$('.btn.primary'); ocupado(btn, true);
      try { await S.api.trocarSenha(String(fd.get('s1'))); m.fechar(); toast('Senha alterada.'); }
      catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
    }),
  });
}

/* ================================================================
   Estrutura (menu lateral + barra do topo)
   ================================================================ */
const nomeUsuario = () => (S.user && ((S.user.user_metadata || {}).nome || String(S.user.email || '').split('@')[0])) || 'Nathany';

function renderShell() {
  root.innerHTML = `<div class="shell">
    <aside class="side">
      <a class="brand" href="#/inicio" aria-label="Início"><img class="logo-claro" src="assets/img/logo.png" alt="Nathany Di Celio"><img class="logo-escuro" src="assets/img/logo-escuro.png" alt="Nathany Di Celio"><small>Kabriolli</small></a>
      <nav class="nav">
        <div class="grp">Geral</div>
        <a href="#/inicio" data-r="inicio">${ic('home')}Início</a>
        <a href="#/ponto" data-r="ponto">${ic('clock')}Meu ponto</a>
        <div class="grp">Trabalho</div>
        <a href="#/desenhos" data-r="desenhos">${ic('pen')}Desenho<span class="cnt hidden" data-cnt="desenho"></span></a>
        <a href="#/consumos" data-r="consumos">${ic('scissors')}Mini consumo<span class="cnt hidden" data-cnt="consumo"></span></a>
        <a href="#/fazer" data-r="fazer">${ic('list')}Fazer<span class="cnt hidden" data-cnt="fazer"></span></a>
        <a href="#/etapas" data-r="etapas">${ic('flow')}Etapas<span class="cnt hidden" data-cnt="etapas"></span></a>
        <div class="grp">Fichas</div>
        <a href="#/ficha-tecnica" data-r="ficha-tecnica">${ic('file')}Ficha técnica</a>
        <div class="grp">Consulta</div>
        <a href="#/catalogo" data-r="catalogo">${ic('grid')}Catálogo</a>
        <a href="#/medidas" data-r="medidas">${ic('ruler')}Medidas</a>
        <div class="grp">Configurar</div>
        <a href="#/ajustes" data-r="ajustes">${ic('sliders')}Pessoas e clientes</a>
      </nav>
      <div class="foot">
        ${S.api.demo ? '<div class="demo-flag">Modo demonstração · dados de exemplo</div>' : ''}
        <button type="button" class="instalar${promptInstalar ? '' : ' hidden'}" id="btn-instalar">${ic('monitor')}<span>Instalar aplicativo</span></button>
        <div class="user">
          <div class="avatar">${esc(iniciais(nomeUsuario()))}</div>
          <div><div class="nm">${esc(nomeUsuario())}</div><div class="em">${esc(S.user.email || '')}</div></div>
          <button type="button" class="icon-btn" id="btn-sair" title="${S.api.demo ? 'Reiniciar demonstração' : 'Sair'}">${ic('logout')}</button>
        </div>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button type="button" class="icon-btn menu-btn" id="btn-menu" aria-label="Menu">${ic('menu')}</button>
        <div class="ttl"><h1 id="pg-titulo"></h1><div class="sub" id="pg-sub"></div></div>
        <div class="acoes">
          <div class="gsearch">${ic('search')}<input class="inp" id="gbusca" placeholder="Pesquisar OP ou REF…" autocomplete="off" spellcheck="false" aria-label="Pesquisar OP ou referência"><kbd>/</kbd><div class="sugest hidden"></div></div>
          <span id="pg-acao"></span>
          ${temaBotao()}
        </div>
      </header>
      <main class="content" id="view"></main>
    </div>
  </div>`;
  $('#btn-menu').onclick = () => $('.shell').classList.toggle('menu-aberto');
  $('.shell').addEventListener('click', e => { if (e.target.classList.contains('shell')) fecharMenu(); });
  $('#btn-sair').onclick = async () => {
    if (S.api.demo) { if (await confirmar('Apagar as alterações e voltar aos dados de exemplo?', { titulo: 'Reiniciar demonstração', ok: 'Reiniciar' })) S.api.sair(); return; }
    if (await confirmar('Deseja sair da sua conta neste aparelho?', { titulo: 'Sair', ok: 'Sair' })) { await S.api.sair(); S.user = null; renderAuth(); }
  };
  $('#btn-instalar').onclick = async () => { if (!promptInstalar) return; promptInstalar.prompt(); await promptInstalar.userChoice; promptInstalar = null; $('#btn-instalar').classList.add('hidden'); };
  ligarBuscaGlobal();
  if (!root.dataset.ligado) { root.addEventListener('click', acoesGlobais); root.dataset.ligado = '1'; }
}
function fecharMenu() { const s = $('.shell'); if (s) s.classList.remove('menu-aberto'); }
function setPage(titulo, sub = '', acao = '') {
  $('#pg-titulo').textContent = titulo;
  $('#pg-sub').textContent = sub;
  $('#pg-acao').innerHTML = acao;
  document.title = `${titulo} · Nathany Di Celio`;
}
function atualizarContadores() {
  const set = (k, n, ok) => { const el = $(`[data-cnt="${k}"]`); if (!el) return; el.textContent = n; el.classList.toggle('hidden', !n); el.classList.toggle('ok', !!ok); };
  set('desenho', S.db.pedidos.filter(p => p.tipo === 'desenho' && !p.finalizado_em).length);
  set('consumo', S.db.pedidos.filter(p => p.tipo === 'consumo' && !p.finalizado_em).length);
  set('fazer', S.db.tarefas.filter(t => !t.entregue_em).length);
  set('etapas', S.db.fluxos.reduce((n, fl) => { const pc = peca(fl.peca_id); return n + (pc ? situacaoFluxo(pc).pend : 0); }, 0));
}

/* busca global (topo) */
function ligarBuscaGlobal() {
  const inp = $('#gbusca'), box = $('.gsearch .sugest');
  let lista = [], sel = -1;
  const fechar = () => { box.classList.add('hidden'); sel = -1; };
  const desenhar = () => {
    const q = inp.value.trim();
    if (!q) return fechar();
    lista = pecasQue(q).slice(0, 7);
    box.innerHTML = lista.length ? lista.map((pc, i) => `<a href="#/peca/${pc.id}" class="${i === sel ? 'sel' : ''}">${thumb(capa(pc))}<div class="tx"><b>${esc(pc.ref)} ${cbadge(pc.cliente_id)}</b><small>${opsDaPeca(pc).length ? 'OP ' + esc(opsDaPeca(pc).join(', ')) : 'Sem OP'}${pc.descricao ? ' · ' + esc(pc.descricao) : ''}</small></div></a>`).join('')
      + `<a href="#/busca/${encodeURIComponent(q)}" class="${sel === lista.length ? 'sel' : ''}"><div class="tx"><b>${ic('search')} Ver todos os resultados para “${esc(q)}”</b></div></a>`
      : `<div class="vazio-s">Nada encontrado para “${esc(q)}”.</div><a href="#/busca/${encodeURIComponent(q)}"><div class="tx"><b>Abrir pesquisa</b></div></a>`;
    box.classList.remove('hidden');
    hidratarFotos(box);
  };
  inp.addEventListener('input', () => { sel = -1; desenhar(); });
  inp.addEventListener('focus', () => { if (inp.value.trim()) desenhar(); });
  inp.addEventListener('blur', () => setTimeout(fechar, 180));
  inp.addEventListener('keydown', e => {
    const max = lista.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(max, sel + 1); desenhar(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(-1, sel - 1); desenhar(); }
    else if (e.key === 'Escape') { inp.blur(); fechar(); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const q = inp.value.trim(); if (!q) return;
      let destino;
      if (sel >= 0 && sel < max) destino = `#/peca/${lista[sel].id}`;
      else if (sel !== max && lista.length === 1) destino = `#/peca/${lista[0].id}`;
      else destino = `#/busca/${encodeURIComponent(q)}`;
      location.hash = destino; inp.value = ''; inp.blur(); fechar();
    }
  });
  box.addEventListener('mousedown', e => e.preventDefault());
  box.addEventListener('click', e => { if (e.target.closest('a')) { inp.value = ''; fechar(); inp.blur(); } });
}
document.addEventListener('keydown', e => {
  if (e.key !== '/' || e.ctrlKey || e.metaKey) return;
  const t = e.target;
  if (t.closest && t.closest('input, textarea, select, [contenteditable]')) return;
  const g = $('#gbusca'); if (g && !$('.modal-bg')) { e.preventDefault(); g.focus(); }
});

/* ações por atributo data-acao (usadas em várias telas) */
async function acoesGlobais(e) {
  const bat = e.target.closest('[data-bater]');
  if (bat) return baterPonto(bat.dataset.bater, bat);
  const pd = e.target.closest('[data-dia]');
  if (pd) return formPonto(pd.dataset.dia);
  const novo = e.target.closest('[data-novo]');
  if (novo) {
    const t = novo.dataset.novo, pc = novo.dataset.peca ? peca(novo.dataset.peca) : null;
    if (t === 'tarefa') return formTarefa(null, pc);
    if (t === 'medida') return formMedida(null, novo.dataset.cliente || null);
    return formPedido(t, null, pc);
  }
  const a = e.target.closest('[data-acao]');
  if (!a) return;
  const id = a.dataset.id;
  switch (a.dataset.acao) {
    case 'etapa': return alternarEtapa(id, a.dataset.k, a);
    case 'pos': return alternarPos(id, a.dataset.k, a);
    case 'editar-pedido': { const p = byId('pedidos', id); return p && formPedido(p.tipo, p); }
    case 'excluir-pedido': return excluirPedido(id);
    case 'editar-tarefa': return formTarefa(byId('tarefas', id));
    case 'excluir-tarefa': return excluirTarefa(id);
    case 'entregar': return entregarTarefa(byId('tarefas', id));
    case 'fotos': { const pc = peca(id); return pc && lightbox(a.dataset.cons ? imgsCons(pc) : imagens(pc), +(a.dataset.i || 0)); }
    default:
  }
}

/* ================================================================
   Roteamento
   ================================================================ */
const ROTAS = {
  inicio: viewInicio,
  desenhos: () => viewPedidos('desenho'),
  consumos: () => viewPedidos('consumo'),
  fazer: viewFazer,
  catalogo: viewCatalogo,
  medidas: viewMedidas,
  ajustes: viewAjustes,
  ponto: viewPonto,
  etapas: viewEtapas,
  filtro: irFiltro,
  'ficha-tecnica': a => viewFicha('tecnica', a),
  'ficha-consumo': a => location.replace(`#/ficha-tecnica${a ? '/' + a : ''}`),
  peca: viewPeca,
  busca: viewBusca,
};
function route(rolar = true) {
  const h = location.hash.replace(/^#\/?/, '');
  const [nome, ...resto] = h.split('/');
  const fn = ROTAS[nome];
  if (!fn) { location.replace('#/inicio'); return; }
  let arg = resto.join('/');
  try { arg = decodeURIComponent(arg); } catch (e) { /* mantém */ }
  S.rota = { nome, arg };
  const navNome = nome === 'peca' || nome === 'busca' ? 'catalogo' : nome;
  $$('.nav a').forEach(a => a.classList.toggle('on', a.dataset.r === navNome));
  fecharMenu();
  fn(arg);
  atualizarContadores();
  hidratarFotos(view());
  if (rolar) window.scrollTo(0, 0);
}
const rerender = () => route(false);

/* ================================================================
   INÍCIO — relatório
   ================================================================ */
function viewInicio() {
  const per = pref.get('periodo', 'tudo');
  const ini = inicioPeriodo(per);
  const noPer = iso => !ini || (iso && new Date(iso) >= ini);
  setPage(`Olá, ${nomeUsuario().split(' ')[0]}`, hojeExtenso().replace(/^./, c => c.toUpperCase()),
    `<button class="btn primary" data-novo="desenho">${ic('plus')}<span class="tx">Novo desenho</span></button>`);

  const peds = S.db.pedidos;
  const resumo = t => {
    const a = peds.filter(p => p.tipo === t);
    return { feitos: a.filter(p => p.finalizado_em && noPer(p.finalizado_em)).length, andamento: a.filter(p => !p.finalizado_em).length, pedidos: a.filter(p => noPer(p.pedido_em)).length };
  };
  const rd = resumo('desenho'), rc = resumo('consumo');
  const agora = new Date();
  const abertas = S.db.tarefas.filter(t => !t.entregue_em);
  const atrasadas = abertas.filter(t => t.prazo && new Date(t.prazo) < agora).length;
  const paraHoje = abertas.filter(t => t.prazo && new Date(t.prazo) >= agora && mesmoDia(new Date(t.prazo), agora)).length;
  const pecasCat = S.db.pecas.filter(noCatalogo);
  const comFoto = pecasCat.filter(p => capa(p)).length;
  const nomePer = { tudo: 'desde o início', mes: 'neste mês', ano: 'neste ano', 30: 'nos últimos 30 dias' }[per];

  // gráfico por mês
  const anos = [...new Set(peds.map(p => new Date(p.pedido_em).getFullYear()).concat(agora.getFullYear()))].sort((a, b) => b - a);
  const ano = anos.includes(pref.get('ano')) ? pref.get('ano') : agora.getFullYear();
  const meses = MESES.map((m, i) => {
    const doMes = peds.filter(p => { const d = new Date(p.pedido_em); return d.getFullYear() === ano && d.getMonth() === i; });
    return { m, d: doMes.filter(p => p.tipo === 'desenho').length, c: doMes.filter(p => p.tipo === 'consumo').length };
  });
  const maxMes = Math.max(1, ...meses.map(x => x.d + x.c));

  // por cliente
  const porCli = [...clientesOrd(), { id: null, nome: 'Sem cliente', cor: '#9A8A8F' }].map(c => {
    const pcs = S.db.pecas.filter(p => (p.cliente_id || null) === c.id);
    const ids = new Set(pcs.map(p => p.id));
    const ps = peds.filter(p => ids.has(p.peca_id) && noPer(p.pedido_em));
    const d = ps.filter(p => p.tipo === 'desenho').length, co = ps.filter(p => p.tipo === 'consumo').length;
    const pecasNoPer = ini ? new Set(ps.map(p => p.peca_id)).size : pcs.length;
    return { c, d, co, pecas: pecasNoPer, total: d + co };
  }).filter(x => x.c.id || x.total || x.pecas).sort((a, b) => b.total - a.total || b.pecas - a.pecas);
  const maxCli = Math.max(1, ...porCli.map(x => x.total));

  const andamento = peds.filter(p => !p.finalizado_em).sort((a, b) => new Date(a.pedido_em) - new Date(b.pedido_em)).slice(0, 6);
  const prazos = abertas.slice().sort((a, b) => (a.prazo ? new Date(a.prazo) : 9e15) - (b.prazo ? new Date(b.prazo) : 9e15)).slice(0, 5);
  const recentes = [...pecasCat].sort((a, b) => String(b.atualizado_em).localeCompare(String(a.atualizado_em))).slice(0, 8);

  view().innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <div class="muted small" style="flex:1">Resumo ${nomePer}</div>
      <div class="chips" id="per">${[['mes', 'Este mês'], ['ano', 'Este ano'], ['tudo', 'Tudo']].map(([v, t]) => `<button class="chip${per === v ? ' on' : ''}" data-per="${v}">${t}</button>`).join('')}</div>
    </div>
    <div class="kpis">
      <a class="card kpi" href="#/desenhos"><div class="ic">${ic('pen')}</div><div><div class="lb">Desenhos feitos</div><div class="vl num">${rd.feitos}</div><div class="ds">${plural(rd.andamento, 'em andamento', 'em andamento')} · ${plural(rd.pedidos, 'pedido')}</div></div></a>
      <a class="card kpi" href="#/consumos"><div class="ic gold">${ic('scissors')}</div><div><div class="lb">Consumos feitos</div><div class="vl num">${rc.feitos}</div><div class="ds">${plural(rc.andamento, 'em andamento', 'em andamento')} · ${plural(rc.pedidos, 'pedido')}</div></div></a>
      <a class="card kpi" href="#/fazer"><div class="ic ${atrasadas ? 'red' : 'green'}">${ic('list')}</div><div><div class="lb">Tarefas a fazer</div><div class="vl num">${abertas.length}</div><div class="ds">${atrasadas ? `<b style="color:var(--red)">${plural(atrasadas, 'atrasada')}</b> · ` : ''}${paraHoje} para hoje</div></div></a>
      <a class="card kpi" href="#/catalogo"><div class="ic">${ic('grid')}</div><div><div class="lb">Peças no catálogo</div><div class="vl num">${pecasCat.length}</div><div class="ds">${comFoto} com foto</div></div></a>
    </div>
    <div class="dash">
      <div>
        <div class="card">
          <div class="card-h"><div><h3>Por cliente</h3><div class="sub">Pedidos de desenho e consumo ${nomePer}</div></div>
            <div class="r legenda"><span><i></i>Desenho</span><span><i class="c"></i>Consumo</span></div></div>
          <div class="card-b"><div class="cli-rows">${porCli.length ? porCli.map(x => `
            <div class="cli-row" style="--c:${esc(x.c.cor)}">
              <div class="nm"><i class="dot"></i><span>${esc(x.c.nome)}</span></div>
              <div class="trk" title="${x.d} desenho(s) · ${x.co} consumo(s)"><i class="d" style="width:${x.d / maxCli * 100}%"></i><i class="c" style="width:${x.co / maxCli * 100}%"></i></div>
              <div class="vals"><span><b class="num">${x.d}</b> des.</span><span><b class="num">${x.co}</b> cons.</span><span><b class="num">${x.pecas}</b> ${x.pecas === 1 ? 'peça' : 'peças'}</span></div>
            </div>`).join('') : vazio('users', 'Nenhum cliente cadastrado')}</div></div>
        </div>
        <div class="card">
          <div class="card-h"><div><h3>Pedidos por mês</h3><div class="sub">Pela data do pedido</div></div>
            <div class="r"><div class="legenda"><span><i></i>Desenho</span><span><i class="c"></i>Consumo</span></div>
            <select class="inp" id="ano" style="width:auto;height:34px">${anos.map(a => `<option${a === ano ? ' selected' : ''}>${a}</option>`).join('')}</select></div></div>
          <div class="card-b"><div class="bars">${meses.map((x, i) => `
            <div class="col${ano === agora.getFullYear() && i === agora.getMonth() ? ' atual' : ''}" data-t="${x.m}: ${x.d} des. · ${x.c} cons.">
              <div class="stk">${x.d + x.c ? `<div class="seg d" style="height:${x.d / maxMes * 100}%"></div><div class="seg c" style="height:${x.c / maxMes * 100}%"></div>` : '<div class="seg z"></div>'}</div>
              <div class="m">${x.m}</div></div>`).join('')}</div></div>
        </div>
      </div>
      <div>
        <div class="card hoje compacto">${htmlHoje()}<a class="hoje-pe" href="#/ponto">${ic('clock')}<span>Banco de horas <b class="${classeSaldo(resumoPonto().banco)}">${fmtSaldo(resumoPonto().banco)}</b></span><span class="link-btn">Meu ponto ${ic('chevR')}</span></a></div>
        <div class="card">
          <div class="card-h"><h3>Em andamento</h3><div class="r"><span class="tag gray sem">${andamento.length ? peds.filter(p => !p.finalizado_em).length : 0}</span></div></div>
          <div class="card-b" style="padding-top:6px"><div class="lista">${andamento.length ? andamento.map(p => {
            const pc = peca(p.peca_id) || {}; const tot = ETAPAS[p.tipo].length; const n = ETAPAS[p.tipo].filter(([k]) => (p.etapas || {})[k]).length;
            return `<a class="it" href="#/peca/${pc.id}"><div class="datebox"><b>${new Date(p.pedido_em).getDate()}</b><small>${MESES[new Date(p.pedido_em).getMonth()]}</small></div>
              <div class="t"><b>${esc(pc.ref || '—')} <span class="tag ${p.tipo === 'desenho' ? 'brand' : 'amber'} sem" style="height:20px;font-size:11px;margin-left:4px">${TIPO[p.tipo].nome}</span></b><small>${n} de ${tot} etapas${p.para_id ? ' · para ' + esc((pessoa(p.para_id) || {}).nome || '') : ''}</small></div>
              <div class="prog"><i style="width:${n / tot * 100}%"></i></div></a>`;
          }).join('') : vazio('check', 'Tudo em dia', 'Nenhum desenho ou consumo pendente.')}</div></div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Próximos prazos</h3><div class="r"><a class="link-btn" href="#/fazer">Ver tarefas</a></div></div>
          <div class="card-b" style="padding-top:6px"><div class="lista">${prazos.length ? prazos.map(t => {
            const st = estadoPrazo(t);
            return `<a class="it" href="#/fazer"><div class="datebox ${st.cor === 'red' ? 'red' : st.cor === 'amber' ? 'amber' : ''}">${t.prazo ? `<b>${new Date(t.prazo).getDate()}</b><small>${MESES[new Date(t.prazo).getMonth()]}</small>` : '<b>—</b><small>prazo</small>'}</div>
              <div class="t"><b>${esc(t.tarefa)}</b><small>${st.texto}${t.por_id ? ' · por ' + esc((pessoa(t.por_id) || {}).nome || '') : ''}</small></div></a>`;
          }).join('') : vazio('list', 'Nenhuma tarefa aberta')}</div></div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Peças recentes</h3><div class="r"><a class="link-btn" href="#/catalogo">Catálogo</a></div></div>
          <div class="card-b">${recentes.length ? `<div class="strip">${recentes.map(pc => `<a href="#/peca/${pc.id}">${thumb(capa(pc))}${esc(pc.ref)}</a>`).join('')}</div>` : vazio('dress', 'Nenhuma peça ainda')}</div>
        </div>
      </div>
    </div>`;
  $('#per').addEventListener('click', e => { const b = e.target.closest('[data-per]'); if (b) { pref.set('periodo', b.dataset.per); rerender(); } });
  $('#ano').addEventListener('change', e => { pref.set('ano', +e.target.value); rerender(); });
}

/* ================================================================
   DESENHO / CONSUMO
   ================================================================ */
function viewPedidos(tipo) {
  const T = TIPO[tipo];
  const f = S.f[tipo] || (S.f[tipo] = { q: '', st: 'todos', cli: '', pes: '', per: 'tudo', sala: '' });
  setPage(tipo === 'consumo' ? 'Mini consumo' : T.plural, `Pedidos de ${T.nome.toLowerCase()} e o checklist de cada um`, `<button class="btn primary" data-novo="${tipo}">${ic('plus')}<span class="tx">${T.novo}</span></button>`);
  view().innerHTML = `<div class="card">
    <div class="toolbar">
      <div class="busca">${ic('search')}<input class="inp" data-f="q" placeholder="Filtrar por REF, OP, pessoa ou observação" value="${esc(f.q)}"></div>
      <select class="inp" data-f="cli">${opClientes(f.cli, 'Todos os clientes')}</select>
      ${tipo === 'consumo' ? `<select class="inp" data-f="sala">${opcoes(salasLista().filter(x => S.db.pecas.some(p => p.sala === x)).map(x => [x, x]), f.sala || '', 'Todas as salas')}</select>` : ''}
      <select class="inp" data-f="pes">${opPessoas(f.pes, 'Todas as pessoas')}</select>
      <select class="inp" data-f="per">${opcoes(PERIODOS, f.per)}</select>
    </div>
    <div class="chips chips-row" id="st"></div>
    <div class="tbl-wrap" id="lista" style="margin-top:12px"></div>
  </div>`;
  const desenhar = () => {
    const ini = inicioPeriodo(f.per), qn = norm(f.q);
    const base = S.db.pedidos.filter(p => p.tipo === tipo).filter(p => {
      const pc = peca(p.peca_id) || {};
      if (f.cli && pc.cliente_id !== f.cli) return false;
      if (f.sala && tipo === 'consumo' && pc.sala !== f.sala) return false;
      if (f.pes && p.de_id !== f.pes && p.para_id !== f.pes) return false;
      if (ini && new Date(p.pedido_em) < ini) return false;
      if (qn && !norm([pc.ref, p.op, pc.op, (pessoa(p.de_id) || {}).nome, (pessoa(p.para_id) || {}).nome, p.obs, pc.descricao, pc.sala, (cliente(pc.cliente_id) || {}).nome].join(' ')).includes(qn)) return false;
      return true;
    });
    const pos = POS_ETAPAS[tipo];
    const posPendente = p => p.finalizado_em && pos.some(([k]) => !(p.etapas || {})[k]);
    const filtros = { todos: () => true, andamento: p => !p.finalizado_em, ok: p => !!p.finalizado_em, pos: posPendente };
    const n = Object.fromEntries(Object.entries(filtros).map(([k, fn]) => [k, base.filter(fn).length]));
    const chips = [['todos', 'Todos'], ['andamento', 'Em andamento'], ['ok', 'Finalizados']];
    if (pos.length) chips.push(['pos', `${pos.map(([, l]) => l).join(' / ')} a fazer`]);
    if (!filtros[f.st]) f.st = 'todos';
    $('#st').innerHTML = chips.map(([v, t]) => `<button class="chip${f.st === v ? ' on' : ''}" data-st="${v}">${t}<span class="n">${n[v]}</span></button>`).join('');
    const lista = base.filter(filtros[f.st]).sort((a, b) => new Date(b.pedido_em) - new Date(a.pedido_em));
    $('#lista').innerHTML = lista.length ? `<table class="tbl tbl-ped"><thead><tr>
        <th>Pedido</th><th>Referência</th><th>De</th><th>Para</th><th>Etapas</th><th>Finalizado</th>${pos.map(([, l]) => `<th>${l}</th>`).join('')}<th></th></tr></thead>
      <tbody>${lista.map(p => linhaPedido(p)).join('')}</tbody></table>`
      : vazio(T.icone, S.db.pedidos.some(p => p.tipo === tipo) ? 'Nada encontrado com esses filtros' : `Nenhum ${T.nome.toLowerCase()} cadastrado ainda`,
        '', `<button class="btn primary" data-novo="${tipo}">${ic('plus')}${T.novo}</button>`);
    hidratarFotos($('#lista'));
  };
  $$('[data-f]', view()).forEach(el => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { f[el.dataset.f] = el.value; desenhar(); }));
  $('#st').addEventListener('click', e => { const b = e.target.closest('[data-st]'); if (b) { f.st = b.dataset.st; desenhar(); } });
  desenhar();
}

function etapasHtml(p, mini = true, comPos = false) {
  return `<div class="etapas${mini ? ' mini' : ''}">${ETAPAS[p.tipo].map(([k, l]) => {
    const on = !!(p.etapas || {})[k];
    const v = (p.etapas || {})[k], nc = ehNC(v), qd = quandoEtapa(v);
    const titulo = nc ? `${l}: não cadastrado${qd ? ' (marcado ' + qd + ')' : ''} — clique para desmarcar`
      : on ? `${l}: feito${qd ? ' ' + qd : ''} — clique de novo se não foi cadastrado` : `Marcar ${l} como feito`;
    return `<button type="button" class="etp${nc ? ' nc' : on ? ' on' : ''}" data-acao="etapa" data-id="${p.id}" data-k="${k}" title="${titulo}"><span class="bx">${ic(nc ? 'x' : 'check')}</span>${l}</button>`;
  }).join('')}${comPos && POS_ETAPAS[p.tipo].length ? `<span class="etp-sep" title="Depois de finalizado"></span>${POS_ETAPAS[p.tipo].map(([k, l]) => botaoPos(p, k, l)).join('')}` : ''}</div>`;
}
function botaoPos(p, k, l, curto = false) {
  const on = !!(p.etapas || {})[k];
  return `<button type="button" class="etp pos${on ? ' on' : ''}${!on && !p.finalizado_em ? ' cedo' : ''}" data-acao="pos" data-id="${p.id}" data-k="${k}" title="${on ? `${l}: feita${quandoEtapa((p.etapas || {})[k]) ? ' ' + quandoEtapa((p.etapas || {})[k]) : ''} — clique para desmarcar` : `Marcar ${l} como feita`}"><span class="bx">${ic('check')}</span>${on ? (curto ? 'Feita' : `${l} feita`) : (curto ? 'Fazer' : l)}</button>`;
}
async function alternarPos(id, k, btn) {
  const p = byId('pedidos', id);
  if (!p) return;
  const etapas = { ...(p.etapas || {}), [k]: (p.etapas || {})[k] ? false : agoraISO() };
  btn.classList.toggle('on', etapas[k]); btn.disabled = true;
  try { await salvarReg('pedidos', { etapas }, id); rerender(); }
  catch (e) { btn.classList.toggle('on'); btn.disabled = false; toast(msgErro(e), 'erro'); }
}
function linhaPedido(p) {
  const pc = peca(p.peca_id) || { fotos: [] };
  const tot = ETAPAS[p.tipo].length, n = ETAPAS[p.tipo].filter(([k]) => (p.etapas || {})[k]).length;
  const op = p.op || pc.op;
  return `<tr>
    <td data-l="Pedido"><div class="when"><b>${fDia(p.pedido_em)}</b><small>${fHora(p.pedido_em)}</small></div></td>
    <td class="c-ref"><div class="ref">${(() => {
      const cons = p.tipo === 'consumo', cp = cons ? imgsCons(pc)[0] : capa(pc);
      return cp ? `<button type="button" class="th zoom" data-acao="fotos" data-id="${pc.id}"${cons ? ' data-cons="1"' : ''} data-foto="${esc(cp)}" title="Ver arquivos">${ic('dress')}</button>` : thumb(null);
    })()}
      <div style="min-width:0"><a href="#/peca/${pc.id}">${esc(pc.ref || '—')}</a><div class="meta">${cbadge(pc.cliente_id)}${op ? `<span>OP ${esc(op)}</span>` : ''}${p.tipo === 'consumo' && pc.sala ? `<span class="sala">${esc(pc.sala)}</span>` : ''}${(p.tipo === 'consumo' ? pdfsCons(pc) : pdfs(pc)).length ? `<span class="tag brand sem" style="height:18px;font-size:10.5px">PDF</span>` : ''}</div>
      ${pc.descricao ? `<div class="small" style="color:var(--ink);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px" title="${esc(pc.descricao)}">${esc(pc.descricao)}</div>` : ''}
      ${p.obs ? `<div class="small" style="color:var(--ink-2);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px" title="${esc(p.obs)}">${ic('note', 'i obs-ic')} ${esc(p.obs)}</div>` : ''}</div></div></td>
    <td data-l="De">${pchip(p.de_id)}</td>
    <td data-l="Para">${pchip(p.para_id)}</td>
    <td class="full" data-l="Etapas">${etapasHtml(p)}</td>
    <td class="full" data-l="Finalizado"><div class="fim">${p.finalizado_em ? `<b>${fQuando(p.finalizado_em)}</b><small>${duracao(p.pedido_em, p.finalizado_em)}</small>`
      : `<div class="prog"><i style="width:${n / tot * 100}%"></i></div><small>${n} de ${tot}</small>`}</div></td>
    ${POS_ETAPAS[p.tipo].map(([k, l]) => `<td data-l="${l}">${botaoPos(p, k, l, true)}</td>`).join('')}
    <td class="c-acts"><div class="acts"><button class="icon-btn" data-acao="editar-pedido" data-id="${p.id}" title="Editar">${ic('edit')}</button><button class="icon-btn danger" data-acao="excluir-pedido" data-id="${p.id}" title="Excluir">${ic('trash')}</button></div></td>
  </tr>`;
}

async function alternarEtapa(id, k, btn) {
  const p = byId('pedidos', id);
  if (!p) return;
  const novo = proximaEtapa((p.etapas || {})[k]);
  const etapas = { ...(p.etapas || {}), [k]: novo };
  const todas = ETAPAS[p.tipo].every(([kk]) => etapas[kk]);
  const fim = todas ? (p.finalizado_em || agoraISO()) : null;
  btn.classList.toggle('on', !!novo && !ehNC(novo)); btn.classList.toggle('nc', ehNC(novo)); btn.disabled = true;
  try {
    await salvarReg('pedidos', { etapas, finalizado_em: fim }, id);
    const nome = (ETAPAS[p.tipo].find(([kk]) => kk === k) || [])[1] || 'Etapa';
    if (ehNC(novo)) toast(`${nome} marcado como não cadastrado.`);
    if (todas && !p.finalizado_em) toast(`${TIPO[p.tipo].nome} da ${(peca(p.peca_id) || {}).ref || 'peça'} finalizado!`);
    rerender();
  } catch (e) { btn.disabled = false; toast(msgErro(e), 'erro'); rerender(); }
}

async function excluirPedido(id) {
  const p = byId('pedidos', id); if (!p) return;
  const pc = peca(p.peca_id) || {};
  if (!await confirmar(`Excluir o pedido de ${TIPO[p.tipo].nome.toLowerCase()} da <b>${esc(pc.ref)}</b> de ${fData(p.pedido_em)}? A peça e as fotos continuam no catálogo.`)) return;
  try { await excluirReg('pedidos', id); toast('Pedido excluído.'); rerender(); } catch (e) { toast(msgErro(e), 'erro'); }
}

function formPedido(tipo, pedido = null, pecaPre = null) {
  const T = TIPO[tipo];
  const p = pedido || { etapas: {} };
  let pcAtual = pedido ? peca(pedido.peca_id) : pecaPre;
  const quando = p.pedido_em || agoraISO();
  let fotos;
  modal({
    titulo: pedido ? `Editar ${T.nome.toLowerCase()}` : T.novo, tamanho: 'lg',
    corpo: `<form class="form" id="fp" autocomplete="off" novalidate>
      <div class="grid3">
        <label class="fld span2"><span>Referência *</span><input name="ref" list="dl-refs" value="${esc(pcAtual ? pcAtual.ref : '')}" placeholder="Ex.: BL115546 CeA" autofocus style="text-transform:uppercase;font-weight:600"></label>
        <label class="fld"><span>OP</span><input name="op" value="${esc(p.op || (pcAtual && !pedido ? pcAtual.op : '') || '')}" inputmode="numeric" placeholder="Ex.: 13972"></label>
        <label class="fld"><span>Cliente</span><select name="cliente">${opClientes(pcAtual ? pcAtual.cliente_id : '', '—')}</select></label>
        ${tipo === 'consumo' ? `<label class="fld"><span>Sala</span>${selSala(pcAtual ? pcAtual.sala : '')}</label>` : ''}
        <label class="fld"><span>Data do pedido</span><input type="date" name="data" value="${inData(quando)}"></label>
        <label class="fld"><span>Hora</span><input type="time" name="hora" value="${inHora(quando)}"></label>
        <label class="fld ${tipo === 'consumo' ? 'span2' : 'span3'}"><span>Descrição <span class="hint">· da peça, aparece no catálogo</span></span><input name="descricao" value="${esc((pcAtual && pcAtual.descricao) || '')}" placeholder="Ex.: colete de tricô com bolso"></label>
      </div>
      <div id="peca-info"></div>
      <div class="fld"><span class="lbl">Quem pediu (de)</span>${pickPessoas('de', p.de_id)}</div>
      <div class="fld"><span class="lbl">Para quem</span>${pickPessoas('para', p.para_id)}</div>
      <div class="fld"><span class="lbl">Etapas <span class="hint">· ${DICA_ETAPA}</span></span><div class="etapas" id="etapas-form">${ETAPAS[tipo].map(([k, l]) => { const v = (p.etapas || {})[k];
        return `<button type="button" class="etp${ehNC(v) ? ' nc' : v ? ' on' : ''}" data-et="${k}" data-v="${esc(v === true ? 'true' : v || '')}"><span class="bx">${ic(ehNC(v) ? 'x' : 'check')}</span>${l}${ehNC(v) ? '<small>não cadastrado</small>' : ''}</button>`; }).join('')}</div></div>
      <div class="grid2">
        <label class="fld"><span>Finalizado em</span><input type="datetime-local" name="fim" value="${inDT(p.finalizado_em)}"><span class="hint">Preenchido sozinho quando todas as etapas são marcadas.</span></label>
        ${POS_ETAPAS[tipo].length ? `<div class="fld"><span class="lbl">Depois de finalizado</span><div class="etapas">${POS_ETAPAS[tipo].map(([k, l]) => `<label class="etp"><input type="checkbox" name="pos_${k}"${(p.etapas || {})[k] ? ' checked' : ''}><span class="bx">${ic('check')}</span>${l}</label>`).join('')}</div></div>` : ''}
      </div>
      <label class="fld"><span>Observação <span class="hint">· deste pedido</span></span><textarea name="obs" rows="2" placeholder="Ex.: pedido de bordado">${esc(p.obs || '')}</textarea></label>
      <div class="fld"><span class="lbl">${tipo === 'consumo' ? 'Arquivos do consumo <span class="hint">· fotos ou PDFs, não aparecem no catálogo</span>' : 'Fotos e PDFs da peça <span class="hint">· aparecem no catálogo</span>'}</span><div class="fotos-edit" id="fotos"></div></div>
      <datalist id="dl-refs">${S.db.pecas.map(x => `<option value="${esc(x.ref)}">`).join('')}</datalist>
    </form>`,
    rodape: `<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fp" class="btn primary">${pedido ? 'Salvar' : 'Cadastrar'}</button>`,
    aoAbrir: m => {
      const form = m.$('#fp');
      fotos = editorFotos(m.$('#fotos'), pcAtual ? (pcAtual[campoArq(tipo)] || []) : []);
      ligarNovaPessoa(form);
      ligarSala(form);
      const fimInp = form.fim;
      const valorEt = k => { const b = form.querySelector(`[data-et="${k}"]`); return b.dataset.v === 'true' ? true : (b.dataset.v || false); };
      form.querySelector('#etapas-form').addEventListener('click', e => {
        const b = e.target.closest('[data-et]'); if (!b) return;
        const novo = proximaEtapa(valorEt(b.dataset.et));
        b.dataset.v = novo || '';
        b.className = `etp${ehNC(novo) ? ' nc' : novo ? ' on' : ''}`;
        const l = (ETAPAS[tipo].find(([kk]) => kk === b.dataset.et) || [])[1];
        b.innerHTML = `<span class="bx">${ic(ehNC(novo) ? 'x' : 'check')}</span>${l}${ehNC(novo) ? '<small>não cadastrado</small>' : ''}`;
        conferirFim();
      });
      const conferirFim = () => {
        const todas = ETAPAS[tipo].every(([k]) => valorEt(k));
        fimInp.disabled = !todas;
        if (todas && !fimInp.value) fimInp.value = inDT(agoraISO());
        if (!todas) fimInp.value = '';
      };
      form.addEventListener('change', e => { if (e.target.name && e.target.name.startsWith('et_')) conferirFim(); });
      conferirFim();
      const infoPeca = () => {
        const { ref, cliente: c } = separarSufixo(form.ref.value);
        if (c) { form.cliente.value = c.id; form.ref.value = ref; }
        const achada = S.db.pecas.find(x => x.ref === ref);
        const box = m.$('#peca-info');
        if (achada) {
          const nPed = S.db.pedidos.filter(x => x.peca_id === achada.id && x.id !== p.id).length;
          box.innerHTML = `<div class="peca-info">${thumb(capa(achada))}<div>Peça já cadastrada · ${nPed ? plural(nPed, 'outro pedido', 'outros pedidos') : 'nenhum outro pedido'}. Descrição, fotos e cliente são da peça.</div></div>`;
          hidratarFotos(box);
          if (achada !== pcAtual) {
            pcAtual = achada;
            if (achada.cliente_id) form.cliente.value = achada.cliente_id;
            if (form.sala && achada.sala) { if (![...form.sala.options].some(o => o.value === achada.sala)) form.sala.insertAdjacentHTML('afterbegin', `<option>${esc(achada.sala)}</option>`); form.sala.value = achada.sala; }
            if (!form.op.value && achada.op) form.op.value = achada.op;
            if (!form.descricao.value && achada.descricao) form.descricao.value = achada.descricao;
            fotos.trocar(achada[campoArq(tipo)] || []);
          }
        } else {
          box.innerHTML = ref ? `<div class="peca-info">${ic('info')}<div>Referência nova — a peça <b>${esc(ref)}</b> será criada no catálogo.</div></div>` : '';
          if (pcAtual && pcAtual.ref !== ref) { pcAtual = null; fotos.trocar([]); }
        }
      };
      form.ref.addEventListener('change', infoPeca);
      form.ref.addEventListener('blur', infoPeca);
      if (pcAtual) infoPeca();
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = m.$('.btn.primary');
        const fd = new FormData(form);
        const { ref, cliente: c } = separarSufixo(fd.get('ref'));
        if (!ref) { toast('Informe a referência da peça.', 'erro'); form.ref.focus(); return; }
        if (!fd.get('data')) { toast('Informe a data do pedido.', 'erro'); return; }
        ocupado(btn, true);
        try {
          const op = String(fd.get('op') || '').trim() || null;
          const cliId = fd.get('cliente') || (c && c.id) || null;
          const descricao = String(fd.get('descricao') || '').trim() || null;
          const sala = form.sala ? (String(fd.get('sala') || '').replace('__outra', '') || null) : undefined;
          let pc = S.db.pecas.find(x => x.ref === ref);
          if (!pc) pc = await salvarReg('pecas', { ref, op, cliente_id: cliId, descricao, fotos: [], detalhes: [], ...(sala ? { sala } : {}) });
          else if ((op && op !== pc.op) || cliId !== pc.cliente_id || descricao !== (pc.descricao || null) || (sala !== undefined && sala !== (pc.sala || null))) {
            pc = await salvarReg('pecas', { op: op || pc.op, cliente_id: cliId, descricao, ...(sala !== undefined ? { sala } : {}) }, pc.id);
          }
          const novas = await enviarFotos(pc.id, fotos.novas());
          const campo = campoArq(tipo);
          const rem = fotos.removidas().filter(x => (pc[campo] || []).includes(x));
          if (novas.length || rem.length) {
            pc = await salvarReg('pecas', { [campo]: (pc[campo] || []).filter(x => !rem.includes(x)).concat(novas) }, pc.id);
            if (rem.length) S.api.removerArquivos(rem).catch(() => {});
          }
          const marca = (k, on) => (on ? ((p.etapas || {})[k] || agoraISO()) : false);
          const etapas = { ...(p.etapas || {}),
            ...Object.fromEntries(ETAPAS[tipo].map(([k]) => [k, valorEt(k)])),
            ...Object.fromEntries(POS_ETAPAS[tipo].map(([k]) => [k, marca(k, !!fd.get(`pos_${k}`))])) };
          const todas = ETAPAS[tipo].every(([k]) => etapas[k]);
          const fimTxt = form.fim.value;
          const row = {
            tipo, peca_id: pc.id, op, pedido_em: juntar(fd.get('data'), fd.get('hora')),
            de_id: fd.get('de') || null, para_id: fd.get('para') || null, etapas,
            finalizado_em: todas ? (fimTxt ? new Date(fimTxt).toISOString() : agoraISO()) : null,
            obs: String(fd.get('obs') || '').trim() || null,
          };
          const antigaPeca = pedido && pedido.peca_id !== pc.id ? peca(pedido.peca_id) : null;
          await salvarReg('pedidos', row, pedido && pedido.id);
          if (antigaPeca) limparPecaOrfa(antigaPeca);
          m.fechar();
          toast(pedido ? 'Alterações salvas.' : `${T.nome} cadastrado.`);
          rerender();
        } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}
async function limparPecaOrfa(pc) {
  const usada = S.db.pedidos.some(p => p.peca_id === pc.id) || S.db.tarefas.some(t => t.peca_id === pc.id);
  if (usada || (pc.fotos || []).length || arqCons(pc).length || pc.descricao || (pc.detalhes || []).length) return;
  try { await excluirReg('pecas', pc.id); } catch (e) { /* deixa como está */ }
}

/* ================================================================
   FAZER — tarefas
   ================================================================ */
function estadoPrazo(t) {
  if (t.entregue_em) return { cor: 'green', texto: `Entregue ${fQuando(t.entregue_em)}` };
  if (!t.prazo) return { cor: 'gray', texto: 'Sem prazo' };
  const p = new Date(t.prazo), n = new Date();
  if (p < n) return { cor: 'red', texto: `Atrasada · ${fQuando(t.prazo)}` };
  if (mesmoDia(p, n)) return { cor: 'amber', texto: `Hoje às ${fHora(t.prazo)}` };
  const am = new Date(n.getTime() + 864e5);
  if (mesmoDia(p, am)) return { cor: 'blue', texto: `Amanhã às ${fHora(t.prazo)}` };
  return { cor: 'gray', texto: fQuando(t.prazo) };
}
function viewFazer() {
  const f = S.f.fazer || (S.f.fazer = { q: '', st: 'abertas', pes: '' });
  setPage('Fazer', 'Tarefas pedidas, prazos e entregas', `<button class="btn primary" data-novo="tarefa">${ic('plus')}<span class="tx">Nova tarefa</span></button>`);
  view().innerHTML = `<div class="card">
    <div class="toolbar">
      <div class="busca">${ic('search')}<input class="inp" data-f="q" placeholder="Filtrar tarefas" value="${esc(f.q)}"></div>
      <select class="inp" data-f="pes">${opPessoas(f.pes, 'Todas as pessoas')}</select>
    </div>
    <div class="chips chips-row" id="st"></div>
    <div class="tbl-wrap" id="lista" style="margin-top:12px"></div>
  </div>`;
  const desenhar = () => {
    const qn = norm(f.q), agora = new Date();
    const base = S.db.tarefas.filter(t => {
      if (f.pes && t.por_id !== f.pes && t.entregue_para_id !== f.pes) return false;
      if (qn && !norm([t.tarefa, t.obs, (peca(t.peca_id) || {}).ref, (pessoa(t.por_id) || {}).nome, (pessoa(t.entregue_para_id) || {}).nome].join(' ')).includes(qn)) return false;
      return true;
    });
    const atras = t => !t.entregue_em && t.prazo && new Date(t.prazo) < agora;
    const n = { abertas: base.filter(t => !t.entregue_em).length, atrasadas: base.filter(atras).length, entregues: base.filter(t => t.entregue_em).length, todas: base.length };
    $('#st').innerHTML = [['abertas', 'A fazer'], ['atrasadas', 'Atrasadas'], ['entregues', 'Entregues'], ['todas', 'Todas']]
      .map(([v, t]) => `<button class="chip${f.st === v ? ' on' : ''}" data-st="${v}">${v === 'atrasadas' && n.atrasadas ? '<i class="d" style="--c:var(--red)"></i>' : ''}${t}<span class="n">${n[v]}</span></button>`).join('');
    const lista = base.filter(t => f.st === 'todas' || (f.st === 'abertas' && !t.entregue_em) || (f.st === 'atrasadas' && atras(t)) || (f.st === 'entregues' && t.entregue_em))
      .sort((a, b) => {
        if (!!a.entregue_em !== !!b.entregue_em) return a.entregue_em ? 1 : -1;
        if (a.entregue_em) return new Date(b.entregue_em) - new Date(a.entregue_em);
        return (a.prazo ? new Date(a.prazo) : 9e15) - (b.prazo ? new Date(b.prazo) : 9e15) || new Date(a.pedido_em) - new Date(b.pedido_em);
      });
    $('#lista').innerHTML = lista.length ? `<table class="tbl"><thead><tr><th>Pedido</th><th>Tarefa</th><th>Por</th><th>Prazo</th><th>Entrega</th><th></th></tr></thead><tbody>${lista.map(t => {
      const st = estadoPrazo(t), pc = peca(t.peca_id);
      return `<tr>
        <td data-l="Pedido"><div class="when"><b>${fDia(t.pedido_em)}</b><small>${fHora(t.pedido_em)}</small></div></td>
        <td class="c-ref"><div class="tarefa-txt">${esc(t.tarefa)}${pc ? ` <a href="#/peca/${pc.id}" class="tag brand sem" style="text-decoration:none;height:20px;font-size:11px">${esc(pc.ref)}</a>` : ''}${t.obs ? `<small>${esc(t.obs)}</small>` : ''}</div></td>
        <td data-l="Por">${pchip(t.por_id)}</td>
        <td data-l="Prazo">${t.entregue_em ? (t.prazo ? `<span class="muted small">${fQuando(t.prazo)}</span>` : '<span class="muted">—</span>') : `<span class="tag ${st.cor}">${esc(st.texto)}</span>`}</td>
        <td class="full" data-l="Entrega">${t.entregue_em ? `<div class="entregue"><b>${fQuando(t.entregue_em)}</b>${t.entregue_para_id ? `<span>para ${pchip(t.entregue_para_id)}</span>` : ''}</div>`
          : `<button class="btn sm" data-acao="entregar" data-id="${t.id}">${ic('send')}Entregar</button>`}</td>
        <td class="c-acts"><div class="acts"><button class="icon-btn" data-acao="editar-tarefa" data-id="${t.id}" title="Editar">${ic('edit')}</button><button class="icon-btn danger" data-acao="excluir-tarefa" data-id="${t.id}" title="Excluir">${ic('trash')}</button></div></td>
      </tr>`;
    }).join('')}</tbody></table>`
      : vazio('list', f.st === 'abertas' ? 'Nenhuma tarefa a fazer' : 'Nada por aqui', '', `<button class="btn primary" data-novo="tarefa">${ic('plus')}Nova tarefa</button>`);
  };
  $$('[data-f]', view()).forEach(el => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { f[el.dataset.f] = el.value; desenhar(); }));
  $('#st').addEventListener('click', e => { const b = e.target.closest('[data-st]'); if (b) { f.st = b.dataset.st; desenhar(); } });
  desenhar();
}

function formTarefa(t = null, pecaPre = null) {
  const x = t || {};
  const quando = x.pedido_em || agoraISO();
  const pc = t ? peca(t.peca_id) : pecaPre;
  modal({
    titulo: t ? 'Editar tarefa' : 'Nova tarefa', tamanho: 'lg',
    corpo: `<form class="form" id="ft" autocomplete="off" novalidate>
      <label class="fld"><span>Tarefa *</span><textarea name="tarefa" rows="2" placeholder="O que precisa ser feito?" autofocus>${esc(x.tarefa || '')}</textarea></label>
      <div class="fld"><span class="lbl">Pedida por</span>${pickPessoas('por', x.por_id)}</div>
      <div class="grid3">
        <label class="fld"><span>Data do pedido</span><input type="date" name="data" value="${inData(quando)}"></label>
        <label class="fld"><span>Hora</span><input type="time" name="hora" value="${inHora(quando)}"></label>
        <label class="fld"><span>Referência (opcional)</span><input name="ref" list="dl-refs2" value="${esc(pc ? pc.ref : '')}" placeholder="REF da peça" style="text-transform:uppercase"></label>
        <label class="fld"><span>Prazo — dia</span><input type="date" name="pdata" value="${inData(x.prazo)}"></label>
        <label class="fld"><span>Prazo — hora</span><input type="time" name="phora" value="${x.prazo ? inHora(x.prazo) : ''}"></label>
      </div>
      <label class="fld"><span>Observação</span><input name="obs" value="${esc(x.obs || '')}" placeholder="Opcional"></label>
      ${t ? `<div class="form-sec">Entrega</div>
      <div class="grid2"><label class="fld"><span>Entregue em</span><input type="datetime-local" name="ent" value="${inDT(x.entregue_em)}"><span class="hint">Deixe vazio se ainda não foi entregue.</span></label></div>
      <div class="fld"><span class="lbl">Entregue para</span>${pickPessoas('para', x.entregue_para_id)}</div>` : ''}
      <datalist id="dl-refs2">${S.db.pecas.map(p => `<option value="${esc(p.ref)}">`).join('')}</datalist>
    </form>`,
    rodape: `<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="ft" class="btn primary">${t ? 'Salvar' : 'Adicionar'}</button>`,
    aoAbrir: m => {
      const form = m.$('#ft');
      ligarNovaPessoa(form);
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(form);
        const tarefa = String(fd.get('tarefa') || '').trim();
        if (!tarefa) { toast('Descreva a tarefa.', 'erro'); return; }
        const { ref } = separarSufixo(fd.get('ref'));
        const achada = ref ? S.db.pecas.find(p => p.ref === ref) : null;
        if (ref && !achada) { toast(`A referência ${ref} não está no catálogo. Cadastre um desenho ou consumo primeiro, ou deixe em branco.`, 'erro'); return; }
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        const row = {
          tarefa, por_id: fd.get('por') || null, pedido_em: juntar(fd.get('data') || inData(agoraISO()), fd.get('hora')),
          prazo: fd.get('pdata') ? juntar(fd.get('pdata'), fd.get('phora') || '18:00') : null,
          peca_id: achada ? achada.id : null, obs: String(fd.get('obs') || '').trim() || null,
        };
        if (t) { row.entregue_em = fd.get('ent') ? new Date(fd.get('ent')).toISOString() : null; row.entregue_para_id = row.entregue_em ? (fd.get('para') || null) : null; }
        try { await salvarReg('tarefas', row, t && t.id); m.fechar(); toast(t ? 'Tarefa salva.' : 'Tarefa adicionada.'); rerender(); }
        catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}
function entregarTarefa(t) {
  if (!t) return;
  const agora = agoraISO();
  modal({
    titulo: 'Registrar entrega', tamanho: 'sm',
    corpo: `<form class="form" id="fe"><div class="aviso">${ic('list')}<span>${esc(t.tarefa)}</span></div>
      <div class="fld"><span class="lbl">Entregue para</span>${pickPessoas('para', t.por_id)}</div>
      <div class="grid2"><label class="fld"><span>Dia</span><input type="date" name="data" value="${inData(agora)}"></label><label class="fld"><span>Hora</span><input type="time" name="hora" value="${inHora(agora)}"></label></div></form>`,
    rodape: `<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fe" class="btn primary">${ic('check')}Entregue</button>`,
    aoAbrir: m => {
      const form = m.$('#fe');
      ligarNovaPessoa(form);
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(form);
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        try { await salvarReg('tarefas', { entregue_em: juntar(fd.get('data'), fd.get('hora')), entregue_para_id: fd.get('para') || null }, t.id); m.fechar(); toast('Entrega registrada.'); rerender(); }
        catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}
async function excluirTarefa(id) {
  const t = byId('tarefas', id); if (!t) return;
  if (!await confirmar(`Excluir a tarefa “${esc(t.tarefa)}”?`)) return;
  try { await excluirReg('tarefas', id); toast('Tarefa excluída.'); rerender(); } catch (e) { toast(msgErro(e), 'erro'); }
}

/* ================================================================
   CATÁLOGO, PESQUISA e FICHA DA PEÇA
   ================================================================ */
/* tipo da peça pelo começo da referência (BL antes de B) */
const TIPOS_PECA = [
  { k: 'vestido', pre: 'V', nome: 'Vestido', plural: 'Vestidos' },
  { k: 'blusa', pre: 'BL', nome: 'Blusa', plural: 'Blusas' },
  { k: 'saia', pre: 'S', nome: 'Saia', plural: 'Saias' },
  { k: 'calca', pre: 'C', nome: 'Calça', plural: 'Calças' },
  { k: 'bermuda', pre: 'B', nome: 'Bermuda', plural: 'Bermudas' },
  { k: 'macacao', pre: 'M', nome: 'Macacão', plural: 'Macacões' },
];
function tipoPeca(ref) {
  const r = normRef(ref);
  return [...TIPOS_PECA].sort((a, b) => b.pre.length - a.pre.length)
    .find(t => r.startsWith(t.pre) && /[0-9]/.test(r.charAt(t.pre.length))) || null;
}
function cartaoPeca(pc) {
  const st = statusPeca(pc.id), ops = opsDaPeca(pc), nf = imagens(pc).length, np = pdfs(pc).length;
  return `<a class="pc" href="#/peca/${pc.id}">
    ${thumb(capa(pc), 'th', `${cbadge(pc.cliente_id)}${nf > 1 || np ? `<span class="nf">${nf > 1 ? `${ic('image')}${nf}` : ''}${np ? `${nf > 1 ? ' · ' : ''}${ic('file')}${np}` : ''}</span>` : ''}`)}
    <div class="bd"><b>${esc(pc.ref)}</b><div class="op">${tipoPeca(pc.ref) ? `${tipoPeca(pc.ref).nome} · ` : ''}${ops.length ? `OP ${esc(ops.join(' · '))}` : 'Sem OP'}</div>
      ${pc.descricao ? `<div class="desc">${esc(pc.descricao)}</div>` : ''}
      <div class="st">${tagStatus('desenho', st.desenho)}${tagStatus('consumo', st.consumo)}</div></div></a>`;
}
function viewCatalogo() {
  const f = S.f.cat || (S.f.cat = { q: '', cli: '', tipo: '', ord: 'recentes' });
  setPage('Catálogo', 'Todas as peças, com fotos e informações', `<button class="btn primary" data-novo="desenho">${ic('plus')}<span class="tx">Nova peça</span></button>`);
  view().innerHTML = `<div class="card">
    <div class="toolbar">
      <div class="busca">${ic('search')}<input class="inp" data-f="q" placeholder="Buscar por REF, OP ou descrição" value="${esc(f.q)}"></div>
      <select class="inp" data-f="ord">${opcoes([['recentes', 'Mais recentes'], ['ref', 'Referência (A–Z)'], ['antigas', 'Mais antigas']], f.ord)}</select>
    </div>
    <div class="chips chips-row tipos-peca" id="tipos"></div>
    <div class="chips chips-row" id="cli"></div>
    <div id="grade"></div>
  </div>`;
  const desenhar = () => {
    const base = (f.q.trim() ? pecasQue(f.q) : [...S.db.pecas]).filter(noCatalogo);
    const tipoK = p => (tipoPeca(p.ref) || { k: 'outros' }).k;
    const doTipo = p => !f.tipo || tipoK(p) === f.tipo;
    const doCli = p => !f.cli || p.cliente_id === f.cli;
    const porCli = base.filter(doCli), porTipo = base.filter(doTipo);
    const outros = porCli.filter(p => tipoK(p) === 'outros').length;
    $('#tipos').innerHTML = `<button class="chip${!f.tipo ? ' on' : ''}" data-tipo="">Todas as peças<span class="n">${porCli.length}</span></button>`
      + TIPOS_PECA.map(t => { const n = porCli.filter(p => tipoK(p) === t.k).length;
        return `<button class="chip${f.tipo === t.k ? ' on' : ''}${n ? '' : ' sem-itens'}" data-tipo="${t.k}">${t.plural}<span class="n">${n}</span></button>`; }).join('')
      + (outros || f.tipo === 'outros' ? `<button class="chip${f.tipo === 'outros' ? ' on' : ''}" data-tipo="outros">Outros<span class="n">${outros}</span></button>` : '');
    const cont = id => porTipo.filter(p => (p.cliente_id || '') === id).length;
    $('#cli').innerHTML = `<button class="chip${!f.cli ? ' on' : ''}" data-cli="">Todos os clientes<span class="n">${porTipo.length}</span></button>`
      + clientesOrd().map(c => `<button class="chip${f.cli === c.id ? ' on' : ''}" data-cli="${c.id}" style="--c:${esc(c.cor)}"><i class="d"></i>${esc(c.nome)}<span class="n">${cont(c.id)}</span></button>`).join('');
    let lista = base.filter(p => doCli(p) && doTipo(p));
    if (!f.q.trim() || f.ord !== 'recentes') {
      if (f.ord === 'ref') lista.sort((a, b) => a.ref.localeCompare(b.ref, 'pt-BR', { numeric: true }));
      else if (f.ord === 'antigas') lista.sort((a, b) => String(a.criado_em).localeCompare(String(b.criado_em)));
      else lista.sort((a, b) => String(b.atualizado_em).localeCompare(String(a.atualizado_em)));
    }
    $('#grade').innerHTML = lista.length ? `<div class="cat-grid">${lista.map(cartaoPeca).join('')}</div>`
      : vazio('dress', S.db.pecas.some(noCatalogo) ? 'Nenhuma peça encontrada' : 'O catálogo está vazio', S.db.pecas.some(noCatalogo) ? '' : 'As peças entram aqui sozinhas quando você cadastra um desenho.');
    hidratarFotos($('#grade'));
  };
  $$('[data-f]', view()).forEach(el => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { f[el.dataset.f] = el.value; desenhar(); }));
  $('#cli').addEventListener('click', e => { const b = e.target.closest('[data-cli]'); if (b) { f.cli = b.dataset.cli; desenhar(); } });
  $('#tipos').addEventListener('click', e => { const b = e.target.closest('[data-tipo]'); if (b) { f.tipo = b.dataset.tipo; desenhar(); } });
  desenhar();
}

function viewBusca(q) {
  setPage('Pesquisa', `Resultados para “${q}”`);
  const pcs = pecasQue(q);
  const qn = norm(q);
  const tarefas = S.db.tarefas.filter(t => norm([t.tarefa, t.obs].join(' ')).includes(qn));
  const g = $('#gbusca'); if (g) g.value = '';
  view().innerHTML = `
    <div class="card"><div class="card-h"><h3>Peças</h3><div class="r"><span class="tag gray sem">${pcs.length}</span></div></div>
      ${pcs.length ? `<div class="cat-grid">${pcs.map(cartaoPeca).join('')}</div>` : vazio('search', `Nenhuma peça com OP ou REF “${q}”`, '',
        `<button class="btn primary" data-novo="desenho">${ic('plus')}Cadastrar desenho</button>`)}</div>
    ${tarefas.length ? `<div class="card"><div class="card-h"><h3>Tarefas</h3></div><div class="card-b"><div class="lista">${tarefas.map(t => `<a class="it" href="#/fazer"><div class="t"><b>${esc(t.tarefa)}</b><small>${esc(estadoPrazo(t).texto)}</small></div></a>`).join('')}</div></div></div>` : ''}`;
  if (!pcs.length) { const b = $('[data-novo]', view()); if (b) b.addEventListener('click', () => setTimeout(() => { const r = $('#fp [name=ref]'); if (r) r.value = q.toUpperCase(); }, 30)); }
}

function viewPeca(id) {
  const pc = peca(id);
  if (!pc) { setPage('Peça não encontrada'); view().innerHTML = `<div class="card">${vazio('dress', 'Essa peça não existe mais', '', '<a class="btn" href="#/catalogo">Voltar ao catálogo</a>')}</div>`; return; }
  const c = cliente(pc.cliente_id), ops = opsDaPeca(pc), st = statusPeca(pc.id);
  setPage(pc.ref, [c ? c.nome : 'Sem cliente', ops.length ? `OP ${ops.join(', ')}` : ''].filter(Boolean).join(' · '),
    `<button class="btn" data-novo="consumo" data-peca="${pc.id}">${ic('scissors')}<span class="tx">Consumo</span></button><button class="btn primary" data-novo="desenho" data-peca="${pc.id}" style="margin-left:8px">${ic('plus')}<span class="tx">Desenho</span></button>`);
  const fotos = imagens(pc), docs = pdfs(pc);
  let sel = 0;
  const peds = S.db.pedidos.filter(p => p.peca_id === pc.id).map(p => ({ k: 'p', d: p.pedido_em, p }));
  const tars = S.db.tarefas.filter(t => t.peca_id === pc.id).map(t => ({ k: 't', d: t.pedido_em, t }));
  const hist = peds.concat(tars).sort((a, b) => new Date(b.d) - new Date(a.d));
  const resumoTipo = t => {
    const a = S.db.pedidos.filter(p => p.peca_id === pc.id && p.tipo === t).sort((x, y) => new Date(y.pedido_em) - new Date(x.pedido_em));
    if (!a.length) return '<span class="muted">—</span>';
    const ult = a[0];
    return ult.finalizado_em ? `<span style="color:var(--green)">Pronto ${fDia(ult.finalizado_em)}</span>` : '<span style="color:var(--amber)">Em andamento</span>';
  };
  view().innerHTML = `<div class="ficha">
    <div class="card galeria">
      <div class="principal th"${fotos.length ? ` data-foto="${esc(fotos[0])}"` : ''} id="principal">${ic('dress')}${fotos.length ? `<button type="button" class="aj-btn" id="aj-foto" title="Ajustar a posição e o zoom desta imagem">${ic('sliders')}Ajustar imagem</button>` : ''}</div>
      <div class="mini" id="mini">${fotos.map((f, i) => `<button type="button" class="th${i === 0 ? ' on' : ''}" data-i="${i}" data-foto="${esc(f)}" aria-label="Foto ${i + 1}">${ic('dress')}</button>`).join('')}
        <label class="add" title="Adicionar fotos ou PDFs" style="aspect-ratio:1;border-radius:9px;cursor:pointer">${ic('camera')}<input type="file" accept="image/*,application/pdf,.pdf" multiple hidden id="add-foto"></label></div>
      ${docs.length ? `<div class="docs">${docs.map(d => `<button type="button" class="doc" data-pdf="${esc(d)}"><span class="pdf-ic">PDF</span><span class="pdf-nm">${esc(nomePdf(d))}</span>${ic('external')}</button>`).join('')}</div>` : ''}
      ${arqCons(pc).length ? `<div class="cons-arqs"><div class="form-sec">Arquivos do consumo</div>
        <div class="mini">${imgsCons(pc).map((f, i) => `<button type="button" class="th" data-acao="fotos" data-cons="1" data-id="${pc.id}" data-i="${i}" data-foto="${esc(f)}" aria-label="Arquivo do consumo ${i + 1}">${ic('dress')}</button>`).join('')}</div>
        ${pdfsCons(pc).length ? `<div class="docs">${pdfsCons(pc).map(d => `<button type="button" class="doc" data-pdf="${esc(d)}"><span class="pdf-ic">PDF</span><span class="pdf-nm">${esc(nomePdf(d))}</span>${ic('external')}</button>`).join('')}</div>` : ''}</div>` : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:20px;min-width:0">
      <div class="card">
        <div class="ficha-h">
          <div class="row">${c ? `<span class="cbadge" style="--c:${esc(c.cor)}">${esc(c.nome)}</span>` : '<span class="tag gray sem">Sem cliente</span>'}${pc.sala ? `<span class="tag gray sem">Sala ${esc(pc.sala)}</span>` : ''}${tagStatus('desenho', st.desenho)}${tagStatus('consumo', st.consumo)}</div>
          <div class="ref">${esc(pc.ref)}</div>
          ${pc.descricao ? `<div style="color:var(--ink-2);font-size:15px">${esc(pc.descricao)}</div>` : ''}
          <div class="row"><button class="btn sm" id="ed-peca">${ic('edit')}Editar peça</button>${c && S.db.guia_manuais.some(m => m.cliente_id === c.id) ? `<a class="btn sm" href="#/medidas/${c.id}">${ic('ruler')}Guia de medidas</a>` : ''}<button class="btn sm" data-novo="tarefa" data-peca="${pc.id}">${ic('list')}Nova tarefa</button><a class="btn sm" href="#/ficha-tecnica/${pc.id}">${ic('file')}Ficha técnica e consumo</a><a class="btn sm" href="#/etapas/${pc.id}">${ic('flow')}Etapas · ${esc(situacaoFluxo(pc).atual ? nomeFluxo(situacaoFluxo(pc).atual) : 'concluído')}</a></div>
        </div>
        <div class="info">
          <div><small>OP</small><b>${ops.length ? esc(ops.join(', ')) : '—'}</b></div>
          <div><small>Desenho</small><b>${resumoTipo('desenho')}</b></div>
          <div><small>Consumo</small><b>${resumoTipo('consumo')}</b></div>
        </div>
      </div>
      <div class="card"><div class="card-h"><h3>Informações</h3><div class="r"><button class="link-btn" id="ed-det">Editar</button></div></div>
        <div class="card-b">${(pc.detalhes || []).length ? `<ol class="detalhes">${pc.detalhes.map(d => `<li>${esc(d)}</li>`).join('')}</ol>`
          : '<div class="muted small">Nenhuma informação ainda. Use “Editar” para anotar tecido, aviamentos, medidas importantes…</div>'}</div></div>
      <div class="card"><div class="card-h"><h3>Histórico</h3><div class="r"><span class="tag gray sem">${hist.length}</span></div></div>
        <div class="card-b"><div class="timeline">${hist.length ? hist.map(h => h.k === 'p' ? itemHistPedido(h.p) : itemHistTarefa(h.t)).join('') : '<div class="muted small">Sem pedidos ainda.</div>'}</div></div></div>
    </div>
  </div>`;
  const principal = $('#principal');
  const mostrar = i => {
    sel = i;
    principal.dataset.foto = fotos[i]; delete principal.dataset.ok;
    const velha = principal.querySelector('img.ft'); if (velha) velha.remove();
    $$('#mini [data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === i));
    hidratarFotos(principal.parentNode);
  };
  $('#mini').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) mostrar(+b.dataset.i); });
  principal.addEventListener('click', e => {
    if (e.target.closest('#aj-foto')) { ajustarFoto(pc, fotos[sel]); return; }
    if (fotos.length) lightbox(fotos, sel);
  });
  $('#add-foto').addEventListener('change', async e => {
    const files = [...e.target.files].filter(f => f.type.startsWith('image/') || ehPdfArq(f));
    if (!files.length) return;
    toast(`Enviando ${plural(files.length, 'arquivo')}…`);
    try { const novas = await enviarFotos(pc.id, files); await salvarReg('pecas', { fotos: (pc.fotos || []).concat(novas) }, pc.id); toast('Arquivos adicionados.'); rerender(); }
    catch (err) { toast(msgErro(err), 'erro'); }
  });
  $$('[data-pdf]', view()).forEach(b => { b.onclick = () => abrirArquivo(b.dataset.pdf); });
  $('#ed-peca').onclick = () => formPeca(pc);
  $('#ed-det').onclick = () => formPeca(pc);
}
function itemHistPedido(p) {
  const tot = ETAPAS[p.tipo].length, n = ETAPAS[p.tipo].filter(([k]) => (p.etapas || {})[k]).length;
  return `<div class="tl"><div class="pt${p.finalizado_em ? ' ok' : ''}">${ic(p.finalizado_em ? 'check' : TIPO[p.tipo].icone)}</div><div class="bx">
    <div class="hd"><b>${TIPO[p.tipo].nome}</b>${p.op ? `<span class="muted small">OP ${esc(p.op)}</span>` : ''}${pchip(p.de_id)}${p.para_id ? `<span class="muted">${ic('arrowR')}</span>${pchip(p.para_id)}` : ''}
      <span style="margin-left:auto;display:flex"><button class="icon-btn" data-acao="editar-pedido" data-id="${p.id}" title="Editar">${ic('edit')}</button><button class="icon-btn danger" data-acao="excluir-pedido" data-id="${p.id}" title="Excluir">${ic('trash')}</button></span></div>
    <div class="ds">Pedido ${fQuando(p.pedido_em)} · ${p.finalizado_em ? `finalizado ${fQuando(p.finalizado_em)} (${duracao(p.pedido_em, p.finalizado_em)})` : `${n} de ${tot} etapas`}${p.obs ? ` · ${esc(p.obs)}` : ''}</div>
    ${etapasHtml(p, true, true)}
    ${(() => {
      const feitas = [...ETAPAS[p.tipo], ...POS_ETAPAS[p.tipo]].filter(([k]) => (p.etapas || {})[k])
        .map(([k, l]) => ({ l, v: p.etapas[k] }))
        .sort((a, b) => isoEtapa(a.v).localeCompare(isoEtapa(b.v)));
      return feitas.length ? `<ul class="etp-tempos">${feitas.map(x => ehNC(x.v)
        ? `<li class="nc">${ic('x')}<b>${esc(x.l)}:</b><span>não cadastrado${quandoEtapa(x.v) ? ` (marcado ${quandoEtapa(x.v)})` : ''}</span></li>`
        : `<li>${ic('check')}<b>${esc(x.l)}:</b><span>${quandoEtapa(x.v) ? `feito ${quandoEtapa(x.v)}` : 'feito (antes de o sistema guardar o horário)'}</span></li>`).join('')}</ul>` : '';
    })()}</div></div>`;
}
function itemHistTarefa(t) {
  const st = estadoPrazo(t);
  return `<div class="tl"><div class="pt${t.entregue_em ? ' ok' : ''}">${ic(t.entregue_em ? 'check' : 'list')}</div><div class="bx">
    <div class="hd"><b>${esc(t.tarefa)}</b>${pchip(t.por_id)}<span style="margin-left:auto;display:flex"><button class="icon-btn" data-acao="editar-tarefa" data-id="${t.id}" title="Editar">${ic('edit')}</button></span></div>
    <div class="ds">Tarefa pedida ${fQuando(t.pedido_em)} · <span class="tag ${st.cor}" style="height:20px;font-size:11px">${esc(st.texto)}</span>${t.entregue_para_id ? ` para ${esc((pessoa(t.entregue_para_id) || {}).nome || '')}` : ''}</div></div></div>`;
}
function formPeca(pc) {
  let fotos;
  modal({
    titulo: 'Editar peça', tamanho: 'lg',
    corpo: `<form class="form" id="fpc" autocomplete="off" novalidate>
      <div class="grid3">
        <label class="fld"><span>Referência *</span><input name="ref" value="${esc(pc.ref)}" style="text-transform:uppercase;font-weight:600"></label>
        <label class="fld"><span>OP</span><input name="op" value="${esc(pc.op || '')}"></label>
        <label class="fld"><span>Cliente</span><select name="cliente">${opClientes(pc.cliente_id, '—')}</select></label>
      </div>
      <div class="grid3">
        <label class="fld span2"><span>Descrição</span><input name="descricao" value="${esc(pc.descricao || '')}" placeholder="Ex.: vestido midi com amarração"></label>
        <label class="fld"><span>Sala</span>${selSala(pc.sala || '')}</label>
      </div>
      <label class="fld"><span>Informações <span class="hint">· uma por linha (viram a lista 1, 2, 3…)</span></span><textarea name="detalhes" rows="5" placeholder="Tecido: viscose&#10;Botões forrados (8 un.)&#10;Forro somente no corpo">${esc((pc.detalhes || []).join('\n'))}</textarea></label>
      <div class="fld"><span class="lbl">Fotos e PDFs do desenho <span class="hint">· aparecem no catálogo</span></span><div class="fotos-edit" id="fotos"></div></div>
      <div class="fld"><span class="lbl">Arquivos do consumo <span class="hint">· não aparecem no catálogo</span></span><div class="fotos-edit" id="fotos-cons"></div></div>
    </form>`,
    rodape: `<button type="button" class="btn danger esq" id="del-peca">${ic('trash')}Excluir peça</button><button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fpc" class="btn primary">Salvar</button>`,
    aoAbrir: m => {
      fotos = editorFotos(m.$('#fotos'), pc.fotos || []);
      const cons = editorFotos(m.$('#fotos-cons'), arqCons(pc));
      ligarSala(m.$('#fpc'));
      m.$('#fpc').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const { ref } = separarSufixo(fd.get('ref'));
        if (!ref) { toast('Informe a referência.', 'erro'); return; }
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        try {
          const novas = await enviarFotos(pc.id, fotos.novas());
          const novasC = await enviarFotos(pc.id, cons.novas());
          const rem = fotos.removidas().concat(cons.removidas());
          await salvarReg('pecas', {
            arquivos_consumo: arqCons(pc).filter(x => !rem.includes(x)).concat(novasC),
            ref, op: String(fd.get('op') || '').trim() || null, cliente_id: fd.get('cliente') || null,
            descricao: String(fd.get('descricao') || '').trim() || null,
            sala: String(fd.get('sala') || '').replace('__outra', '') || null,
            detalhes: String(fd.get('detalhes') || '').split('\n').map(s => s.trim()).filter(Boolean),
            fotos: (pc.fotos || []).filter(x => !rem.includes(x)).concat(novas),
          }, pc.id);
          if (rem.length) S.api.removerArquivos(rem).catch(() => {});
          m.fechar(); toast('Peça salva.'); rerender();
        } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
      m.$('#del-peca').onclick = async () => {
        const n = S.db.pedidos.filter(p => p.peca_id === pc.id).length;
        if (!await confirmar(`Excluir a peça <b>${esc(pc.ref)}</b>${n ? `, os ${plural(n, 'pedido')} dela` : ''} e todas as fotos? Isso não pode ser desfeito.`)) return;
        try {
          await excluirReg('pecas', pc.id);
          const todos = (pc.fotos || []).concat(arqCons(pc));
          if (todos.length) S.api.removerArquivos(todos).catch(() => {});
          m.fechar(); toast('Peça excluída.'); location.hash = '#/catalogo';
        } catch (err) { toast(msgErro(err), 'erro'); }
      };
    },
  });
}

/* ================================================================
   MEDIDAS — arquivos por cliente
   ================================================================ */
function viewMedidas(arg) {
  const cls = clientesOrd();
  if (arg && cliente(arg)) S.f.medCli = arg;
  const comGuia = id => S.db.guia_manuais.some(m => m.cliente_id === id);
  let cli = S.f.medCli;
  if (cli === undefined || (cli && !cliente(cli))) cli = S.f.medCli = ((cls.find(x => comGuia(x.id)) || cls[0]) || {}).id || '';
  const c = cliente(cli);
  const man = S.db.guia_manuais.find(m => m.cliente_id === cli);
  setPage('Medidas', man ? `Guia de medidas da ${c.nome}: busque pelo código ou pelo nome` : 'Guias de medidas e arquivos de cada cliente',
    `<button class="btn primary" data-novo="medida" data-cliente="${esc(cli)}">${ic('plus')}<span class="tx">Arquivo</span></button>`);
  const nArq = id => S.db.medidas.filter(m => (m.cliente_id || '') === id).length;
  const arquivos = S.db.medidas.filter(m => (m.cliente_id || '') === cli).sort((a, b) => String(b.criado_em).localeCompare(String(a.criado_em)));
  view().innerHTML = `
    <div class="chips med-cli" id="cli">${cls.map(x => `<button class="chip${x.id === cli ? ' on' : ''}" data-cli="${x.id}" style="--c:${esc(x.cor)}"><i class="d"></i>${esc(x.nome)}${comGuia(x.id) ? `<span class="n" title="Tem guia de medidas">${ic('ruler')}</span>` : nArq(x.id) ? `<span class="n">${nArq(x.id)}</span>` : ''}</button>`).join('')}</div>
    ${man ? guiaHtml(man) : ''}
    <div class="card" id="arqs">
      <div class="card-h"><div><h3>${man ? 'Outros arquivos' : 'Arquivos'}${c ? ` da ${esc(c.nome)}` : ''}</h3><div class="sub">PDFs, fotos ou planilhas</div></div>
        <div class="r"><button class="btn sm" data-novo="medida" data-cliente="${esc(cli)}">${ic('plus')}Adicionar</button></div></div>
      ${arquivos.length ? `<div class="arq-grid">${arquivos.map(m => {
        const img = /^image\//.test(m.tipo_arquivo || '');
        const ext = (String(m.nome_arquivo || '').split('.').pop() || 'arq').slice(0, 4).toUpperCase();
        return `<div class="arq">
          ${img ? `<div class="th" data-foto="${esc(m.arquivo)}" data-abrir="${m.id}">${ic('image')}</div>` : `<div class="th" data-abrir="${m.id}"><span class="ext">${esc(m.arquivo ? ext : '—')}</span></div>`}
          <div class="bd"><div><b>${esc(m.titulo)}</b><small>${esc(m.nome_arquivo || 'Sem arquivo')}${m.tamanho ? ' · ' + tamanhoArq(m.tamanho) : ''} · ${fData(m.criado_em)}</small>${m.obs ? `<p>${esc(m.obs)}</p>` : ''}</div>
            <div style="display:flex">${m.arquivo ? `<button class="icon-btn" data-abrir="${m.id}" title="Abrir">${ic('external')}</button>` : ''}<button class="icon-btn" data-ed-med="${m.id}" title="Editar">${ic('edit')}</button><button class="icon-btn danger" data-del-med="${m.id}" title="Excluir">${ic('trash')}</button></div></div>
        </div>`;
      }).join('')}</div>`
        : man ? '<div class="card-b muted small" style="padding-top:4px">Nenhum outro arquivo.</div>'
        : vazio('ruler', c ? `Nenhum guia ou arquivo da ${c.nome} ainda` : 'Cadastre um cliente primeiro', c ? 'Adicione PDFs, fotos ou planilhas com as tabelas de medidas.' : '',
          c ? `<button class="btn primary" data-novo="medida" data-cliente="${c.id}">${ic('plus')}Adicionar arquivo</button>` : '<a class="btn" href="#/ajustes">Cadastrar clientes</a>')}
    </div>
    <div class="guia-imp"><button type="button" class="link-btn" id="imp-guia">${ic('download')}Importar ou atualizar os guias de medidas</button></div>`;
  $('#cli').addEventListener('click', e => { const b = e.target.closest('[data-cli]'); if (b) { S.f.medCli = b.dataset.cli; rerender(); } });
  $('#imp-guia').onclick = formImportarGuia;
  $('#arqs').addEventListener('click', async e => {
    const ab = e.target.closest('[data-abrir]'), ed = e.target.closest('[data-ed-med]'), del = e.target.closest('[data-del-med]');
    if (ab) abrirMedida(byId('medidas', ab.dataset.abrir));
    if (ed) formMedida(byId('medidas', ed.dataset.edMed));
    if (del) {
      const m = byId('medidas', del.dataset.delMed);
      if (!m || !await confirmar(`Excluir “${esc(m.titulo)}”${m.arquivo ? ' e o arquivo' : ''}?`)) return;
      try { await excluirReg('medidas', m.id); if (m.arquivo) S.api.removerArquivos([m.arquivo]).catch(() => {}); toast('Excluído.'); rerender(); }
      catch (err) { toast(msgErro(err), 'erro'); }
    }
  });
  if (man) ligarGuia(man);
}

/* ---------- guia de medidas (pontos dos manuais dos clientes) ---------- */
const estadoGuia = man => {
  const g = S.f.guia || (S.f.guia = {});
  return g[man.manual] || (g[man.manual] = { q: '', grupo: '', fav: false });
};
const pontosDo = man => S.db.guia_pontos.filter(p => p.manual === man.manual).sort((a, b) => a.ordem - b.ordem);
// manual em fichas (ex.: Havan): todos os pontos de um grupo usam a mesma imagem
const guiaEmFichas = man => {
  const pts = pontosDo(man);
  const grupos = [...new Set(pts.map(p => p.grupo))];
  return pts.length > 0 && grupos.every(g => new Set(pts.filter(p => p.grupo === g).map(p => p.imagem)).size === 1);
};
function buscarPontos(lista, q) {
  const qn = norm(q);
  if (!qn) return lista;
  const so = t => norm(t).replace(/[^a-z0-9]/g, '');
  const qc = so(qn), tok = qn.split(/\s+/).filter(Boolean);
  return lista.map(p => {
    const cods = String(p.codigo || '').split(/[/,\s]+/).map(so).filter(Boolean);
    const nome = norm(p.nome), tudo = norm([p.nome, p.como_medir, p.grupo, JSON.stringify(p.extra || {})].join(' '));
    let n = 0;
    if (qc && cods.includes(qc)) n = 100;
    else if (qc && /\d/.test(qc) && cods.some(c => c.startsWith(qc))) n = 80;
    else if (nome === qn) n = 70;
    else if (nome.startsWith(qn)) n = 60;
    else if (tok.every(t => nome.includes(t))) n = 50;
    else if (tok.every(t => tudo.includes(t))) n = 20;
    return { p, n };
  }).filter(x => x.n).sort((a, b) => (b.n - a.n) || (a.p.ordem - b.p.ordem)).map(x => x.p);
}
function guiaHtml(man) {
  const st = estadoGuia(man);
  return `<div class="card guia" id="guia">
    <div class="guia-top">
      <div class="busca guia-busca">${ic('search')}<input class="inp" id="gq" placeholder="Código ou nome da medida (ex.: 513 ou largura do decote)" value="${esc(st.q)}" autocomplete="off" spellcheck="false" aria-label="Buscar ponto de medida"></div>
      ${man.arquivo ? `<button type="button" class="btn" data-pdf-pg="">${ic('file')}<span class="tx">Manual completo</span></button>` : ''}
    </div>
    <div class="chips chips-row" id="gg"></div>
    <div class="guia-info small muted" id="gi"></div>
    <div id="gl"></div>
  </div>`;
}
function pontoHtml(p, man) {
  const ex = p.extra || {};
  const imgs = [p.imagem, ...(ex.mais_imagens || [])].filter(Boolean);
  const campos = [['Posicionamento', ex.posicionamento], ['Tipo de cota', ex.tipo_cota], ['Aplicabilidade', ex.aplicabilidade]].filter(x => x[1]);
  return `<article class="gp${p.favorito ? ' fav' : ''}">
    ${p.imagem ? `<button type="button" class="gp-img th" data-foto="${esc(p.imagem)}" data-fit="contain" data-gp-zoom="${p.id}" title="Ampliar">${ic('ruler')}</button>` : ''}
    <div class="gp-bd">
      <div class="gp-h"><span class="gp-cod">${esc(p.codigo)}</span><h4>${esc(p.nome)}</h4>
        <button type="button" class="gp-fav" data-gp-fav="${p.id}" title="${p.favorito ? 'Tirar dos favoritos' : 'Marcar como favorito'}" aria-pressed="${p.favorito}">${ic('star')}</button></div>
      <div class="gp-meta">${esc(p.grupo || '')}${ex.auxiliar ? ' · POM auxiliar' : ''}</div>
      ${p.como_medir ? `<p class="gp-como">${esc(p.como_medir)}</p>` : ''}
      ${campos.length ? `<dl class="gp-ex">${campos.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      ${(ex.observacoes || []).length ? `<ul class="gp-obs">${ex.observacoes.map(o => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
      <div class="gp-acts">${imgs.length > 1 ? `<button type="button" class="btn sm" data-gp-zoom="${p.id}">${ic('image')}Ver ${imgs.length} imagens</button>` : ''}${man.arquivo && p.pagina ? `<button type="button" class="btn sm" data-pdf-pg="${p.pagina}">${ic('external')}Ver no manual · pág. ${p.pagina}</button>` : ''}</div>
    </div>
  </article>`;
}
function desenharGuia(man) {
  const st = estadoGuia(man);
  const todos = pontosDo(man);
  const grupos = [...new Set(todos.map(p => p.grupo).filter(Boolean))];
  const nFav = todos.filter(p => p.favorito).length;
  if (st.grupo && !grupos.includes(st.grupo)) st.grupo = '';
  $('#gg').innerHTML = `<button class="chip${!st.grupo && !st.fav ? ' on' : ''}" data-gg="">Todos<span class="n">${todos.length}</span></button>`
    + `<button class="chip chip-fav${st.fav ? ' on' : ''}" data-gfav="1">${ic('star')}Favoritos<span class="n">${nFav}</span></button>`
    + grupos.map(g => `<button class="chip${st.grupo === g && !st.fav ? ' on' : ''}" data-gg="${esc(g)}">${esc(g)}<span class="n">${todos.filter(p => p.grupo === g).length}</span></button>`).join('');
  let lista = todos;
  if (st.fav) lista = lista.filter(p => p.favorito);
  else if (st.grupo) lista = lista.filter(p => p.grupo === st.grupo);
  const q = st.q.trim();
  if (q) lista = buscarPontos(lista, q);
  const fichas = guiaEmFichas(man);
  const gl = $('#gl'), gi = $('#gi');
  if (!q && !st.fav && fichas && !st.grupo) {
    gi.textContent = 'Escolha o tipo de peça para ver a ficha com os pontos de medida.';
    gl.innerHTML = `<div class="fichas">${grupos.map(g => { const pts = todos.filter(p => p.grupo === g);
      return `<button type="button" class="ficha-card" data-gg="${esc(g)}"><div class="th" data-foto="${esc(pts[0].imagem)}" data-fit="contain">${ic('ruler')}</div><b>${esc(g)}</b><small>${plural(pts.length, 'ponto')}</small></button>`; }).join('')}</div>`;
  } else if (!q && !st.fav && fichas && st.grupo) {
    const nota = lista.find(p => p.como_medir);
    gi.textContent = '';
    gl.innerHTML = `<div class="ficha-ver">
      <button type="button" class="th ficha-img" data-foto="${esc(lista[0].imagem)}" data-fit="contain" data-gp-zoom="${lista[0].id}" title="Ampliar">${ic('ruler')}</button>
      <div class="ficha-lista">${nota ? `<div class="aviso">${ic('info')}<span>${esc(nota.como_medir)}</span></div>` : ''}
        <ol>${lista.map(p => `<li class="${p.favorito ? 'fav' : ''}"><span class="gp-cod">${esc(p.codigo)}</span><span class="nm">${esc(p.nome)}</span><button type="button" class="gp-fav" data-gp-fav="${p.id}" aria-pressed="${p.favorito}" title="Favorito">${ic('star')}</button></li>`).join('')}</ol>
        ${man.arquivo ? `<button type="button" class="btn sm" data-pdf-pg="${lista[0].pagina || ''}">${ic('external')}Ver no manual · pág. ${lista[0].pagina}</button>` : ''}</div>
    </div>`;
  } else {
    gi.textContent = q ? `${plural(lista.length, 'ponto encontrado', 'pontos encontrados')} para “${q}”` : st.fav ? 'Seus pontos favoritos' : `${plural(lista.length, 'ponto')}`;
    gl.innerHTML = lista.length ? `<div class="gp-lista">${lista.map(p => pontoHtml(p, man)).join('')}</div>`
      : vazio(st.fav ? 'star' : 'search', st.fav ? 'Nenhum favorito ainda' : `Nada encontrado para “${q}”`, st.fav ? 'Toque na estrela de um ponto para ele aparecer aqui.' : 'Tente outro código ou parte do nome.');
  }
  hidratarFotos(gl);
}
function ligarGuia(man) {
  const st = estadoGuia(man);
  const card = $('#guia');
  const inp = $('#gq');
  inp.addEventListener('input', () => { st.q = inp.value; desenharGuia(man); });
  inp.addEventListener('keydown', e => { if (e.key === 'Escape') { inp.value = ''; st.q = ''; desenharGuia(man); } });
  card.addEventListener('click', async e => {
    const gg = e.target.closest('[data-gg]'), gf = e.target.closest('[data-gfav]'), fav = e.target.closest('[data-gp-fav]');
    const zoom = e.target.closest('[data-gp-zoom]'), pg = e.target.closest('[data-pdf-pg]');
    if (gg) { st.grupo = gg.dataset.gg; st.fav = false; desenharGuia(man); return; }
    if (gf) { st.fav = !st.fav; desenharGuia(man); return; }
    if (fav) {
      const p = byId('guia_pontos', fav.dataset.gpFav); if (!p) return;
      fav.disabled = true;
      try { await salvarReg('guia_pontos', { favorito: !p.favorito }, p.id); desenharGuia(man); }
      catch (err) { fav.disabled = false; toast(msgErro(err), 'erro'); }
      return;
    }
    if (zoom) { const p = byId('guia_pontos', zoom.dataset.gpZoom); if (p) lightbox([p.imagem, ...((p.extra || {}).mais_imagens || [])].filter(Boolean)); return; }
    if (pg && man.arquivo) abrirArquivo(man.arquivo, +pg.dataset.pdfPg || null);
  });
  desenharGuia(man);
  if (!matchMedia('(max-width: 640px)').matches) setTimeout(() => inp.focus(), 50);
}

/* importar a pasta "guia-medidas-importar" (guia.json + imagens + PDFs) */
function formImportarGuia() {
  if (S.api.demo) { toast('Na demonstração não dá para importar. Entre com a sua conta.', 'erro'); return; }
  let dados = null, arquivos = null;
  modal({
    titulo: 'Importar guias de medidas', tamanho: 'sm',
    corpo: `<div class="form">
      <div class="aviso">${ic('info')}<span>Escolha a pasta <b>guia-medidas-importar</b>. Os pontos de cada manual são trocados pelos da pasta; as estrelas de favorito continuam.</span></div>
      <label class="btn" style="align-self:flex-start">${ic('download')}Escolher a pasta<input type="file" id="gpasta" webkitdirectory multiple hidden></label>
      <div id="gres"></div>
    </div>`,
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="button" class="btn primary" id="gimp" disabled>Importar</button>',
    aoAbrir: m => {
      const res = m.$('#gres'), btn = m.$('#gimp');
      m.$('#gpasta').addEventListener('change', async e => {
        const mapa = {};
        [...e.target.files].forEach(f => { mapa[(f.webkitRelativePath || f.name).split('/').slice(1).join('/') || f.name] = f; });
        if (!mapa['guia.json']) { res.innerHTML = `<div class="aviso erro">${ic('alert')}<span>Essa pasta não tem o arquivo guia.json.</span></div>`; btn.disabled = true; return; }
        try { dados = JSON.parse(await mapa['guia.json'].text()); arquivos = mapa; }
        catch (err) { res.innerHTML = `<div class="aviso erro">${ic('alert')}<span>Não consegui ler o guia.json.</span></div>`; return; }
        res.innerHTML = `<ul class="imp-lista">${dados.manuais.map(mn => { const cl = acharClienteGuia(mn.cliente);
          return `<li>${cl ? ic('check') : ic('alert')}<b>${esc(mn.cliente)}</b> · ${dados.pontos.filter(p => p.manual === mn.manual).length} pontos${cl ? '' : ' · <span style="color:var(--red)">cliente não cadastrado</span>'}</li>`; }).join('')}</ul><div class="prog imp-prog hidden"><i style="width:0"></i></div><div class="small muted" id="gst"></div>`;
        btn.disabled = false;
      });
      btn.onclick = async () => {
        ocupado(btn, true, 'Importando…');
        const bar = m.$('.imp-prog'), stx = m.$('#gst');
        bar.classList.remove('hidden');
        try {
          await importarGuia(dados, arquivos, (txt, frac) => { stx.textContent = txt; bar.firstElementChild.style.width = `${Math.round(frac * 100)}%`; });
          m.fechar(); toast('Guias de medidas importados.'); rerender();
        } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); stx.textContent = ''; }
      };
    },
  });
}
const acharClienteGuia = nome => { const so = t => norm(t).replace(/[^a-z0-9]/g, ''); return S.db.clientes.find(c => so(c.nome) === so(nome)) || null; };
async function importarGuia(dados, arquivos, prog) {
  const total = dados.manuais.length;
  for (const [i, mn] of dados.manuais.entries()) {
    const cl = acharClienteGuia(mn.cliente);
    const pts = dados.pontos.filter(p => p.manual === mn.manual);
    const base = `guia/${mn.manual}/`;
    const nomeArq = r => base + String(r).split('/').pop();
    const imgs = [...new Set(pts.flatMap(p => [p.imagem, ...((p.extra || {}).mais_imagens || [])]).filter(Boolean))];
    let feitos = 0;
    const passo = () => prog(`${mn.cliente}: enviando arquivos (${feitos} de ${imgs.length + 1})`, (i + feitos / (imgs.length + 2)) / total);
    passo();
    if (mn.arquivo && arquivos[mn.arquivo]) await S.api.enviar(nomeArq(mn.arquivo), arquivos[mn.arquivo], true);
    feitos++; passo();
    const fila = imgs.slice();
    await Promise.all([0, 1, 2, 3, 4].map(async () => {
      while (fila.length) {
        const r = fila.shift();
        if (arquivos[r]) await S.api.enviar(nomeArq(r), arquivos[r], true);
        feitos++; passo();
      }
    }));
    prog(`${mn.cliente}: salvando ${pts.length} pontos`, (i + 0.95) / total);
    const favs = new Set(S.db.guia_pontos.filter(p => p.manual === mn.manual && p.favorito).map(p => p.codigo));
    await S.api.excluirOnde('guia_pontos', 'manual', mn.manual);
    const linhas = pts.map(p => {
      const ex = { ...(p.extra || {}) };
      if (ex.mais_imagens) ex.mais_imagens = ex.mais_imagens.map(nomeArq);
      return { manual: mn.manual, codigo: p.codigo, nome: p.nome, como_medir: p.como_medir || null, grupo: p.grupo || null,
        pagina: p.pagina || null, imagem: p.imagem ? nomeArq(p.imagem) : null, extra: ex, ordem: p.ordem || 0, favorito: favs.has(p.codigo) };
    });
    const novos = await S.api.inserirVarios('guia_pontos', linhas);
    S.db.guia_pontos = S.db.guia_pontos.filter(p => p.manual !== mn.manual).concat(novos);
    const atual = S.db.guia_manuais.find(x => x.manual === mn.manual);
    await salvarReg('guia_manuais', { manual: mn.manual, cliente_id: cl ? cl.id : null, titulo: mn.titulo || null,
      arquivo: mn.arquivo ? nomeArq(mn.arquivo) : null, paginas: mn.paginas || null }, atual && atual.id);
  }
  prog('Pronto!', 1);
}
async function abrirMedida(m) {
  if (!m || !m.arquivo) return;
  if (/^image\//.test(m.tipo_arquivo || '')) return lightbox([m.arquivo]);
  const w = window.open('', '_blank');
  try { const u = await S.api.urlArquivo(m.arquivo); if (w) w.location = u; else location.href = u; }
  catch (e) { if (w) w.close(); toast(msgErro(e), 'erro'); }
}
function formMedida(med = null, cliPre = null) {
  const x = med || { cliente_id: cliPre || S.f.medCli || '' };
  modal({
    titulo: med ? 'Editar medida' : 'Adicionar medida',
    corpo: `<form class="form" id="fm" novalidate>
      <div class="grid2">
        <label class="fld"><span>Cliente</span><select name="cliente">${opClientes(x.cliente_id || '')}</select></label>
        <label class="fld"><span>Título *</span><input name="titulo" value="${esc(x.titulo || '')}" placeholder="Ex.: Grade feminina 2026" autofocus></label>
      </div>
      <label class="fld"><span>Arquivo ${med && med.arquivo ? '<span class="hint">· escolha outro só se quiser trocar</span>' : ''}</span><input type="file" name="arq" accept="image/*,.pdf,.xls,.xlsx,.csv,.doc,.docx"></label>
      ${med && med.arquivo ? `<div class="peca-info">${ic('file')}<div>${esc(med.nome_arquivo)} · ${tamanhoArq(med.tamanho)}</div></div>` : ''}
      <label class="fld"><span>Observação</span><textarea name="obs" rows="2">${esc(x.obs || '')}</textarea></label>
    </form>`,
    rodape: `<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fm" class="btn primary">${med ? 'Salvar' : 'Adicionar'}</button>`,
    aoAbrir: m => m.$('#fm').addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const titulo = String(fd.get('titulo') || '').trim();
      const file = fd.get('arq');
      const temArq = file && file.size;
      if (!titulo) { toast('Informe um título.', 'erro'); return; }
      if (temArq && file.size > 15 * 1048576) { toast('Arquivo grande demais (máx. 15 MB).', 'erro'); return; }
      const btn = m.$('.btn.primary'); ocupado(btn, true, temArq ? 'Enviando…' : 'Salvando…');
      try {
        const cli = fd.get('cliente') || null;
        const row = { cliente_id: cli, titulo, obs: String(fd.get('obs') || '').trim() || null };
        if (temArq) {
          let b = file;
          if (file.type.startsWith('image/') && file.size > 2.5 * 1048576) b = await comprimir(file, 2600, 0.9);
          const path = `medidas/${cli || 'geral'}/${uid()}-${nomeSeguro(file.name)}`;
          await S.api.enviar(path, b);
          Object.assign(row, { arquivo: path, nome_arquivo: file.name, tipo_arquivo: b.type || file.type || null, tamanho: b.size });
        }
        await salvarReg('medidas', row, med && med.id);
        if (temArq && med && med.arquivo) S.api.removerArquivos([med.arquivo]).catch(() => {});
        S.f.medCli = cli || '';
        m.fechar(); toast(med ? 'Salvo.' : 'Medida adicionada.'); rerender();
      } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
    }),
  });
}

/* ================================================================
   AJUSTES — pessoas e clientes
   ================================================================ */
function viewAjustes() {
  setPage('Pessoas e clientes', 'Quem pede, para quem vai e as marcas atendidas');
  const pes = pessoasOrd(), cls = clientesOrd();
  const usoPessoa = id => S.db.pedidos.filter(p => p.de_id === id || p.para_id === id).length + S.db.tarefas.filter(t => t.por_id === id || t.entregue_para_id === id).length;
  view().innerHTML = `<div class="aj-grid">
    <div class="card"><div class="card-h"><div><h3>Pessoas</h3><div class="sub">A cor aparece nos círculos de “de” e “para”</div></div></div>
      <div class="card-b" id="pes">${pes.map(p => `<div class="aj-row${p.ativo === false ? ' inativo' : ''}" data-id="${p.id}">
        <input type="color" value="${esc(p.cor)}" data-campo="cor" title="Cor">
        <input class="inp" value="${esc(p.nome)}" data-campo="nome" maxlength="40">
        <div style="display:flex"><button class="icon-btn" data-ativo title="${p.ativo === false ? 'Mostrar nos formulários' : 'Esconder dos formulários'}">${ic(p.ativo === false ? 'eyeOff' : 'eye')}</button><button class="icon-btn danger" data-del title="Excluir">${ic('trash')}</button></div>
      </div>`).join('')}
        <form class="aj-row" id="add-pes" style="border-top:1px dashed var(--line)"><input type="color" name="cor" value="${CORES[pes.length % CORES.length]}"><input class="inp" name="nome" placeholder="Nova pessoa" maxlength="40"><button class="btn sm primary" type="submit">${ic('plus')}Adicionar</button></form>
      </div></div>
    <div class="card"><div class="card-h"><div><h3>Clientes</h3><div class="sub">A sigla é lida da referência: “BL115546 <b>CeA</b>” → C&amp;A</div></div></div>
      <div class="card-b" id="cls">${cls.map(c => `<div class="aj-row" data-id="${c.id}">
        <input type="color" value="${esc(c.cor)}" data-campo="cor" title="Cor">
        <div class="dupla"><input class="inp" value="${esc(c.nome)}" data-campo="nome" maxlength="40"><input class="inp" value="${esc(c.sigla || '')}" data-campo="sigla" placeholder="Sigla" maxlength="8"></div>
        <button class="icon-btn danger" data-del title="Excluir">${ic('trash')}</button>
      </div>`).join('')}
        <form class="aj-row" id="add-cli" style="border-top:1px dashed var(--line)"><input type="color" name="cor" value="${CORES[(cls.length + 3) % CORES.length]}"><div class="dupla"><input class="inp" name="nome" placeholder="Novo cliente" maxlength="40"><input class="inp" name="sigla" placeholder="Sigla" maxlength="8"></div><button class="btn sm primary" type="submit">${ic('plus')}</button></form>
      </div></div>
    <div class="card"><div class="card-h"><h3>Conta</h3></div><div class="card-b" style="display:flex;flex-direction:column;gap:12px">
      <div class="muted small">Conectada como <b style="color:var(--ink)">${esc(S.user.email || '')}</b>${S.api.demo ? ' (demonstração — os dados ficam só neste navegador)' : ''}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${S.api.demo ? '' : `<button class="btn sm" id="senha">${ic('key')}Trocar senha</button>`}
        <button class="btn sm" id="backup">${ic('download')}Baixar cópia dos dados</button>
      </div></div></div>
  </div>`;
  const ligarLista = (box, tab, uso) => {
    box.addEventListener('change', async e => {
      const row = e.target.closest('[data-id]'), campo = e.target.dataset.campo;
      if (!row || !campo) return;
      let v = e.target.value.trim();
      if (campo === 'nome' && !v) { toast('O nome não pode ficar vazio.', 'erro'); return; }
      if (campo === 'sigla') v = v || null;
      try { await salvarReg(tab, { [campo]: v }, row.dataset.id); toast('Salvo.'); } catch (err) { toast(msgErro(err), 'erro'); }
    });
    box.addEventListener('click', async e => {
      const row = e.target.closest('[data-id]'); if (!row) return;
      const id = row.dataset.id;
      if (e.target.closest('[data-ativo]')) {
        const p = pessoa(id);
        try { await salvarReg('pessoas', { ativo: p.ativo === false }, id); rerender(); } catch (err) { toast(msgErro(err), 'erro'); }
      }
      if (e.target.closest('[data-del]')) {
        const reg = byId(tab, id), n = uso(id);
        const msg = tab === 'pessoas'
          ? `Excluir <b>${esc(reg.nome)}</b>?${n ? ` Ela aparece em ${plural(n, 'registro')}, que vão ficar sem nome. Se quiser só tirar dos formulários, use o olho (esconder).` : ''}`
          : `Excluir o cliente <b>${esc(reg.nome)}</b>?${n ? ` ${plural(n, 'peça fica', 'peças ficam')} sem cliente e as medidas dele são apagadas.` : ''}`;
        if (!await confirmar(msg)) return;
        try { await excluirReg(tab, id); toast('Excluído.'); rerender(); } catch (err) { toast(msgErro(err), 'erro'); }
      }
    });
  };
  ligarLista($('#pes'), 'pessoas', usoPessoa);
  ligarLista($('#cls'), 'clientes', id => S.db.pecas.filter(p => p.cliente_id === id).length);
  $('#add-pes').addEventListener('submit', async e => {
    e.preventDefault(); const fd = new FormData(e.target); const nome = String(fd.get('nome')).trim();
    if (!nome) return;
    try { await salvarReg('pessoas', { nome, cor: fd.get('cor'), ativo: true }); toast('Pessoa adicionada.'); rerender(); } catch (err) { toast(msgErro(err), 'erro'); }
  });
  $('#add-cli').addEventListener('submit', async e => {
    e.preventDefault(); const fd = new FormData(e.target); const nome = String(fd.get('nome')).trim();
    if (!nome) return;
    try { await salvarReg('clientes', { nome, sigla: String(fd.get('sigla')).trim() || null, cor: fd.get('cor'), ordem: S.db.clientes.length + 1 }); toast('Cliente adicionado.'); rerender(); } catch (err) { toast(msgErro(err), 'erro'); }
  });
  const bs = $('#senha'); if (bs) bs.onclick = pedirNovaSenha;
  $('#backup').onclick = () => {
    const blob = new Blob([JSON.stringify({ exportado_em: agoraISO(), ...S.db }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `atelie-nathany-${inData(agoraISO())}.json`;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
}

/* ================================================================
   MEU PONTO — entrada, almoço, volta, saída e banco de horas
   ================================================================ */
const SLOTS = [['entrada', 'Entrada'], ['almoco', 'Almoço'], ['volta', 'Volta'], ['saida', 'Saída']];
const PARTE_DO_SLOT = { entrada: 'entrada', volta: 'almoco', saida: 'saida' };
const TIPOS_DIA = {
  normal: 'Dia de trabalho', feriado: 'Feriado / recesso', atestado: 'Atestado / falta justificada',
  ferias: 'Férias', folga: 'Folga (desconta do banco)', falta: 'Falta (desconta do banco)',
};
const DIAS_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const PONTO_PADRAO = {
  tolerancia: 0, extraSaida: true, fechamentoDia: 15, feriadosAuto: true,
  dias: {
    0: null,
    1: { e: '07:30', s: '17:30', a: 60 }, 2: { e: '07:30', s: '17:30', a: 60 },
    3: { e: '07:30', s: '17:30', a: 60 }, 4: { e: '07:30', s: '17:30', a: 60 },
    5: { e: '07:30', s: '16:30', a: 60 },
    6: null,
  },
};

const hm = t => { if (!t) return null; const [h, m] = String(t).split(':'); return (+h) * 60 + (+m); };
const fmtHM = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
function fmtDur(m) {
  m = Math.abs(Math.round(m || 0));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return `${h}h${r ? pad(r) : ''}`;
}
const fmtSaldo = m => (!m ? '0 min' : (m > 0 ? '+' : '−') + fmtDur(m));
const classeSaldo = m => (m > 0 ? 'pos' : m < 0 ? 'neg' : 'zero');
const saldoChip = m => `<span class="saldo ${classeSaldo(m)}">${fmtSaldo(m)}</span>`;
const hojeStr = () => inData(agoraISO());
const fDiaStr = s => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : '');
const dataDe = s => new Date(`${s}T12:00:00`);
const regPonto = dia => S.db.ponto.find(r => r.dia === dia) || null;
const capital = s => s.charAt(0).toUpperCase() + s.slice(1);

function cfgPonto() {
  const c = S.db.config.find(x => x.chave === 'ponto');
  const v = (c && c.valor) || {};
  return { ...PONTO_PADRAO, ...v, dias: { ...PONTO_PADRAO.dias, ...(v.dias || {}) } };
}

/* feriados nacionais (fixos + Sexta-feira Santa) */
function pascoa(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  return new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
}
const _feriados = {};
function feriadosDoAno(y) {
  if (_feriados[y]) return _feriados[y];
  const f = {};
  [[1, 1, 'Confraternização Universal'], [4, 21, 'Tiradentes'], [5, 1, 'Dia do Trabalho'], [9, 7, 'Independência do Brasil'],
    [10, 12, 'Nossa Senhora Aparecida'], [11, 2, 'Finados'], [11, 15, 'Proclamação da República'], [11, 20, 'Consciência Negra'], [12, 25, 'Natal']]
    .forEach(([m, d, n]) => { f[`${y}-${pad(m)}-${pad(d)}`] = n; });
  const p = pascoa(y);
  f[inData(new Date(y, p.getMonth(), p.getDate() - 2))] = 'Sexta-feira Santa';
  return (_feriados[y] = f);
}
const feriadoDe = (dia, cfg = cfgPonto()) => (cfg.feriadosAuto ? feriadosDoAno(+dia.slice(0, 4))[dia] || null : null);

/* cálculo de um dia: cada parte é + (crédito) ou − (débito) em minutos */
function calcDia(dia, reg, cfg = cfgPonto()) {
  const dow = dataDe(dia).getDay();
  const fer = feriadoDe(dia, cfg);
  const j = fer ? null : cfg.dias[dow];
  const r = reg || {};
  const tipo = r.tipo || 'normal';
  const esperado = j ? hm(j.s) - hm(j.e) - (+j.a || 0) : 0;
  const ajuste = +r.ajuste_min || 0;
  const res = { dia, dow, fer, j, tipo, esperado, partes: [], saldo: 0, trabalhado: null, conta: !!reg };
  const e = hm(r.entrada), a = hm(r.almoco), v = hm(r.volta), s = hm(r.saida);
  if (e != null && s != null) res.trabalhado = (s - e) - (a != null && v != null ? v - a : (j ? +j.a || 0 : 0));
  if (['feriado', 'atestado', 'ferias'].includes(tipo)) {
    if (ajuste) res.partes.push({ k: 'ajuste', min: ajuste });
  } else if (['falta', 'folga'].includes(tipo)) {
    res.partes.push({ k: 'falta', min: -esperado });
    if (ajuste) res.partes.push({ k: 'ajuste', min: ajuste });
  } else {
    const tol = +cfg.tolerancia || 0;
    const t = x => (Math.abs(x) <= tol ? 0 : x);
    if (!j) {
      if (res.trabalhado != null && res.trabalhado > 0) res.partes.push({ k: 'extra', min: res.trabalhado });
    } else {
      if (e != null) res.partes.push({ k: 'entrada', min: t(hm(j.e) - e) });
      if (a != null && v != null) res.partes.push({ k: 'almoco', min: t((+j.a || 0) - (v - a)) });
      if (s != null) { let d = t(s - hm(j.s)); if (d > 0 && !cfg.extraSaida) d = 0; res.partes.push({ k: 'saida', min: d }); }
    }
    if (ajuste) res.partes.push({ k: 'ajuste', min: ajuste });
  }
  res.saldo = res.partes.reduce((x, p) => x + p.min, 0);
  return res;
}
function textoParte(p) {
  const d = fmtDur(p.min);
  switch (p.k) {
    case 'entrada': return p.min < 0 ? `chegou ${d} atrasada` : p.min > 0 ? `chegou ${d} antes` : 'chegou no horário';
    case 'almoco': return p.min < 0 ? `almoço ${d} a mais` : p.min > 0 ? `almoço ${d} a menos` : 'almoço no tempo certo';
    case 'saida': return p.min < 0 ? `saiu ${d} mais cedo` : p.min > 0 ? `saiu ${d} depois` : 'saiu no horário';
    case 'extra': return `${d} trabalhados fora da jornada`;
    case 'falta': return `${d} descontados do banco`;
    case 'ajuste': return `ajuste de ${fmtSaldo(p.min)}`;
    default: return '';
  }
}
const explicaDia = c => c.partes.filter(p => p.min).map(textoParte).join(' · ');

/* período de assinatura: do dia (fechamento+1) de um mês até o dia do fechamento do mês seguinte */
function periodoDe(dia, cfg = cfgPonto()) {
  const F = Math.min(28, Math.max(1, +cfg.fechamentoDia || 15));
  const d = dataDe(dia);
  let fim = new Date(d.getFullYear(), d.getMonth(), F);
  if (d.getDate() > F) fim = new Date(d.getFullYear(), d.getMonth() + 1, F);
  const ini = new Date(fim.getFullYear(), fim.getMonth() - 1, F + 1);
  return { ini: inData(ini), fim: inData(fim) };
}
const fechamentosOrd = () => [...S.db.ponto_fechamentos].sort((a, b) => a.ate.localeCompare(b.ate));
function saldoAte(ate, cfg = cfgPonto()) {
  const zera = fechamentosOrd().filter(f => f.zera && f.ate < ate).pop();
  const desde = zera ? zera.ate : '';
  return S.db.ponto.reduce((t, r) => (r.dia > desde && r.dia <= ate ? t + calcDia(r.dia, r, cfg).saldo : t), 0);
}
function resumoPonto() {
  const cfg = cfgPonto(), hoje = hojeStr(), per = periodoDe(hoje, cfg);
  const zera = fechamentosOrd().filter(f => f.zera && f.ate < hoje).pop();
  const desde = zera ? zera.ate : '';
  const R = { banco: 0, perSaldo: 0, atrasos: 0, atrasoMin: 0, dias: 0, per, zera };
  S.db.ponto.forEach(r => {
    if (r.dia > hoje) return;
    const c = calcDia(r.dia, r, cfg);
    if (r.dia > desde) R.banco += c.saldo;
    if (r.dia >= per.ini && r.dia <= per.fim) {
      R.perSaldo += c.saldo;
      if (r.tipo === 'normal' && (r.entrada || r.saida)) R.dias++;
      const en = c.partes.find(p => p.k === 'entrada');
      if (en && en.min < 0) { R.atrasos++; R.atrasoMin += -en.min; }
    }
  });
  return R;
}

/* cartão "Hoje" (Início e Meu ponto) */
function htmlHoje() {
  const dia = hojeStr(), r = regPonto(dia), c = calcDia(dia, r);
  const prox = SLOTS.find(([k]) => !(r && r[k]));
  const agora = inHora(agoraISO());
  const especial = r && r.tipo !== 'normal' ? TIPOS_DIA[r.tipo] : c.fer ? `Feriado · ${c.fer}` : !c.j ? 'Hoje não é dia de jornada — o que trabalhar entra como crédito.' : '';
  const expl = explicaDia(c);
  const previsto = k => (!c.j ? '' : k === 'entrada' ? `previsto ${c.j.e}` : k === 'saida' ? `previsto ${c.j.s}` : k === 'volta' ? `almoço de ${fmtDur(c.j.a)}` : '');
  return `<div class="hoje-h"><div><small>Hoje</small><b>${capital(hojeExtenso())}</b></div><div class="relogio" data-relogio>${agora}</div></div>
    ${especial ? `<div class="aviso">${ic('info')}<span>${esc(especial)}</span></div>` : ''}
    <div class="batidas">${SLOTS.map(([k, l]) => {
      const v = r && r[k], p = PARTE_DO_SLOT[k] && c.partes.find(x => x.k === PARTE_DO_SLOT[k]);
      return `<button type="button" class="bat${v ? ' ok' : ''}${prox && prox[0] === k ? ' prox' : ''}" data-dia="${dia}" title="Editar o ponto de hoje">
        <small>${l}</small><b>${v || '--:--'}</b><em class="${p ? classeSaldo(p.min) : ''}">${p && p.min ? fmtSaldo(p.min) : previsto(k) || '&nbsp;'}</em></button>`;
    }).join('')}</div>
    ${prox ? `<button type="button" class="btn primary block grande" data-bater="${prox[0]}">${ic('clock')}Registrar ${prox[1].toLowerCase()} agora · <span data-relogio>${agora}</span></button>`
      : `<div class="aviso">${ic('check')}<span>Dia completo · saldo de hoje <b>${fmtSaldo(c.saldo)}</b></span></div>`}
    ${expl ? `<div class="hoje-msg ${classeSaldo(c.saldo)}">${esc(capital(expl))}</div>` : ''}`;
}

async function baterPonto(slot, btn) {
  const dia = hojeStr(), reg = regPonto(dia), hora = inHora(agoraISO());
  const nome = (SLOTS.find(([k]) => k === slot) || [])[1] || 'Ponto';
  if (btn) ocupado(btn, true, 'Registrando…');
  try {
    await salvarReg('ponto', reg ? { [slot]: hora } : { dia, tipo: 'normal', ajuste_min: 0, [slot]: hora }, reg && reg.id);
    const c = calcDia(dia, regPonto(dia));
    const p = PARTE_DO_SLOT[slot] && c.partes.find(x => x.k === PARTE_DO_SLOT[slot]);
    toast(`${nome} às ${hora}${p ? ' · ' + textoParte(p) : ''}`);
    rerender();
  } catch (e) { if (btn) ocupado(btn, false); toast(msgErro(e), 'erro'); }
}

function viewPonto() {
  const cfg = cfgPonto();
  const n = new Date();
  const f = S.f.ponto || (S.f.ponto = { ano: n.getFullYear(), mes: n.getMonth() });
  const R = resumoPonto();
  setPage('Meu ponto', 'Seus horários e o banco de horas',
    `<button class="btn" id="jornada">${ic('sliders')}<span class="tx">Minha jornada</span></button><button class="btn primary" id="assinar" style="margin-left:8px">${ic('check')}<span class="tx">Assinar ponto</span></button>`);

  const hoje = hojeStr();
  const ult = new Date(f.ano, f.mes + 1, 0).getDate();
  const regs = {}; S.db.ponto.forEach(r => { regs[r.dia] = r; });
  const fechs = {}; S.db.ponto_fechamentos.forEach(x => { (fechs[x.ate] || (fechs[x.ate] = [])).push(x); });
  let somaMes = 0, atrasosMes = 0, minAtrasoMes = 0;
  const linhas = [];
  for (let d = ult; d >= 1; d--) {
    const dia = `${f.ano}-${pad(f.mes + 1)}-${pad(d)}`;
    (fechs[dia] || []).forEach(x => linhas.push(linhaFechamento(x, cfg)));
    if (dia > hoje && !regs[dia]) continue;
    const r = regs[dia], c = calcDia(dia, r, cfg);
    if (!r && !c.j && !c.fer) continue; // fim de semana sem registro
    if (r) {
      somaMes += c.saldo;
      const en = c.partes.find(p => p.k === 'entrada');
      if (en && en.min < 0) { atrasosMes++; minAtrasoMes += -en.min; }
    }
    linhas.push(linhaPonto(dia, r, c, hoje));
  }
  const mesNome = `${capital(MESES_LONGO[f.mes])} ${f.ano}`;
  const ehAtual = f.ano === n.getFullYear() && f.mes === n.getMonth();
  const grupos = [];
  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    const j = cfg.dias[d]; if (!j) return;
    const txt = `${j.e}–${j.s}`, g = grupos[grupos.length - 1];
    if (g && g.txt === txt && g.ult === (d === 0 ? 6 : d - 1)) { g.ult = d; } else grupos.push({ ini: d, ult: d, txt });
  });
  const previstoTxt = grupos.map(g => `${DIAS_CURTO[g.ini]}${g.ult !== g.ini ? ` a ${DIAS_CURTO[g.ult]}` : ''} ${g.txt}`).join(' · ');

  view().innerHTML = `
    <div class="ponto-top">
      <div class="card hoje">${htmlHoje()}</div>
      <div class="kpis kpis2">
        <div class="card kpi"><div class="ic ${R.banco < 0 ? 'red' : 'green'}">${ic('clock')}</div><div><div class="lb">Banco de horas</div><div class="vl num ${classeSaldo(R.banco)}">${fmtSaldo(R.banco)}</div><div class="ds">${R.zera ? `desde a assinatura de ${fDiaStr(R.zera.ate)}` : 'somando todos os dias registrados'}</div></div></div>
        <div class="card kpi"><div class="ic">${ic('calendar')}</div><div><div class="lb">Período ${fDiaStr(R.per.ini)} a ${fDiaStr(R.per.fim)}</div><div class="vl num ${classeSaldo(R.perSaldo)}">${fmtSaldo(R.perSaldo)}</div><div class="ds">assinatura do ponto em ${fDiaStr(R.per.fim)}</div></div></div>
        <div class="card kpi"><div class="ic ${R.atrasos ? 'red' : 'green'}">${ic('alert')}</div><div><div class="lb">Atrasos no período</div><div class="vl num">${R.atrasos}</div><div class="ds">${R.atrasos ? `${fmtDur(R.atrasoMin)} no total` : 'nenhum atraso'}</div></div></div>
        <div class="card kpi"><div class="ic gold">${ic('check')}</div><div><div class="lb">Dias trabalhados</div><div class="vl num">${R.dias}</div><div class="ds">no período atual</div></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-h ponto-h">
        <div class="mes-nav"><button class="icon-btn" data-mes="-1" aria-label="Mês anterior">${ic('chevL')}</button><b>${mesNome}</b><button class="icon-btn" data-mes="1" aria-label="Próximo mês"${ehAtual ? ' disabled' : ''}>${ic('chevR')}</button>${ehAtual ? '' : '<button class="chip" data-mes="0">Mês atual</button>'}</div>
        <div class="r"><span class="muted small">Saldo do mês</span>${saldoChip(somaMes)}${atrasosMes ? `<span class="tag red">${plural(atrasosMes, 'atraso')} · ${fmtDur(minAtrasoMes)}</span>` : ''}
          <button class="btn sm" id="csv" title="Baixar o mês em planilha (abre no Excel)">${ic('download')}<span class="tx">Planilha</span></button></div>
      </div>
      <div class="tbl-wrap">${linhas.length ? `<table class="tbl tbl-ponto"><thead><tr><th>Data</th><th>Entrada</th><th>Almoço</th><th>Volta</th><th>Saída</th><th>Saldo</th><th>Observações</th><th></th></tr></thead><tbody>${linhas.join('')}</tbody></table>`
        : vazio('clock', 'Nenhum registro neste mês', 'Use o botão “Registrar entrada agora” quando chegar.')}</div>
      <div class="legenda-ponto"><span>${ic('info')}Previsto: ${esc(previstoTxt)} · almoço ${fmtDur((cfg.dias[1] || {}).a || 60)}${cfg.tolerancia ? ` · tolerância ${cfg.tolerancia} min` : ' · cada minuto conta'}</span><button class="link-btn" data-jornada>Alterar</button></div>
    </div>`;

  $('.ponto-h', view()).addEventListener('click', e => {
    const b = e.target.closest('[data-mes]'); if (!b || b.disabled) return;
    const k = +b.dataset.mes;
    if (k === 0) { f.ano = n.getFullYear(); f.mes = n.getMonth(); }
    else { const d = new Date(f.ano, f.mes + k, 1); f.ano = d.getFullYear(); f.mes = d.getMonth(); }
    rerender();
  });
  $('#jornada').onclick = formJornada;
  $('[data-jornada]', view()).onclick = formJornada;
  $('#assinar').onclick = formAssinar;
  $('#csv').onclick = () => baixarPontoCsv(f.ano, f.mes);
  $$('[data-del-fech]', view()).forEach(b => b.addEventListener('click', async ev => {
    ev.stopPropagation();
    const x = byId('ponto_fechamentos', b.dataset.delFech);
    if (!x || !await confirmar(`Apagar a assinatura do ponto até ${fDiaStr(x.ate)}?${x.zera ? ' O banco de horas volta a somar os dias anteriores.' : ''}`)) return;
    try { await excluirReg('ponto_fechamentos', x.id); toast('Assinatura apagada.'); rerender(); } catch (err) { toast(msgErro(err), 'erro'); }
  }));
}

function linhaPonto(dia, r, c, hoje) {
  const d = dataDe(dia);
  const dataTd = `<td class="c-ref" data-l="Data"><div class="when"><b>${pad(d.getDate())}/${pad(d.getMonth() + 1)}</b><small>${DIAS_CURTO[c.dow]}${dia === hoje ? ' · hoje' : ''}</small></div></td>`;
  const acts = `<td class="c-acts"><div class="acts"><button class="icon-btn" data-dia="${dia}" title="Editar">${ic('edit')}</button></div></td>`;
  const especial = r && r.tipo !== 'normal' ? TIPOS_DIA[r.tipo] : (!r && c.fer) ? 'Feriado' : null;
  if (especial) {
    return `<tr class="esp">${dataTd}<td colspan="6" class="full"><div class="esp-in"><span class="tag sem roxo">${esc(especial)}</span>${c.fer ? `<span>${esc(c.fer)}</span>` : ''}${r && r.obs ? `<span>${esc(r.obs)}</span>` : ''}${c.saldo ? saldoChip(c.saldo) : ''}</div></td>${acts}</tr>`;
  }
  if (!r) return `<tr class="vaz">${dataTd}<td colspan="6" class="full"><span class="muted small">Sem registro</span> <button class="link-btn" data-dia="${dia}">Registrar</button></td>${acts}</tr>`;
  const P = k => c.partes.find(p => p.k === k);
  const cls = p => (p ? classeSaldo(p.min) : '');
  const expl = explicaDia(c);
  return `<tr class="${dia === hoje ? 'hoje-row' : ''}">${dataTd}
    <td data-l="Entrada" class="hr ${cls(P('entrada'))}">${esc(r.entrada || '—')}</td>
    <td data-l="Almoço" class="hr">${esc(r.almoco || '—')}</td>
    <td data-l="Volta" class="hr ${cls(P('almoco'))}">${esc(r.volta || '—')}</td>
    <td data-l="Saída" class="hr ${cls(P('saida'))}">${esc(r.saida || '—')}</td>
    <td data-l="Saldo">${saldoChip(c.saldo)}</td>
    <td class="full" data-l="Observações"><div class="explica">${expl ? esc(capital(expl)) : '<span class="muted">Tudo no horário</span>'}${r.obs ? `<div class="obs">${ic('note')}${esc(r.obs)}</div>` : ''}</div></td>
    ${acts}</tr>`;
}
function linhaFechamento(x, cfg) {
  return `<tr class="fech"><td colspan="8"><div class="fech-in">${ic('check')}<span>Ponto assinado até <b>${fDiaStr(x.ate)}</b> · saldo <b>${fmtSaldo(saldoAte(x.ate, cfg))}</b>${x.zera ? ' · banco zerado depois disso' : ''}${x.obs ? ` · ${esc(x.obs)}` : ''}</span><button class="icon-btn danger" data-del-fech="${x.id}" title="Apagar assinatura">${ic('trash')}</button></div></td></tr>`;
}

function formPonto(dia) {
  const r = regPonto(dia) || {};
  const d = dataDe(dia);
  modal({
    titulo: `${capital(DIAS[d.getDay()])}, ${fDiaStr(dia)}`,
    corpo: `<form class="form" id="fpt" novalidate>
      <label class="fld"><span>Tipo do dia</span><select name="tipo">${opcoes(Object.entries(TIPOS_DIA), r.tipo || 'normal')}</select></label>
      <div class="grid2 horas">${SLOTS.map(([k, l]) => `<label class="fld"><span>${l}</span><div class="hora-ag"><input type="time" name="${k}" value="${esc(r[k] || '')}"><button type="button" class="btn sm" data-agora="${k}" title="Usar a hora de agora">${ic('clock')}Agora</button></div></label>`).join('')}</div>
      <div class="grid2">
        <label class="fld"><span>Ajuste manual (minutos)</span><input type="number" name="ajuste" step="1" value="${+r.ajuste_min || 0}"><span class="hint">Positivo soma ao banco, negativo desconta.</span></label>
        <label class="fld"><span>Observação</span><input name="obs" value="${esc(r.obs || '')}" placeholder="Ex.: saída mais cedo (aniversário)"></label>
      </div>
      <div id="prev"></div>
    </form>`,
    rodape: `${r.id ? `<button type="button" class="btn danger esq" id="del-pt">${ic('trash')}Apagar dia</button>` : ''}<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fpt" class="btn primary">Salvar</button>`,
    aoAbrir: m => {
      const form = m.$('#fpt');
      const ler = () => {
        const fd = new FormData(form);
        return {
          dia, tipo: fd.get('tipo') || 'normal',
          entrada: fd.get('entrada') || null, almoco: fd.get('almoco') || null, volta: fd.get('volta') || null, saida: fd.get('saida') || null,
          ajuste_min: parseInt(fd.get('ajuste'), 10) || 0, obs: String(fd.get('obs') || '').trim() || null,
        };
      };
      const prev = () => {
        const x = ler(), c = calcDia(dia, x), expl = explicaDia(c);
        const ordem = [x.entrada, x.almoco, x.volta, x.saida].filter(Boolean).map(hm);
        const fora = ordem.some((v, i) => i && v < ordem[i - 1]);
        m.$('#prev').innerHTML = `<div class="aviso${fora ? ' erro' : ''}">${ic(fora ? 'alert' : 'clock')}<span>${fora ? 'Confira os horários: estão fora de ordem.<br>' : ''}${c.j ? `Previsto ${c.j.e} às ${c.j.s}, almoço de ${fmtDur(+c.j.a)}` : c.fer ? `Feriado · ${esc(c.fer)}` : 'Dia fora da jornada'}${c.trabalhado != null ? ` · trabalhado ${fmtDur(c.trabalhado)}` : ''}<br><b>Saldo do dia: ${fmtSaldo(c.saldo)}</b>${expl ? ` — ${esc(expl)}` : ''}</span></div>`;
      };
      form.addEventListener('input', prev);
      form.addEventListener('change', prev);
      form.addEventListener('click', e => { const b = e.target.closest('[data-agora]'); if (b) { form.querySelector(`[name="${b.dataset.agora}"]`).value = inHora(agoraISO()); prev(); } });
      prev();
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const x = ler();
        const vazio = x.tipo === 'normal' && !x.entrada && !x.almoco && !x.volta && !x.saida && !x.ajuste_min && !x.obs;
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        try {
          if (vazio) { if (r.id) await excluirReg('ponto', r.id); }
          else await salvarReg('ponto', x, r.id);
          m.fechar(); toast('Ponto salvo.'); rerender();
        } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
      const del = m.$('#del-pt');
      if (del) del.onclick = async () => {
        if (!await confirmar(`Apagar o ponto de ${fDiaStr(dia)}?`)) return;
        try { await excluirReg('ponto', r.id); m.fechar(); toast('Dia apagado.'); rerender(); } catch (err) { toast(msgErro(err), 'erro'); }
      };
    },
  });
}

function formJornada() {
  const cfg = cfgPonto();
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  modal({
    titulo: 'Minha jornada', tamanho: 'lg',
    corpo: `<form class="form" id="fj" novalidate>
      <div class="aviso">${ic('info')}<span>Esses horários são a base da conta: chegar depois da entrada desconta, almoço maior que o previsto desconta, sair antes desconta e sair depois soma (se marcado abaixo).</span></div>
      <div class="jornada">
        <div class="jr cab"><span>Dia</span><span>Trabalha</span><span>Entrada</span><span>Saída</span><span>Almoço (min)</span></div>
        ${ordem.map(d => { const j = cfg.dias[d]; return `<div class="jr"><b>${capital(DIAS[d])}</b>
          <label class="sw" title="Trabalha nesse dia"><input type="checkbox" name="t${d}"${j ? ' checked' : ''}><i></i></label>
          <input class="inp" type="time" name="e${d}" value="${j ? j.e : '07:30'}"${j ? '' : ' disabled'} aria-label="Entrada">
          <input class="inp" type="time" name="s${d}" value="${j ? j.s : '12:00'}"${j ? '' : ' disabled'} aria-label="Saída">
          <input class="inp" type="number" min="0" step="5" name="a${d}" value="${j ? j.a : 0}"${j ? '' : ' disabled'} aria-label="Almoço em minutos"></div>`; }).join('')}
      </div>
      <div class="grid2">
        <label class="fld"><span>Tolerância (minutos)</span><input type="number" min="0" max="30" name="tol" value="${+cfg.tolerancia || 0}"><span class="hint">Diferenças até esse valor não contam. Com 0, cada minuto conta.</span></label>
        <label class="fld"><span>Dia da assinatura do ponto</span><input type="number" min="1" max="28" name="fech" value="${+cfg.fechamentoDia || 15}"><span class="hint">O período vai do dia seguinte num mês até esse dia no outro.</span></label>
      </div>
      <label class="check"><input type="checkbox" name="extra"${cfg.extraSaida ? ' checked' : ''}><span>Quando eu sair depois do horário, somar no banco de horas</span></label>
      <label class="check"><input type="checkbox" name="fer"${cfg.feriadosAuto ? ' checked' : ''}><span>Marcar os feriados nacionais automaticamente</span></label>
    </form>`,
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fj" class="btn primary">Salvar jornada</button>',
    aoAbrir: m => {
      const form = m.$('#fj');
      form.addEventListener('change', e => {
        const row = e.target.closest('.jr'); if (!row || !/^t\d$/.test(e.target.name)) return;
        $$('input:not([type=checkbox])', row).forEach(i => { i.disabled = !e.target.checked; });
      });
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(form);
        const dias = {};
        for (const d of ordem) {
          if (!fd.get(`t${d}`)) { dias[d] = null; continue; }
          const ent = fd.get(`e${d}`), sai = fd.get(`s${d}`), alm = parseInt(fd.get(`a${d}`), 10) || 0;
          if (!ent || !sai || hm(sai) - hm(ent) <= alm) { toast(`Confira os horários de ${DIAS[d]}.`, 'erro'); return; }
          dias[d] = { e: ent, s: sai, a: alm };
        }
        const valor = {
          dias, tolerancia: Math.max(0, parseInt(fd.get('tol'), 10) || 0),
          fechamentoDia: Math.min(28, Math.max(1, parseInt(fd.get('fech'), 10) || 15)),
          extraSaida: !!fd.get('extra'), feriadosAuto: !!fd.get('fer'),
        };
        const atual = S.db.config.find(x => x.chave === 'ponto');
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        try { await salvarReg('config', atual ? { valor } : { chave: 'ponto', valor }, atual && atual.id); m.fechar(); toast('Jornada salva. Os saldos foram recalculados.'); rerender(); }
        catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}

function formAssinar() {
  const cfg = cfgPonto(), hoje = hojeStr();
  let ate = periodoDe(hoje, cfg).fim;
  if (ate > hoje) { const d = dataDe(periodoDe(hoje, cfg).ini); d.setDate(d.getDate() - 1); ate = inData(d); }
  modal({
    titulo: 'Assinar ponto', tamanho: 'sm',
    corpo: `<form class="form" id="fa" novalidate>
      <label class="fld"><span>Assinado até</span><input type="date" name="ate" value="${ate}" max="${hoje}"></label>
      <div id="saldo-ass"></div>
      <label class="fld"><span>Observação</span><input name="obs" placeholder="Opcional"></label>
      <label class="check"><input type="checkbox" name="zera"><span>Zerar o banco de horas depois desta data</span></label>
    </form>`,
    rodape: `<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fa" class="btn primary">${ic('check')}Assinar</button>`,
    aoAbrir: m => {
      const form = m.$('#fa');
      const mostra = () => { const a = form.querySelector('[name=ate]').value; m.$('#saldo-ass').innerHTML = a ? `<div class="aviso">${ic('clock')}<span>Saldo do banco até ${fDiaStr(a)}: <b>${fmtSaldo(saldoAte(a, cfg))}</b></span></div>` : ''; };
      form.addEventListener('input', mostra); mostra();
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(form), a = fd.get('ate');
        if (!a) { toast('Escolha a data.', 'erro'); return; }
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        try {
          await salvarReg('ponto_fechamentos', { ate: a, saldo_min: saldoAte(a, cfg), zera: !!fd.get('zera'), obs: String(fd.get('obs') || '').trim() || null });
          m.fechar(); toast(`Ponto assinado até ${fDiaStr(a)}.`); rerender();
        } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}

function baixarPontoCsv(ano, mes) {
  const cfg = cfgPonto(), ult = new Date(ano, mes + 1, 0).getDate();
  const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const linhas = [['Data', 'Dia', 'Entrada', 'Almoço', 'Volta', 'Saída', 'Trabalhado', 'Saldo (min)', 'Saldo', 'Tipo', 'Detalhes', 'Observação']];
  for (let d = 1; d <= ult; d++) {
    const dia = `${ano}-${pad(mes + 1)}-${pad(d)}`, r = regPonto(dia), c = calcDia(dia, r, cfg);
    if (!r && !c.fer) continue;
    linhas.push([`${pad(d)}/${pad(mes + 1)}/${ano}`, DIAS_CURTO[c.dow], r && r.entrada, r && r.almoco, r && r.volta, r && r.saida,
      c.trabalhado != null ? fmtHM(Math.max(0, c.trabalhado)) : '', r ? c.saldo : '', r ? fmtSaldo(c.saldo) : '',
      r ? TIPOS_DIA[r.tipo] : `Feriado · ${c.fer}`, explicaDia(c), r && r.obs]);
  }
  const csv = '﻿' + linhas.map(l => l.map(q).join(';')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `ponto-${ano}-${pad(mes + 1)}.csv`;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* dados de exemplo do ponto (modo demonstração) */
function demoPonto() {
  const ponto = [], D = 864e5, now = Date.now();
  const rnd = (i, a, b) => a + Math.floor((Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) * (b - a + 1));
  for (let i = 48; i >= 1; i--) {
    const d = new Date(now - i * D), dow = d.getDay(), dia = inData(d);
    if (dow === 0 || dow === 6 || feriadosDoAno(d.getFullYear())[dia]) continue;
    const base = { id: uid(), dia, tipo: 'normal', ajuste_min: 0, obs: null, criado_em: d.toISOString(), atualizado_em: d.toISOString() };
    if (i === 22) { ponto.push({ ...base, entrada: null, almoco: null, volta: null, saida: null, tipo: 'atestado', obs: 'Faltei, estava com cólica (atestado)' }); continue; }
    const e = 450 + rnd(i, -6, 11), a = 815 + rnd(i + 7, -10, 10), v = a + 60 + rnd(i + 3, -2, 7);
    let s = (dow === 5 ? 990 : 1050) + rnd(i + 5, -1, 9);
    let obs = null;
    if (i === 9) { s = (dow === 5 ? 990 : 1050) - 60; obs = 'Saída mais cedo (aniversário) — descontado do banco de horas'; }
    ponto.push({ ...base, entrada: fmtHM(e), almoco: fmtHM(a), volta: fmtHM(v), saida: i % 5 === 0 ? null : fmtHM(s), obs });
  }
  const hoje = new Date();
  if (hoje.getDay() > 0 && hoje.getDay() < 6 && hoje.getHours() >= 8) {
    ponto.push({ id: uid(), dia: inData(hoje), tipo: 'normal', ajuste_min: 0, obs: null, entrada: '07:32', almoco: hoje.getHours() >= 14 ? '13:40' : null, volta: null, saida: null, criado_em: agoraISO(), atualizado_em: agoraISO() });
  }
  const fim = new Date(hoje.getFullYear(), hoje.getMonth() - (hoje.getDate() > 15 ? 0 : 1), 15);
  return { ponto, ponto_fechamentos: [{ id: uid(), ate: inData(fim), saldo_min: null, zera: false, obs: null, criado_em: fim.toISOString() }], config: [] };
}

setInterval(() => { const t = inHora(agoraISO()); $$('[data-relogio]').forEach(e => { e.textContent = t; }); }, 10000);

/* ================================================================
   ETAPAS — o caminho de cada modelo, da criação ao corte de produção
   ================================================================ */
const FLUXO = [
  ['criacao', 'Criação'], ['ficha_desenv', 'Ficha de desenvolvimento'], ['modelagem', 'Modelagem'], ['aguardando_mp', 'Aguardando MP'],
  ['corte_piloto', 'Corte piloto'], ['pilotagem', 'Pilotagem'], ['medicao', 'Medição'], ['consumo', 'Consumo - mini risco'],
  ['envio_cliente', 'Envio para o cliente'], ['negociacao', 'Negociação'], ['ajuste_modelagem', 'Ajuste de modelagem'], ['envio_cliente2', 'Envio cliente'],
  ['liberacao_produto', 'Liberação produto'], ['ficha_tecnica', 'Ficha técnica'], ['liberacao_modelagem', 'Liberação modelagem'],
  ['engenharia', 'Engenharia e graduação'], ['corte_producao', 'Corte produção - PCP'],
];
const ST_FLUXO = [['fazer', 'A fazer', '#8E8287'], ['feito', 'Feito', '#17925A'], ['pular', 'Pular', '#6B7F99'], ['revisao', 'Revisão', '#C98A06']];
const IC_FLUXO = { fazer: 'list', feito: 'check', pular: 'arrowR', revisao: 'alert' };
// etapas que se marcam sozinhas pelo resto do sistema (dá para mudar à mão)
const LIGA_FLUXO = { ficha_desenv: 'desenho', consumo: 'consumo' };
const nomeFluxo = k => (FLUXO.find(([x]) => x === k) || [])[1] || k;
const nomeSt = s => (ST_FLUXO.find(([x]) => x === s) || [])[1] || s;
const fluxoDe = pcId => S.db.fluxos.find(f => f.peca_id === pcId) || null;
const pendAbertas = e => (e.pend || []).filter(p => !p.ok).length;
const ocultoFluxo = pc => { const fl = fluxoDe(pc.id); return !!(fl && fl.etapas && fl.etapas._oculto); };
async function salvarFluxo(pc, etapas) {
  const fl = fluxoDe(pc.id);
  return fl ? salvarReg('fluxos', { etapas }, fl.id) : salvarReg('fluxos', { peca_id: pc.id, etapas });
}

function estadoEtapa(pc, fl, k) {
  const e = ((fl && fl.etapas) || {})[k] || {};
  if (e.st) return { ...e };
  const t = LIGA_FLUXO[k];
  if (t) {
    const peds = S.db.pedidos.filter(p => p.peca_id === pc.id && p.tipo === t);
    if (peds.length && peds.every(p => p.finalizado_em)) {
      return { ...e, st: 'feito', em: peds.map(p => p.finalizado_em).sort().pop(), auto: `${TIPO[t].nome === 'Consumo' ? 'Mini consumo' : TIPO[t].nome} finalizado` };
    }
    if (peds.length) return { ...e, st: 'fazer', andamento: `${TIPO[t].nome === 'Consumo' ? 'Mini consumo' : TIPO[t].nome} em andamento` };
  }
  return { ...e, st: 'fazer' };
}
// etapa atual = a primeira depois da última feita (ou pulada)
function situacaoFluxo(pc) {
  const fl = fluxoDe(pc.id);
  const est = Object.fromEntries(FLUXO.map(([k]) => [k, estadoEtapa(pc, fl, k)]));
  const ok = k => ['feito', 'pular'].includes(est[k].st);
  const ult = FLUXO.reduce((u, [k], i) => (ok(k) ? i : u), -1);
  const atual = (FLUXO.slice(ult + 1).find(([k]) => !ok(k)) || [])[0] || null;
  const feitas = FLUXO.filter(([k]) => est[k].st === 'feito').length;
  const ultimo = FLUXO.map(([k]) => est[k]).filter(e => ['feito', 'pular'].includes(e.st) && e.em).map(e => e.em).sort().pop();
  const desde = ultimo || (fl && fl.criado_em) || pc.criado_em;
  const pend = FLUXO.reduce((n, [k]) => n + pendAbertas(est[k]), 0);
  return { fl, est, atual, feitas, desde, pend };
}
function recenteFluxo(x) {
  const fl = fluxoDe(x.pc.id);
  const peds = S.db.pedidos.filter(p => p.peca_id === x.pc.id).map(p => p.pedido_em);
  return [fl && fl.atualizado_em, x.pc.criado_em, ...peds].filter(Boolean).sort().pop() || '';
}
function textoDias(desde) {
  if (!desde) return '';
  const d = Math.floor((Date.now() - new Date(desde)) / 864e5);
  return d <= 0 ? 'hoje' : plural(d, 'dia');
}

/* ---------- sala (linha / marca do cliente) ---------- */
const SALAS = ['Arrumada', 'Brasileira', 'Mindset', 'Trendy', 'Atitudes', 'Farm', 'Patrícia Foster', 'Boby Blues', 'Blue Steel', 'Plus size', 'Casual', 'Urbano'];
const salasLista = (sel = '') => [...new Set([...SALAS, ...S.db.pecas.map(p => p.sala).filter(Boolean), ...(sel ? [sel] : [])])];
const selSala = (sel = '', nome = 'sala') => `<select name="${nome}" data-sala>${opcoes(salasLista(sel).map(s => [s, s]), sel || '', '—')}<option value="__outra">Outra…</option></select>`;
function ligarSala(form) {
  form.addEventListener('change', e => {
    const s = e.target.closest('[data-sala]'); if (!s || s.value !== '__outra') return;
    const v = (prompt('Nome da sala:') || '').trim();
    if (!v) { s.value = ''; return; }
    if (![...s.options].some(o => o.value === v)) s.querySelector('option[value="__outra"]').insertAdjacentHTML('beforebegin', `<option value="${esc(v)}">${esc(v)}</option>`);
    s.value = v;
  });
}

/* ---------- tela ---------- */
function viewEtapas(arg) {
  const f = S.f.etapas || (S.f.etapas = { q: '', cli: '', sala: '', st: 'andamento' });
  const modo = pref.get('etapasModo', 'linha');
  setPage('Etapas', 'O caminho de cada modelo, da criação ao corte de produção', `<button class="btn primary" id="et-add">${ic('plus')}<span class="tx">Novo modelo</span></button>`);
  view().innerHTML = `<div class="card">
    <div class="toolbar">
      <div class="busca">${ic('search')}<input class="inp" data-f="q" placeholder="Filtrar por REF, OP, descrição ou responsável" value="${esc(f.q)}"></div>
      <select class="inp" data-f="cli">${opClientes(f.cli, 'Todos os clientes')}</select>
      <select class="inp" data-f="sala">${opcoes(salasLista().filter(s => S.db.pecas.some(p => p.sala === s)).map(s => [s, s]), f.sala, 'Todas as salas')}</select>
      <div class="chips" id="et-modo"><button class="chip${modo === 'linha' ? ' on' : ''}" data-modo="linha">${ic('flow')}Linha do tempo</button><button class="chip${modo === 'quadro' ? ' on' : ''}" data-modo="quadro">${ic('grid')}Quadro</button></div>
    </div>
    <div class="chips chips-row" id="et-st"></div>
    <div id="et-lista"></div>
  </div>`;
  const desenhar = () => {
    const qn = norm(f.q);
    const base = S.db.pecas.filter(pc => {
      if (f.cli && pc.cliente_id !== f.cli) return false;
      if (f.sala && pc.sala !== f.sala) return false;
      if (qn) {
        const fl = fluxoDe(pc.id), resp = Object.values((fl && fl.etapas) || {}).map(e => (pessoa(e.resp) || {}).nome);
        if (!norm([pc.ref, pc.descricao, pc.sala, ...opsDaPeca(pc), (cliente(pc.cliente_id) || {}).nome, ...resp].join(' ')).includes(qn)) return false;
      }
      return true;
    }).map(pc => ({ pc, s: situacaoFluxo(pc) }));
    base.forEach(x => { x.oc = ocultoFluxo(x.pc); });
    const filtros = { andamento: x => !x.oc && !!x.s.atual, pend: x => !x.oc && x.s.pend > 0, ok: x => !x.oc && !x.s.atual, todos: x => !x.oc, ocultos: x => x.oc };
    const n = Object.fromEntries(Object.keys(filtros).map(k => [k, base.filter(filtros[k]).length]));
    $('#et-st').innerHTML = [['andamento', 'Em andamento'], ['pend', 'Com pendências'], ['ok', 'Concluídos'], ['todos', 'Todos'], ...(n.ocultos ? [['ocultos', 'Escondidos']] : [])]
      .map(([v, t]) => `<button class="chip${f.st === v ? ' on' : ''}" data-st="${v}">${t}<span class="n">${n[v]}</span></button>`).join('');
    const lista = base.filter(filtros[f.st] || filtros.todos)
      .sort((a, b) => String(recenteFluxo(b)).localeCompare(String(recenteFluxo(a))));
    const box = $('#et-lista');
    if (!lista.length) {
      box.innerHTML = vazio('flow', S.db.pecas.length ? 'Nada encontrado com esses filtros' : 'Nenhuma peça cadastrada ainda',
        S.db.pecas.length ? '' : 'As peças de Desenho e Mini consumo aparecem aqui sozinhas.', `<button class="btn primary" data-et-add>${ic('plus')}Novo modelo</button>`);
      return;
    }
    box.innerHTML = modo === 'quadro' ? quadroFluxo(lista, f.st) : linhaFluxo(lista);
    hidratarFotos(box);
    const qd = $('.kb', box); if (qd && S.kbScroll) qd.scrollLeft = S.kbScroll;
  };
  $$('[data-f]', view()).forEach(el => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { f[el.dataset.f] = el.value; desenhar(); }));
  $('#et-st').addEventListener('click', e => { const b = e.target.closest('[data-st]'); if (b) { f.st = b.dataset.st; desenhar(); } });
  $('#et-modo').addEventListener('click', e => { const b = e.target.closest('[data-modo]'); if (b) { pref.set('etapasModo', b.dataset.modo); rerender(); } });
  $('#et-add').onclick = () => formAddFluxo();
  $('#et-lista').addEventListener('click', e => {
    if (e.target.closest('[data-et-add]')) return formAddFluxo();
    const b = e.target.closest('[data-et]'); if (!b) return;
    const [id, k] = b.dataset.et.split('|');
    const kb = $('.kb'); if (kb) S.kbScroll = kb.scrollLeft;
    const pc = peca(id); if (pc) formEtapa(pc, k || situacaoFluxo(pc).atual || FLUXO[FLUXO.length - 1][0]);
  });
  desenhar();
  // #/etapas/<id da peça>: abre a etapa atual da peça (ou coloca a peça nas etapas)
  if (arg && peca(arg)) {
    const pc = peca(arg);
    history.replaceState(null, '', '#/etapas');
    formEtapa(pc, situacaoFluxo(pc).atual || FLUXO[FLUXO.length - 1][0]);
  }
}

function linhaFluxo(lista) {
  return `<div class="fx-wrap"><table class="fx"><thead><tr><th class="fx-pc">Modelo</th>${FLUXO.map(([, l]) => `<th><span>${esc(l)}</span></th>`).join('')}<th class="fx-d">Na etapa</th></tr></thead>
    <tbody>${lista.map(({ pc, s }) => {
      const resp = s.atual && s.est[s.atual].resp;
      return `<tr><td class="fx-pc"><button type="button" class="fx-m" data-et="${pc.id}|">${thumb(capa(pc) || imgsCons(pc)[0])}<div><b>${esc(pc.ref)}</b><small>${cbadge(pc.cliente_id)}${pc.sala ? `<span>${esc(pc.sala)}</span>` : ''}</small>${resp ? `<small>${pchip(resp)}</small>` : ''}</div></button></td>
        ${FLUXO.map(([k, l]) => {
          const e = s.est[k], np = pendAbertas(e), cur = k === s.atual;
          const tit = `${l}: ${nomeSt(e.st)}${e.em && e.st !== 'fazer' ? ' ' + fQuando(e.em) : ''}${e.auto ? ` (${e.auto})` : ''}${e.andamento ? ` (${e.andamento})` : ''}${np ? ` · ${plural(np, 'pendência')}` : ''}${e.resp ? ` · ${(pessoa(e.resp) || {}).nome || ''}` : ''}`;
          return `<td class="${cur ? 'cur' : ''}"><button type="button" class="fx-b ${e.st}${cur ? ' atual' : ''}${e.andamento ? ' and' : ''}" data-et="${pc.id}|${k}" title="${esc(tit)}" aria-label="${esc(tit)}">${ic(IC_FLUXO[e.st])}${np ? `<i class="np">${np}</i>` : ''}${(e.arquivos || []).length ? '<i class="ax"></i>' : ''}</button></td>`;
        }).join('')}
        <td class="fx-d">${s.atual ? `<b>${textoDias(s.desde)}</b><small>${esc(nomeFluxo(s.atual))}</small>` : `<span class="tag green">Concluído</span>`}</td></tr>`;
    }).join('')}</tbody></table></div>
    <div class="fx-leg">${ST_FLUXO.map(([k, l]) => `<span><i class="fx-b ${k}">${ic(IC_FLUXO[k])}</i>${l}</span>`).join('')}<span><i class="fx-b fazer atual">${ic('list')}</i>Etapa atual</span><span><i class="fx-b fazer"><i class="np">1</i></i>Pendências</span></div>`;
}

function quadroFluxo(lista, st) {
  const cols = FLUXO.concat(st === 'andamento' || st === 'pend' ? [] : [['_fim', 'Concluídos']]);
  return `<div class="kb">${cols.map(([k, l]) => {
    const cs = lista.filter(x => (x.s.atual || '_fim') === k);
    const np = cs.filter(x => pendAbertas(x.s.est[k] || {}) > 0).length;
    return `<div class="kb-col"><div class="kb-h"><b>${esc(l)}</b><span class="n">${cs.length}</span></div>
      ${np ? `<div class="kb-p">${ic('alert')}${plural(np, 'com pendências', 'com pendências')}</div>` : ''}
      <div class="kb-b">${cs.map(({ pc, s }) => {
        const e = s.atual ? s.est[s.atual] : {}, n = pendAbertas(e);
        return `<button type="button" class="kb-c" data-et="${pc.id}|${s.atual || FLUXO[FLUXO.length - 1][0]}">${thumb(capa(pc) || imgsCons(pc)[0])}
          <div class="tx"><b>${esc(pc.ref)}</b>${pc.descricao ? `<small>${esc(pc.descricao)}</small>` : ''}
            <div class="mt">${cbadge(pc.cliente_id)}${pc.sala ? `<span class="tag gray sem">${esc(pc.sala)}</span>` : ''}</div>
            <div class="mt">${e.resp ? pchip(e.resp) : ''}${n ? `<span class="tag red">${plural(n, 'pendência')}</span>` : ''}${e.st === 'revisao' ? '<span class="tag amber">Revisão</span>' : ''}${s.atual ? `<span class="dias">${ic('clock')}${textoDias(s.desde)}</span>` : ''}</div>
            <div class="kb-pr"><i style="width:${s.feitas / FLUXO.length * 100}%"></i></div></div></button>`;
      }).join('') || '<div class="kb-v">—</div>'}</div></div>`;
  }).join('')}</div>`;
}

/* ---------- colocar um modelo nas etapas ---------- */
function formAddFluxo(pcPre = null) {
  modal({
    titulo: 'Novo modelo',
    corpo: `<form class="form" id="fad" autocomplete="off" novalidate>
      <div class="grid2">
        <label class="fld"><span>Referência *</span><input name="ref" list="dl-refs-fx" value="${esc(pcPre ? pcPre.ref : '')}" placeholder="Ex.: V116577MAR" autofocus style="text-transform:uppercase;font-weight:600"></label>
        <label class="fld"><span>Cliente</span><select name="cliente">${opClientes(pcPre ? pcPre.cliente_id : '', '—')}</select></label>
        <label class="fld"><span>Sala</span>${selSala(pcPre ? pcPre.sala : '')}</label>
        <label class="fld"><span>OP</span><input name="op" value="${esc((pcPre && pcPre.op) || '')}" inputmode="numeric"></label>
      </div>
      <label class="fld"><span>Descrição</span><input name="descricao" value="${esc((pcPre && pcPre.descricao) || '')}" placeholder="Ex.: vestido longo com babados"></label>
      <div id="fad-info"></div>
      <datalist id="dl-refs-fx">${S.db.pecas.filter(p => !fluxoDe(p.id)).map(x => `<option value="${esc(x.ref)}">${esc(x.descricao || '')}</option>`).join('')}</datalist>
    </form>`,
    rodape: `<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fad" class="btn primary">Adicionar</button>`,
    aoAbrir: m => {
      const form = m.$('#fad');
      ligarSala(form);
      const info = () => {
        const { ref, cliente: c } = separarSufixo(form.ref.value);
        if (c) { form.cliente.value = c.id; form.ref.value = ref; }
        const pc = S.db.pecas.find(x => x.ref === ref), box = m.$('#fad-info');
        if (pc) {
          if (pc.cliente_id) form.cliente.value = pc.cliente_id;
          if (pc.sala) { if (![...form.sala.options].some(o => o.value === pc.sala)) form.sala.insertAdjacentHTML('afterbegin', `<option>${esc(pc.sala)}</option>`); form.sala.value = pc.sala; }
          if (!form.op.value && pc.op) form.op.value = pc.op;
          if (!form.descricao.value && pc.descricao) form.descricao.value = pc.descricao;
          box.innerHTML = `<div class="peca-info">${thumb(capa(pc))}<div>${fluxoDe(pc.id) ? 'Essa peça já está nas etapas.' : 'Peça já cadastrada · o desenho, o mini consumo e a ficha técnica dela ficam ligados às etapas.'}</div></div>`;
          hidratarFotos(box);
        } else box.innerHTML = ref ? `<div class="peca-info">${ic('info')}<div>Referência nova — a peça <b>${esc(ref)}</b> será criada no catálogo.</div></div>` : '';
      };
      form.ref.addEventListener('change', info); form.ref.addEventListener('blur', info);
      if (pcPre) info();
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(form);
        const { ref, cliente: c } = separarSufixo(fd.get('ref'));
        if (!ref) { toast('Informe a referência.', 'erro'); form.ref.focus(); return; }
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        try {
          const cliId = fd.get('cliente') || (c && c.id) || null, sala = (fd.get('sala') || '').replace('__outra', '') || null;
          const op = String(fd.get('op') || '').trim() || null, descricao = String(fd.get('descricao') || '').trim() || null;
          let pc = S.db.pecas.find(x => x.ref === ref);
          if (!pc) pc = await salvarReg('pecas', { ref, op, cliente_id: cliId, descricao, sala, fotos: [], detalhes: [] });
          else if (cliId !== pc.cliente_id || sala !== (pc.sala || null) || (op && !pc.op) || (descricao && descricao !== pc.descricao)) {
            pc = await salvarReg('pecas', { cliente_id: cliId, sala, op: pc.op || op, descricao: descricao || pc.descricao }, pc.id);
          }
          if (!fluxoDe(pc.id)) await salvarReg('fluxos', { peca_id: pc.id, etapas: {} });
          m.fechar(); toast(`${ref} nas etapas.`);
          if (S.rota.nome === 'etapas') rerender(); else location.hash = '#/etapas';
        } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}

/* ---------- tudo da peça, ligado às etapas ---------- */
function ligacoesEtapa(pc, k) {
  const resumo = t => {
    const a = S.db.pedidos.filter(p => p.peca_id === pc.id && p.tipo === t);
    if (!a.length) return ['Nenhum pedido', ''];
    if (a.some(p => !p.finalizado_em)) return ['Em andamento', 'amber'];
    return [`Finalizado ${fDia(a.map(p => p.finalizado_em).sort().pop())}`, 'green'];
  };
  const fi = fichaDe(pc.id), c = cliente(pc.cliente_id);
  const ft = fi && !fichaVazia(fi.tecnica) ? [`Atualizada ${fDia(fi.atualizado_em)}`, 'green'] : ['Ainda não feita', ''];
  const fc = fi && !fichaVazia(fi.consumo) ? [`Atualizada ${fDia(fi.atualizado_em)}`, 'green'] : ['Ainda não feita', ''];
  const itens = [
    ['peca', `#/peca/${pc.id}`, 'dress', 'Peça', [plural(imagens(pc).length, 'imagem', 'imagens'), '']],
    ['desenho', `#/filtro/desenho/${encodeURIComponent(pc.ref)}`, 'pen', 'Desenho', resumo('desenho')],
    ['consumo', `#/filtro/consumo/${encodeURIComponent(pc.ref)}`, 'scissors', 'Mini consumo', resumo('consumo')],
    ['ficha_tecnica', `#/ficha-tecnica/${pc.id}`, 'file', 'Ficha técnica', ft],
    ['ficha_consumo', `#/ficha-tecnica/${pc.id}`, 'tag', 'Ficha de consumo', fc],
  ];
  if (c && S.db.guia_manuais.some(x => x.cliente_id === c.id)) itens.push(['medidas', `#/medidas/${c.id}`, 'ruler', 'Guia de medidas', [c.nome, '']]);
  const destaque = { ficha_desenv: 'desenho', consumo: 'consumo', ficha_tecnica: 'ficha_tecnica', medicao: 'medidas', modelagem: 'ficha_tecnica', ajuste_modelagem: 'ficha_tecnica' }[k];
  return `<div class="lig">${itens.map(([id, href, icn, nome, [txt, cor]]) => `<a class="lig-i${id === destaque ? ' on' : ''}" href="${href}">${ic(icn)}<div><b>${nome}</b><small class="${cor ? 'c-' + cor : ''}">${esc(txt)}</small></div></a>`).join('')}</div>`;
}

/* ---------- uma etapa: status, arquivos, pendências e responsável ---------- */
const ehImgArq = n => /\.(jpe?g|png|webp|gif|bmp|heic)$/i.test(n || '');
function formEtapa(pc, k) {
  const fl0 = fluxoDe(pc.id);
  const e0 = ((fl0 && fl0.etapas) || {})[k] || {};
  const oculto = ocultoFluxo(pc);
  const est = estadoEtapa(pc, fl0, k);
  const idx = FLUXO.findIndex(([x]) => x === k);
  let arqs = (e0.arquivos || []).slice();
  const novos = [], removidos = [];
  const pend = clone(e0.pend || []);
  modal({
    titulo: pc.ref, tamanho: 'lg',
    corpo: `<div class="et-top">
        <div class="et-sub">Atualizar etapa: <b>${esc(nomeFluxo(k))}</b><span class="muted"> · ${idx + 1} de ${FLUXO.length}</span></div>
        <div class="et-nav"><button type="button" class="icon-btn" data-ir="${idx - 1}" ${idx ? '' : 'disabled'} title="Etapa anterior">${ic('chevL')}</button><button type="button" class="icon-btn" data-ir="${idx + 1}" ${idx < FLUXO.length - 1 ? '' : 'disabled'} title="Próxima etapa">${ic('chevR')}</button></div>
      </div>
      <div class="et-pc">${cbadge(pc.cliente_id)}${pc.sala ? `<span class="tag gray sem">${esc(pc.sala)}</span>` : ''}${pc.descricao ? `<span class="muted small">${esc(pc.descricao)}</span>` : ''}</div>
      <div class="abas" id="abas"><button type="button" class="on" data-aba="status">Status</button><button type="button" data-aba="pend">Pendências<span class="n" id="n-pend"></span></button><button type="button" data-aba="resp">Responsável</button></div>
      <form class="form" id="fet" autocomplete="off" novalidate>
        <div data-p="status">
          <div class="fld"><span class="lbl">Ligado a esta peça</span>${ligacoesEtapa(pc, k)}</div>
          <div class="fld"><span class="lbl">Arquivos desta etapa</span>
            <label class="drop" id="drop">${ic('download')}<b>Selecione um arquivo ou arraste e solte aqui</b><small>até 15 MB cada · foto, PDF, planilha, molde…</small><span class="btn sm">Selecionar arquivo</span><input type="file" multiple hidden id="et-file"></label>
            <div class="et-arqs" id="arqs"></div></div>
          <div class="fld"><span class="lbl">Selecione um status para a etapa</span>
            <div class="pick">${ST_FLUXO.map(([s, l, cor]) => `<label><input type="radio" name="st" value="${s}"${est.st === s ? ' checked' : ''}><span class="pk" style="--c:${cor}">${l}</span></label>`).join('')}</div>
            ${est.auto ? `<span class="hint">Marcado sozinho: ${esc(est.auto)}${est.em ? ' em ' + fQuando(est.em) : ''}. Pode mudar se precisar.</span>` : est.andamento ? `<span class="hint">${esc(est.andamento)}. Fica “Feito” sozinho quando finalizar.</span>` : ''}</div>
          <label class="fld"><span>Observação</span><textarea name="obs" rows="2" placeholder="Anotações desta etapa">${esc(e0.obs || '')}</textarea></label>
          ${(e0.hist || []).length ? `<div class="fld"><span class="lbl">Histórico</span><ul class="et-hist">${e0.hist.slice().reverse().map(h => `<li><span class="dot" style="--c:${(ST_FLUXO.find(([s]) => s === h.st) || [])[2]}"></span><b>${esc(nomeSt(h.st))}</b><span class="muted">${fQuando(h.em)}${h.por ? ' · ' + esc(h.por) : ''}</span></li>`).join('')}</ul></div>` : ''}
        </div>
        <div data-p="pend" hidden>
          <div class="et-pend" id="pend"></div>
          <div class="et-add"><input class="inp" id="pend-txt" placeholder="Nova pendência (ex.: faltou o aviamento do bolso)"><button type="button" class="btn" id="pend-add">${ic('plus')}Adicionar</button></div>
        </div>
        <div data-p="resp" hidden>
          <div class="fld"><span class="lbl">Quem é responsável por esta etapa</span>${pickPessoas('resp', e0.resp || null)}</div>
          <label class="fld" style="max-width:240px"><span>Prazo</span><input type="date" name="prazo" value="${esc(e0.prazo || '')}"></label>
        </div>
      </form>`,
    rodape: `<button type="button" class="btn esq" id="et-del" title="${oculto ? 'Volta a mostrar o modelo na tela Etapas' : 'Esconde o modelo da tela Etapas (ex.: peça antiga). Nada é apagado.'}">${ic(oculto ? 'eye' : 'eyeOff')}<span class="tx">${oculto ? 'Mostrar nas etapas' : 'Esconder das etapas'}</span></button><button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fet" class="btn primary">Salvar alterações</button>`,
    aoAbrir: m => {
      const form = m.$('#fet');
      ligarNovaPessoa(form);
      setTimeout(() => { if (document.activeElement && m.el.contains(document.activeElement)) document.activeElement.blur(); m.$('.modal-b').scrollTop = 0; }, 60);
      m.el.addEventListener('click', e => { if (e.target.closest('a[href^="#/"]')) m.fechar(); });
      m.$('#abas').addEventListener('click', e => {
        const b = e.target.closest('[data-aba]'); if (!b) return;
        m.$$('[data-aba]').forEach(x => x.classList.toggle('on', x === b));
        m.$$('[data-p]').forEach(p => { p.hidden = p.dataset.p !== b.dataset.aba; });
        if (b.dataset.aba === 'pend') setTimeout(() => m.$('#pend-txt').focus(), 30);
      });
      m.$$('[data-ir]').forEach(b => { b.onclick = () => { const i = +b.dataset.ir; if (FLUXO[i]) { m.fechar(); formEtapa(peca(pc.id), FLUXO[i][0]); } }; });
      const desenhaArqs = () => {
        const todos = arqs.map((a, i) => ({ ...a, i, velho: true })).concat(novos.map((f, i) => ({ n: f.name, f, i, velho: false })));
        m.$('#arqs').innerHTML = todos.map(a => `<div class="et-arq">${a.velho && ehImgArq(a.n) ? `<button type="button" class="th" data-ver="${a.i}" data-foto="${esc(a.p)}" data-fit="contain">${ic('image')}</button>` : `<span class="arq-ic">${esc((a.n.split('.').pop() || 'arq').slice(0, 4).toUpperCase())}</span>`}
          <div class="tx"><b title="${esc(a.n)}">${esc(a.n)}</b><small>${a.velho ? (a.em ? `enviado ${fQuando(a.em)}` : 'enviado') : `novo · ${tamanhoArq(a.f.size)}`}</small></div>
          ${a.velho ? `<button type="button" class="icon-btn" data-abrir="${a.i}" title="Abrir">${ic('external')}</button>` : ''}<button type="button" class="icon-btn danger" data-tirar="${a.velho ? 'v' : 'n'}${a.i}" title="Tirar">${ic('x')}</button></div>`).join('');
        hidratarFotos(m.$('#arqs'));
      };
      const addFiles = fs => {
        const grandes = fs.filter(f => f.size > 15 * 1048576);
        if (grandes.length) toast(`${grandes.map(f => f.name).join(', ')} passa de 15 MB.`, 'erro');
        novos.push(...fs.filter(f => f.size <= 15 * 1048576)); desenhaArqs();
      };
      m.$('#et-file').addEventListener('change', e => { addFiles([...e.target.files]); e.target.value = ''; });
      const drop = m.$('#drop');
      ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('on'); }));
      ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, () => drop.classList.remove('on')));
      drop.addEventListener('drop', e => { e.preventDefault(); addFiles([...e.dataTransfer.files]); });
      m.$('#arqs').addEventListener('click', e => {
        const t = e.target.closest('[data-tirar]'), ab = e.target.closest('[data-abrir]'), v = e.target.closest('[data-ver]');
        if (t) { const tipo = t.dataset.tirar[0], i = +t.dataset.tirar.slice(1); if (tipo === 'v') { removidos.push(arqs[i].p); arqs.splice(i, 1); } else novos.splice(i, 1); desenhaArqs(); }
        if (ab) abrirArquivo(arqs[+ab.dataset.abrir].p);
        if (v) lightbox(arqs.filter(a => ehImgArq(a.n)).map(a => a.p), arqs.filter(a => ehImgArq(a.n)).indexOf(arqs[+v.dataset.ver]));
      });
      desenhaArqs();
      const desenhaPend = () => {
        m.$('#pend').innerHTML = pend.length ? pend.map((p, i) => `<label class="et-pi${p.ok ? ' ok' : ''}"><input type="checkbox" data-pi="${i}"${p.ok ? ' checked' : ''}><span>${esc(p.t)}</span><small class="muted">${fDia(p.em)}</small><button type="button" class="icon-btn danger" data-prm="${i}" title="Apagar">${ic('x')}</button></label>`).join('')
          : '<div class="muted small" style="padding:6px 2px 10px">Nenhuma pendência nesta etapa.</div>';
        const n = pend.filter(p => !p.ok).length;
        m.$('#n-pend').textContent = n ? ` ${n}` : '';
      };
      const addPend = () => { const i = m.$('#pend-txt'), t = i.value.trim(); if (!t) return; pend.push({ id: uid(), t, ok: false, em: agoraISO() }); i.value = ''; desenhaPend(); i.focus(); };
      m.$('#pend-add').onclick = addPend;
      m.$('#pend-txt').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addPend(); } });
      m.$('#pend').addEventListener('change', e => { const c = e.target.closest('[data-pi]'); if (c) { const p = pend[+c.dataset.pi]; p.ok = c.checked; p.ok_em = c.checked ? agoraISO() : null; desenhaPend(); } });
      m.$('#pend').addEventListener('click', e => { const b = e.target.closest('[data-prm]'); if (b) { e.preventDefault(); pend.splice(+b.dataset.prm, 1); desenhaPend(); } });
      desenhaPend();
      m.$('#et-del').onclick = async () => {
        try {
          const fl = fluxoDe(pc.id), et = { ...((fl && fl.etapas) || {}) };
          if (oculto) delete et._oculto; else et._oculto = true;
          await salvarFluxo(pc, et);
          m.fechar(); toast(oculto ? `${pc.ref} voltou para as etapas.` : `${pc.ref} escondido. Ele fica em “Escondidos”.`); rerender();
        } catch (err) { toast(msgErro(err), 'erro'); }
      };
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = m.$('.btn.primary'); ocupado(btn, true);
        try {
          const enviados = [];
          for (const f of novos) {
            const b = f.type.startsWith('image/') ? await comprimir(f, 2400, 0.88) : f;
            const nome = nomeSeguro(f.name);
            const path = `pecas/${pc.id}/etapas/${uid()}-${nome}`;
            await S.api.enviar(path, b.type ? b : new Blob([b], { type: 'application/octet-stream' }));
            enviados.push({ p: path, n: f.name, em: agoraISO() });
          }
          const fd = new FormData(form);
          const st = fd.get('st') || 'fazer';
          const fl = fluxoDe(pc.id);
          const atual = ((fl && fl.etapas) || {})[k] || {};
          const novo = { ...atual, arquivos: arqs.concat(enviados), pend, obs: String(fd.get('obs') || '').trim() || null, resp: fd.get('resp') || null, prazo: fd.get('prazo') || null };
          const automatico = !atual.st && st === est.st;
          if (!automatico && st !== atual.st) {
            novo.st = st; novo.em = agoraISO();
            novo.hist = (atual.hist || []).concat({ st, em: novo.em, por: nomeUsuario().split(' ')[0] });
          }
          await salvarFluxo(pc, { ...((fl && fl.etapas) || {}), [k]: novo });
          if (removidos.length) S.api.removerArquivos(removidos).catch(() => {});
          m.fechar();
          toast(`${nomeFluxo(k)} · ${nomeSt(novo.st || est.st)}`);
          rerender();
        } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
      });
    },
  });
}

/* atalho #/filtro/<desenho|consumo>/<ref>: abre a lista já filtrada pela referência */
function irFiltro(arg) {
  const [tipo, ...r] = String(arg || '').split('/');
  if (!TIPO[tipo]) { location.replace('#/inicio'); return; }
  S.f[tipo] = { q: r.join('/'), st: 'todos', cli: '', pes: '', per: 'tudo', sala: '' };
  location.replace(`#/${TIPO[tipo].rota}`);
}

function demoFluxos(pecas, pessoas) {
  const D = 864e5, ag = Date.now();
  const em = d => new Date(ag - d * D).toISOString();
  const mk = (i, feitos, extra = {}) => ({
    id: uid(), peca_id: pecas[i].id, criado_em: em(20), atualizado_em: em(1),
    etapas: Object.fromEntries(FLUXO.slice(0, feitos).map(([k], j) => [k, { st: 'feito', em: em(18 - j * 2), hist: [{ st: 'feito', em: em(18 - j * 2), por: 'Nathany' }] }]).concat(Object.entries(extra))),
  });
  return [
    mk(0, 2, { modelagem: { resp: pessoas[2].id, pend: [{ id: uid(), t: 'Conferir a altura do decote com a compradora', ok: false, em: em(1) }] } }),
    mk(1, 4),
    mk(2, 1),
    mk(3, 5, { pilotagem: { st: 'revisao', em: em(2), resp: pessoas[1].id } }),
    mk(4, 2),
    mk(5, 17),
  ];
}

/* ================================================================
   FICHA TÉCNICA e FICHA DE CONSUMO (uma por peça, tudo editável)
   ================================================================ */
const GRADE_PADRAO = ['PP', 'P', 'M', 'G', 'GG'];
const CAIXAS_FT = [['marca', 'Etiqueta de marca / tamanho'], ['composicao', 'Etiqueta de composição'], ['tag', 'Tag cód. barras'], ['alarme', 'Pino / alarme']];
const MODELOS_LINHA = {
  'tecnica.medidas': () => ({ dim: '', desc: '', desc_en: '', tipo: 'Primária', critica: 'Não', tmenos: '', tmais: '', v: {} }),
  'tecnica.acabamento': () => ({ desc: '', v: {} }),
  'tecnica.avi_tam': () => ({ desc: '', v: {} }),
  'consumo.tecidos': () => ({ codigo: '', tecido: '', gramatura: '', largura: '', consumo: '', composicao: '', cor: '' }),
  'consumo.aviamentos': () => ({ codigo: '', material: '', aplicacao: '0 - Geral', un: '', cor: '', consumo: '' }),
  'consumo.etiquetas': () => ({ codigo: '', etiqueta: '', tipo: '', aplicacao: '', un: 'UN', cor: '', consumo: '' }),
};
const ROTA_FICHA = { tecnica: 'ficha-tecnica', consumo: 'ficha-consumo' };
const NOME_FICHA = { tecnica: 'Ficha técnica', consumo: 'Ficha de consumo' };

const fichaDe = pecaId => S.db.fichas.find(f => f.peca_id === pecaId) || null;
const gradeDe = F => ((F.tecnica.grade || []).length ? F.tecnica.grade : GRADE_PADRAO);
function fichaVazia(d) {
  return !d || !Object.values(d).some(v => (Array.isArray(v) ? v.length : v && typeof v === 'object' ? Object.keys(v).length : !!v));
}
function getPath(o, path) { return path.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o); }
function setPath(o, path, val) {
  const ks = path.split('.');
  let x = o;
  for (let i = 0; i < ks.length - 1; i++) {
    if (x[ks[i]] == null || typeof x[ks[i]] !== 'object') x[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {};
    x = x[ks[i]];
  }
  x[ks[ks.length - 1]] = val;
}
const _scripts = {};
const carregarScript = url => _scripts[url] || (_scripts[url] = new Promise((res, rej) => {
  const s = document.createElement('script'); s.src = url; s.onload = res; s.onerror = () => { delete _scripts[url]; rej(new Error('Não foi possível carregar a ferramenta de exportação.')); };
  document.head.append(s);
}));

/* pontos de medida do guia do cliente, por código (ex.: "B6" → "Altura da cintura") */
function pomsDoCliente(clienteId) {
  const man = S.db.guia_manuais.find(m => m.cliente_id === clienteId);
  if (!man) return null;
  const mapa = {};
  S.db.guia_pontos.filter(p => p.manual === man.manual).forEach(p => {
    String(p.codigo || '').split(/[/,\s]+/).filter(Boolean).forEach(c => { if (!mapa[c.toUpperCase()]) mapa[c.toUpperCase()] = p.nome; });
  });
  return mapa;
}

/* ---------- lista: pesquisar a peça ---------- */
function viewFicha(tipo, arg) {
  if (arg) return folhaFicha(tipo, arg);
  const rota = ROTA_FICHA[tipo];
  const f = S.f['fl_' + tipo] || (S.f['fl_' + tipo] = { q: '' });
  setPage('Ficha técnica', 'Ficha técnica e de consumo de cada peça · pesquise pela REF, OP ou descrição');
  view().innerHTML = `<div class="card">
    <div class="guia-top"><div class="busca guia-busca">${ic('search')}<input class="inp" id="fq" placeholder="REF, OP ou descrição da peça" value="${esc(f.q)}" autocomplete="off" spellcheck="false"></div></div>
    <div class="guia-info small muted" id="fi"></div>
    <div id="fl"></div>
  </div>`;
  const desenhar = () => {
    const q = f.q.trim();
    const quando = pc => String((fichaDe(pc.id) || {}).atualizado_em || pc.atualizado_em || '');
    const lista = q ? pecasQue(q) : [...S.db.pecas].sort((a, b) => quando(b).localeCompare(quando(a)));
    $('#fi').textContent = q ? plural(lista.length, 'peça encontrada', 'peças encontradas') : 'Peças mais recentes · pesquise para achar qualquer outra';
    $('#fl').innerHTML = lista.length ? `<div class="fl-lista">${lista.slice(0, q ? 60 : 30).map(pc => {
      const fi = fichaDe(pc.id), tem = fi && (!fichaVazia(fi.tecnica) || !fichaVazia(fi.consumo)), ops = opsDaPeca(pc);
      const sub = [pc.descricao, ops.length ? `OP ${ops.join(', ')}` : ''].filter(Boolean).map(esc).join(' · ') || 'Sem descrição';
      return `<a class="fl-it" href="#/${rota}/${pc.id}">${thumb(capa(pc) || imgsCons(pc)[0])}<div class="t"><b>${esc(pc.ref)} ${cbadge(pc.cliente_id)}</b><small>${sub}</small></div>
        ${tem ? `<span class="tag green">Ficha preenchida${fi.atualizado_em ? ' · ' + fDia(fi.atualizado_em) : ''}</span>` : '<span class="tag gray">Sem ficha</span>'}${ic('chevR')}</a>`;
    }).join('')}</div>` : vazio('search', `Nenhuma peça para “${q}”`, 'A peça precisa estar cadastrada em Desenho ou Mini consumo.');
    hidratarFotos($('#fl'));
  };
  const inp = $('#fq');
  inp.addEventListener('input', () => { f.q = inp.value; desenhar(); });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter' && f.q.trim()) { const l = pecasQue(f.q); if (l.length) location.hash = `#/${rota}/${l[0].id}`; } });
  desenhar();
  if (!matchMedia('(max-width: 640px)').matches) setTimeout(() => inp.focus(), 50);
}

/* ---------- a folha (técnica ou consumo) ---------- */
function folhaFicha(tipo, pecaId) {
  const pc = peca(pecaId);
  if (!pc) { setPage(NOME_FICHA[tipo]); view().innerHTML = `<div class="card">${vazio('dress', 'Essa peça não existe mais', '', `<a class="btn" href="#/${ROTA_FICHA[tipo]}">Voltar</a>`)}</div>`; return; }
  tipo = 'tecnica';
  const fi = fichaDe(pc.id);
  const E = S.fichaAberta && S.fichaAberta.pc.id === pc.id && S.fichaAberta.pendente
    ? S.fichaAberta
    : (S.fichaAberta = { pc, tipo, F: { tecnica: clone((fi && fi.tecnica) || {}), consumo: clone((fi && fi.consumo) || {}) }, fila: Promise.resolve() });
  E.pc = pc; E.tipo = tipo;
  setPage(`${NOME_FICHA[tipo]} · ${pc.ref}`, [cliente(pc.cliente_id) && cliente(pc.cliente_id).nome, pc.descricao].filter(Boolean).join(' · '));
  const outro = tipo === 'tecnica' ? 'consumo' : 'tecnica';
  view().innerHTML = `<div class="folha-barra no-print">
      <a class="link-btn" href="#/${ROTA_FICHA[tipo]}">${ic('chevL')}Outra peça</a>
      <span class="salvo ok" id="salvo">${ic('check')}Tudo salvo</span>
      <div class="r">
        <a class="btn sm" href="#/peca/${pc.id}">${ic('dress')}<span class="tx">Peça</span></a>
        <button type="button" class="btn sm" id="ir-consumo">${ic('tag')}<span class="tx">Ir para o consumo</span></button>
        <button type="button" class="btn sm" id="f-print">${ic('download')}<span class="tx">Imprimir / PDF</span></button>
        <button type="button" class="btn sm primary" id="f-img">${ic('image')}<span class="tx">Baixar imagem</span></button>
      </div>
    </div>
    <div class="folha" id="folha"></div>`;
  desenharFolha(E);
  ligarFolha(E);
}

function desenharFolha(E) {
  const el = $('#folha'); if (!el) return;
  el.innerHTML = `${folhaTecnicaHtml(E)}<div class="folha-consumo quebra" id="folha-consumo">${folhaConsumoHtml(E)}</div>`;
  $$('textarea', el).forEach(autoAltura);
  hidratarFotos(el);
}
const autoAltura = t => { t.style.height = 'auto'; t.style.height = `${t.scrollHeight + 2}px`; };

const fcInput = (E, rot, k, extra = '', cls = '') => `<label class="fc ${cls}"><span>${rot}</span><input data-k="${k}" value="${esc(getPath(E.F, k) ?? '')}" ${extra} autocomplete="off"></label>`;
const fcPeca = (E, rot, campo, cls = '') => `<label class="fc ${cls}"><span>${rot}</span><input data-peca="${campo}" value="${esc(E.pc[campo] ?? '')}" autocomplete="off"${campo === 'op' ? ' inputmode="numeric"' : ''}></label>`;
const fcCliente = E => `<label class="fc"><span>Cliente</span><select data-peca="cliente_id">${opClientes(E.pc.cliente_id || '', '—')}</select></label>`;
const slotHtml = (k, p, rot = 'Imagem', cls = '', dica = '') => `<div class="slot ${cls}" data-slot="${k}">${p
  ? `<button type="button" class="th slot-img" data-foto="${esc(p)}" data-fit="contain" data-lb="${esc(p)}" title="Ampliar">${ic('image')}</button><button type="button" class="slot-x no-print" data-slot-x="${k}" title="Tirar imagem">${ic('x')}</button>`
  : `<label class="slot-add no-print">${ic('camera')}<span>${rot}</span>${dica ? `<small>${dica}</small>` : ''}<input type="file" accept="image/*" hidden data-slot-up="${k}"></label>`}</div>`;
const tituloFolha = (E, nome) => {
  const fi = fichaDe(E.pc.id);
  return `<div class="ft-titulo">
    <img src="assets/img/logo.png" alt="Nathany Di Celio" class="ft-logo">
    <div class="ft-nome"><small>${nome}</small><b>${esc(E.pc.ref)}</b></div>
    <div class="ft-atual">${fi ? `Atualizada em ${fData(fi.atualizado_em)} às ${fHora(fi.atualizado_em)}` : 'Ainda não preenchida'}</div>
  </div>`;
};
function miniTabela(E, titulo, key, grade, lista = '') {
  const linhas = getPath(E.F, key) || [];
  return `<div class="mini-tab"><div class="fs-sub">${titulo}</div>
    <table class="ft-tab"><thead><tr><th>Descrição</th>${grade.map(g => `<th class="n">${esc(g)}</th>`).join('')}<th class="no-print"></th></tr></thead>
    <tbody>${linhas.map((r, i) => `<tr><td><input data-k="${key}.${i}.desc" value="${esc(r.desc || '')}"${lista ? ` list="${lista}"` : ''}></td>
      ${grade.map(g => `<td class="n"><input class="num" data-k="${key}.${i}.v.${g}" value="${esc((r.v || {})[g] ?? '')}" inputmode="decimal"></td>`).join('')}
      <td class="x no-print"><button type="button" class="icon-btn danger" data-rm="${key}.${i}" title="Tirar linha">${ic('x')}</button></td></tr>`).join('')}${Array.from({ length: Math.max(0, 4 - linhas.length) }, () => `<tr class="so-print"><td></td>${grade.map(() => '<td></td>').join('')}</tr>`).join('')}</tbody></table>
    <button type="button" class="btn sm add-linha no-print" data-add="${key}">${ic('plus')}Linha</button></div>`;
}

function folhaTecnicaHtml(E) {
  const { pc, F } = E, t = F.tecnica;
  const grade = gradeDe(F), piloto = grade.includes(t.piloto) ? t.piloto : (grade.includes('P') ? 'P' : grade[0]);
  const des = t.desenho !== undefined ? t.desenho : [capa(pc)].filter(Boolean);
  const poms = pomsDoCliente(pc.cliente_id), cli = cliente(pc.cliente_id);
  const avis = [...new Set((F.consumo.aviamentos || []).map(a => a.material).filter(Boolean))];
  const linhaMed = (r, i) => `<tr>
    <td><input class="cod" data-k="tecnica.medidas.${i}.dim" data-pom="${i}" value="${esc(r.dim || '')}"${poms ? ' list="dl-pom"' : ''} placeholder="—"></td>
    <td><input data-k="tecnica.medidas.${i}.desc" value="${esc(r.desc || '')}"></td>
    <td><input data-k="tecnica.medidas.${i}.desc_en" value="${esc(r.desc_en || '')}"></td>
    <td><select data-k="tecnica.medidas.${i}.tipo">${opcoes([['Primária', 'Primária'], ['Secundária', 'Secundária']], r.tipo || 'Primária')}</select></td>
    <td><select data-k="tecnica.medidas.${i}.critica">${opcoes([['Não', 'Não'], ['Sim', 'Sim']], r.critica || 'Não')}</select></td>
    <td class="n"><input class="num" data-k="tecnica.medidas.${i}.tmenos" value="${esc(r.tmenos ?? '')}" inputmode="decimal"></td>
    <td class="n"><input class="num" data-k="tecnica.medidas.${i}.tmais" value="${esc(r.tmais ?? '')}" inputmode="decimal"></td>
    ${grade.map(g => `<td class="n${g === piloto ? ' pil' : ''}"><input class="num" data-k="tecnica.medidas.${i}.v.${g}" value="${esc((r.v || {})[g] ?? '')}" inputmode="decimal"></td>`).join('')}
    <td class="x no-print"><button type="button" class="icon-btn danger" data-rm="tecnica.medidas.${i}" title="Tirar medida">${ic('x')}</button></td></tr>`;
  return `<div class="pg1">${tituloFolha(E, 'Ficha técnica do produto')}
  <div class="ft-grid">
    ${fcCliente(E)}${fcPeca(E, 'OP', 'op')}${fcInput(E, 'Pedido', 'tecnica.pedido')}${fcInput(E, 'Código 2', 'tecnica.codigo2')}
    ${fcPeca(E, 'Descrição', 'descricao', 'span2')}${fcInput(E, 'Coleção', 'tecnica.colecao')}${fcInput(E, 'Mod. aprovada', 'tecnica.mod_aprovada', 'type="date"')}
    ${fcInput(E, 'Etiqueta', 'tecnica.etiqueta')}${fcInput(E, 'Compradora', 'tecnica.compradora')}${fcInput(E, 'Modelista', 'tecnica.modelista')}${fcInput(E, 'Lacre cliente', 'tecnica.lacre')}
    <label class="fc"><span>Grade</span><input data-grade value="${esc(grade.join(', '))}" placeholder="PP, P, M, G, GG" autocomplete="off"></label>
    <label class="fc"><span>Tamanho base</span><select data-k="tecnica.piloto">${opcoes(grade.map(g => [g, g]), piloto)}</select></label>
    ${fcInput(E, 'Rota', 'tecnica.rota')}${fcInput(E, 'M.O.', 'tecnica.mo')}
    ${fcInput(E, 'Resp. Kabriolli', 'tecnica.resp', '', 'span2')}${fcInput(E, 'Cor do produto', 'consumo.cor', '', 'span2')}
  </div>
  <section class="fs fs-des">
    <div class="fs-h"><h3>Desenho técnico</h3><div class="r no-print"><button type="button" class="btn sm" data-escolher>${ic('image')}Escolher imagens</button></div></div>
    <div class="ft-des">
      <div class="des-imgs n${Math.min(des.length, 2)}">${des.length ? des.map(p => `<button type="button" class="th des-img" data-foto="${esc(p)}" data-fit="contain" data-lb="${esc(p)}" title="Ampliar">${ic('dress')}</button>`).join('')
        : `<button type="button" class="des-vazio" data-escolher>${ic('image')}<span>Escolha o desenho técnico<br><small>frente e costas · as imagens da peça já aparecem aqui</small></span></button>`}</div>
      <div class="ft-obs"><div class="fs-sub">Obs. de modelagem</div><textarea data-k="tecnica.obs_modelagem" rows="7" placeholder="1- Seguir tabela de medidas&#10;2- Atenção aos acabamentos e tolerâncias">${esc(t.obs_modelagem || '')}</textarea></div>
    </div>
  </section>
  <section class="fs">
    <div class="ft-caixas">${CAIXAS_FT.map(([k, l]) => { const cx = (t.caixas || {})[k] || {};
      return `<div class="cx"><div class="cx-h">${l}</div>${slotHtml(`tecnica.caixas.${k}.img`, cx.img)}<textarea data-k="tecnica.caixas.${k}.txt" rows="3" placeholder="Instruções">${esc(cx.txt || '')}</textarea></div>`; }).join('')}</div>
  </section></div>
  <section class="fs quebra ft-medidas">
    <div class="fs-h"><h3>Tabela de medidas</h3><div class="r small muted">em cm · tamanho base <b>${esc(piloto)}</b></div></div>
    <div class="ft-bloco ft-b-cotas"><div class="fs-sub">Desenho das cotas</div>${slotHtml('tecnica.img_cotas', t.img_cotas, 'Desenho com as cotas', 'cotas', 'clique para escolher ou cole a imagem (Ctrl+V)')}</div>
    <div class="ft-bloco ft-b-tab"><div class="fs-sub">Medidas (foto da tabela)</div>${slotHtml('tecnica.img_tabela', t.img_tabela, 'Foto ou print da tabela de medidas', 'livre', 'clique para escolher ou cole a imagem (Ctrl+V)')}</div>
    <div class="ft-bloco ft-b-dig"><div class="fs-sub">Medidas digitadas <span class="muted no-print" style="text-transform:none;letter-spacing:0;font-weight:500">· opcional, se preferir digitar em vez da foto</span></div></div>
    <div class="tbl-wrap"><table class="ft-tab ft-med"><thead><tr><th>Dim</th><th>Descrição</th><th>Descrição (inglês)</th><th>Tipo de cota</th><th>Crítica</th><th class="n">Tol −</th><th class="n">Tol +</th>${grade.map(g => `<th class="n${g === piloto ? ' pil' : ''}">${esc(g)}</th>`).join('')}<th class="no-print"></th></tr></thead>
      <tbody>${(t.medidas || []).map(linhaMed).join('')}</tbody></table></div>
    <div class="fs-pe no-print"><button type="button" class="btn sm" data-add="tecnica.medidas">${ic('plus')}Adicionar medida</button>
      ${poms ? `<span class="small muted">Digite o código (ex.: ${esc(Object.keys(poms).slice(0, 1)[0] || 'B6')}) e a descrição vem do guia de medidas da ${esc(cli.nome)}.</span>` : ''}</div>
    <div class="ft-minis">${miniTabela(E, 'Medidas de acabamento', 'tecnica.acabamento', grade)}${miniTabela(E, 'Consumos de aviamentos', 'tecnica.avi_tam', grade, 'dl-avi')}</div>
  </section>
  ${poms ? `<datalist id="dl-pom">${Object.entries(poms).map(([c, n]) => `<option value="${esc(c)}">${esc(n)}</option>`).join('')}</datalist>` : ''}
  <datalist id="dl-avi">${avis.map(a => `<option value="${esc(a)}">`).join('')}</datalist>`;
}

function folhaConsumoHtml(E) {
  const { F } = E, k = F.consumo;
  const grade = gradeDe(F);
  const tec = k.tecidos || [], avi = k.aviamentos || [], etq = k.etiquetas || [];
  return `${tituloFolha(E, 'Ficha de consumo')}
  <div class="ft-grid">
    ${fcCliente(E)}${fcPeca(E, 'OP', 'op')}${fcPeca(E, 'Descrição', 'descricao', 'span2')}
    ${fcInput(E, 'Cor do produto', 'consumo.cor', '', 'span2')}
    <label class="fc span2"><span>Grade (da ficha técnica)</span><input value="${esc(grade.join(' / '))}" readonly tabindex="-1"></label>
  </div>
  <section class="fs">
    <div class="fs-h"><h3>Tecidos</h3><div class="r small muted">${plural(tec.length, 'tecido')}</div></div>
    <div class="tbl-wrap"><table class="ft-tab"><thead><tr><th>Código</th><th>Tecido</th><th class="n">Gramatura</th><th class="n">Largura</th><th class="n">Consumo</th><th>Composição</th><th>Cor</th><th class="no-print"></th></tr></thead>
    <tbody>${tec.map((r, i) => `<tr>
      <td><input class="cod" data-k="consumo.tecidos.${i}.codigo" value="${esc(r.codigo || '')}" placeholder="15.07.0395"></td>
      <td><input data-k="consumo.tecidos.${i}.tecido" value="${esc(r.tecido || '')}"></td>
      <td class="n"><input class="num" data-k="consumo.tecidos.${i}.gramatura" value="${esc(r.gramatura ?? '')}" inputmode="decimal"></td>
      <td class="n"><input class="num" data-k="consumo.tecidos.${i}.largura" value="${esc(r.largura ?? '')}" inputmode="decimal"></td>
      <td class="n pil"><input class="num" data-k="consumo.tecidos.${i}.consumo" value="${esc(r.consumo ?? '')}" inputmode="decimal"></td>
      <td><input data-k="consumo.tecidos.${i}.composicao" value="${esc(r.composicao || '')}"></td>
      <td><input data-k="consumo.tecidos.${i}.cor" value="${esc(r.cor || '')}"></td>
      <td class="x no-print"><button type="button" class="icon-btn danger" data-rm="consumo.tecidos.${i}" title="Tirar tecido">${ic('x')}</button></td></tr>`).join('')}</tbody></table></div>
    <div class="fs-pe no-print"><button type="button" class="btn sm" data-add="consumo.tecidos">${ic('plus')}Adicionar tecido</button></div>
  </section>
  <section class="fs">
    <div class="fs-h"><h3>Aviamentos</h3><div class="r small muted">${plural(avi.length, 'aviamento')}</div></div>
    <div class="tbl-wrap"><table class="ft-tab"><thead><tr><th>Código</th><th>Material / insumo</th><th>Aplicação</th><th>UN</th><th>Cor</th><th class="n">Consumo</th><th class="no-print"></th></tr></thead>
    <tbody>${avi.map((r, i) => `<tr>
      <td><input class="cod" data-k="consumo.aviamentos.${i}.codigo" value="${esc(r.codigo || '')}" placeholder="20.02.0001"></td>
      <td><input data-k="consumo.aviamentos.${i}.material" value="${esc(r.material || '')}"></td>
      <td><input data-k="consumo.aviamentos.${i}.aplicacao" value="${esc(r.aplicacao || '')}"></td>
      <td><input data-k="consumo.aviamentos.${i}.un" value="${esc(r.un || '')}" list="dl-un" style="max-width:70px"></td>
      <td><input data-k="consumo.aviamentos.${i}.cor" value="${esc(r.cor || '')}"></td>
      <td class="n pil"><input class="num" data-k="consumo.aviamentos.${i}.consumo" value="${esc(r.consumo ?? '')}" inputmode="decimal"></td>
      <td class="x no-print"><button type="button" class="icon-btn danger" data-rm="consumo.aviamentos.${i}" title="Tirar aviamento">${ic('x')}</button></td></tr>`).join('')}</tbody></table></div>
    <div class="fs-pe no-print"><button type="button" class="btn sm" data-add="consumo.aviamentos">${ic('plus')}Adicionar aviamento</button>
      <span class="small muted">Os aviamentos daqui aparecem como sugestão em “Consumos de aviamentos”, mais acima.</span></div>
  </section>
  <section class="fs">
    <div class="fs-h"><h3>Etiquetas</h3><div class="r small muted">${plural(etq.length, 'etiqueta')}</div></div>
    <div class="tbl-wrap"><table class="ft-tab"><thead><tr><th>Código</th><th>Etiqueta</th><th>Tipo</th><th>Aplicação</th><th>UN</th><th>Cor</th><th class="n">Consumo</th><th class="no-print"></th></tr></thead>
    <tbody>${etq.map((r, i) => `<tr>
      <td><input class="cod" data-k="consumo.etiquetas.${i}.codigo" value="${esc(r.codigo || '')}" placeholder="20.03.0818"></td>
      <td><input data-k="consumo.etiquetas.${i}.etiqueta" value="${esc(r.etiqueta || '')}"></td>
      <td><input data-k="consumo.etiquetas.${i}.tipo" value="${esc(r.tipo || '')}" list="dl-etq" style="min-width:150px"></td>
      <td><input data-k="consumo.etiquetas.${i}.aplicacao" value="${esc(r.aplicacao || '')}"></td>
      <td><input data-k="consumo.etiquetas.${i}.un" value="${esc(r.un || '')}" list="dl-un" style="max-width:70px"></td>
      <td><input data-k="consumo.etiquetas.${i}.cor" value="${esc(r.cor || '')}"></td>
      <td class="n pil"><input class="num" data-k="consumo.etiquetas.${i}.consumo" value="${esc(r.consumo ?? '')}" inputmode="decimal"></td>
      <td class="x no-print"><button type="button" class="icon-btn danger" data-rm="consumo.etiquetas.${i}" title="Tirar etiqueta">${ic('x')}</button></td></tr>`).join('')}</tbody></table></div>
    <div class="fs-pe no-print"><button type="button" class="btn sm" data-add="consumo.etiquetas">${ic('plus')}Adicionar etiqueta</button></div>
  </section>
  <datalist id="dl-etq"><option value="Marca / tamanho"><option value="Composição"><option value="Tag cód. barras"><option value="Tag de preço"><option value="Pino / alarme"><option value="Lacre"><option value="Etiqueta interna"></datalist>
  <datalist id="dl-un"><option value="MT"><option value="UN"><option value="KG"><option value="CM"><option value="PC"></datalist>`;
}

/* ---------- salvar ---------- */
function statusSalvo(txt, tipo) {
  const el = $('#salvo'); if (!el) return;
  el.className = `salvo ${tipo || ''}`;
  el.innerHTML = `${ic(tipo === 'ok' ? 'check' : tipo === 'erro' ? 'alert' : 'clock')}${esc(txt)}`;
}
const fimSalvar = E => { if (!E.agFicha && !E.agPeca) { E.pendente = false; statusSalvo('Tudo salvo', 'ok'); } };
function agendarSalvar(E, ms = 700) {
  E.pendente = true; E.agFicha = true; statusSalvo('Salvando…');
  clearTimeout(E.timer);
  E.timer = setTimeout(() => { E.agFicha = false; E.fila = E.fila.then(() => salvarFicha(E)); }, ms);
}
async function salvarFicha(E) {
  const f = fichaDe(E.pc.id);
  try {
    await salvarReg('fichas', f ? { tecnica: E.F.tecnica, consumo: E.F.consumo } : { peca_id: E.pc.id, tecnica: E.F.tecnica, consumo: E.F.consumo }, f && f.id);
    fimSalvar(E);
  } catch (e) { statusSalvo('Não salvou, tente de novo', 'erro'); toast(msgErro(e), 'erro'); }
}
function agendarPeca(E, campo, valor) {
  E.pendente = true; E.agPeca = true; statusSalvo('Salvando…');
  E.pecaPatch = { ...(E.pecaPatch || {}), [campo]: valor };
  clearTimeout(E.timerPeca);
  E.timerPeca = setTimeout(() => {
    E.agPeca = false;
    const patch = E.pecaPatch; E.pecaPatch = null;
    E.fila = E.fila.then(async () => {
      try { E.pc = await salvarReg('pecas', patch, E.pc.id); fimSalvar(E); }
      catch (e) { statusSalvo('Não salvou, tente de novo', 'erro'); toast(msgErro(e), 'erro'); }
    });
  }, 700);
}
window.addEventListener('beforeunload', e => { if (S.fichaAberta && S.fichaAberta.pendente) { e.preventDefault(); e.returnValue = ''; } });

/* ---------- eventos da folha ---------- */
function ligarFolha(E) {
  const el = $('#folha');
  el.addEventListener('input', e => {
    const t = e.target;
    if (t.tagName === 'TEXTAREA') autoAltura(t);
    const sel = t.dataset.k ? `[data-k="${t.dataset.k}"]` : t.dataset.peca ? `[data-peca="${t.dataset.peca}"]` : null;
    if (sel) el.querySelectorAll(sel).forEach(o => { if (o !== t) o.value = t.value; });
    if (t.dataset.k) { setPath(E.F, t.dataset.k, t.value); agendarSalvar(E); }
    else if (t.dataset.peca && t.tagName === 'INPUT') agendarPeca(E, t.dataset.peca, t.value.trim() || null);
  });
  el.addEventListener('change', async e => {
    const t = e.target;
    if (t.dataset.peca && t.tagName === 'SELECT') {
      el.querySelectorAll(`select[data-peca="${t.dataset.peca}"]`).forEach(o => { if (o !== t) o.value = t.value; });
      agendarPeca(E, t.dataset.peca, t.value || null); return;
    }
    if (t.dataset.pom !== undefined) {
      const poms = pomsDoCliente(E.pc.cliente_id), i = t.dataset.pom, cod = t.value.trim().toUpperCase();
      const r = E.F.tecnica.medidas[i];
      if (poms && poms[cod] && !r.desc) { r.desc = poms[cod].toUpperCase(); const d = el.querySelector(`[data-k="tecnica.medidas.${i}.desc"]`); if (d) d.value = r.desc; agendarSalvar(E); }
    }
    if (t.dataset.k === 'tecnica.piloto') desenharFolha(E);
    if (t.dataset.grade !== undefined) {
      E.F.tecnica.grade = t.value.split(/[,/;\s]+/).map(x => x.trim().toUpperCase()).filter(Boolean);
      agendarSalvar(E, 0); desenharFolha(E);
    }
    if (t.dataset.slotUp) {
      const file = t.files[0]; if (!file) return;
      statusSalvo('Enviando imagem…');
      try { const [p] = await enviarFotos(E.pc.id, [file]); setPath(E.F, t.dataset.slotUp, p); agendarSalvar(E, 0); desenharFolha(E); }
      catch (err) { statusSalvo('Imagem não enviada', 'erro'); toast(msgErro(err), 'erro'); }
    }
  });
  el.addEventListener('click', e => {
    const add = e.target.closest('[data-add]'), rm = e.target.closest('[data-rm]'), lb = e.target.closest('[data-lb]');
    const sx = e.target.closest('[data-slot-x]'), esc0 = e.target.closest('[data-escolher]');
    if (add) {
      const k = add.dataset.add, lista = getPath(E.F, k) || [];
      lista.push(MODELOS_LINHA[k]()); setPath(E.F, k, lista); agendarSalvar(E); desenharFolha(E);
      const ult = el.querySelector(`[data-k^="${k}.${lista.length - 1}."]`); if (ult) ult.focus();
      return;
    }
    if (rm) {
      const ks = rm.dataset.rm.split('.'), i = +ks.pop(), lista = getPath(E.F, ks.join('.')) || [];
      lista.splice(i, 1); agendarSalvar(E); desenharFolha(E); return;
    }
    if (sx) { setPath(E.F, sx.dataset.slotX, null); agendarSalvar(E); desenharFolha(E); return; }
    if (esc0) { escolherDesenho(E); return; }
    if (lb) lightbox([lb.dataset.lb]);
  });
  el.addEventListener('mouseover', e => { const sl = e.target.closest('.slot[data-slot]'); if (sl && sl.querySelector('.slot-add')) E.slotAlvo = sl.dataset.slot; });
  if (!S.colarFicha) {
    S.colarFicha = true;
    document.addEventListener('paste', async e => {
      const E2 = S.fichaAberta; if (!E2 || !$('#folha') || e.target.closest('input, textarea')) return;
      const file = [...(e.clipboardData || {}).items || []].filter(i => i.type.startsWith('image/')).map(i => i.getAsFile())[0];
      if (!file) return;
      e.preventDefault();
      const vazios = $$('#folha .slot[data-slot]').filter(x => x.querySelector('.slot-add')).map(x => x.dataset.slot);
      const k = vazios.includes(E2.slotAlvo) ? E2.slotAlvo : vazios.includes('tecnica.img_tabela') ? 'tecnica.img_tabela' : vazios.includes('tecnica.img_cotas') ? 'tecnica.img_cotas' : null;
      if (!k) { toast('Tire uma imagem antes de colar outra (no X da imagem)', 'erro'); return; }
      statusSalvo('Enviando imagem…');
      try { const [p] = await enviarFotos(E2.pc.id, [new File([file], `colada-${Date.now()}.png`, { type: file.type })]); setPath(E2.F, k, p); agendarSalvar(E2, 0); desenharFolha(E2); toast('Imagem colada'); }
      catch (err) { statusSalvo('Imagem não enviada', 'erro'); toast(msgErro(err), 'erro'); }
    });
  }
  $('#f-print').onclick = () => imprimirFicha();
  const ir = $('#ir-consumo'); if (ir) ir.onclick = () => $('#folha-consumo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('#f-img').onclick = () => baixarFichaImagem(E);
}

function escolherDesenho(E) {
  const pc = E.pc;
  let sel = (E.F.tecnica.desenho !== undefined ? E.F.tecnica.desenho : [capa(pc)]).filter(Boolean);
  modal({
    titulo: 'Desenho técnico', tamanho: 'lg',
    corpo: `<p class="muted small" style="margin-top:0">Toque nas imagens para escolher (ex.: frente e costas). Imagens novas também entram no catálogo da peça.</p><div class="esc-grid" id="escg"></div>`,
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="button" class="btn primary" id="esc-ok">Usar estas imagens</button>',
    aoAbrir: m => {
      const desenha = () => {
        m.$('#escg').innerHTML = imagens(peca(pc.id) || pc).map(p => `<button type="button" class="th esc${sel.includes(p) ? ' on' : ''}" data-p="${esc(p)}" data-foto="${esc(p)}" data-fit="contain">${ic('dress')}<span class="ck">${sel.includes(p) ? sel.indexOf(p) + 1 : ''}</span></button>`).join('')
          + `<label class="esc add">${ic('camera')}<span>Enviar nova</span><input type="file" accept="image/*" multiple hidden></label>`;
        hidratarFotos(m.el);
      };
      m.$('#escg').addEventListener('click', e => {
        const b = e.target.closest('[data-p]'); if (!b) return;
        const p = b.dataset.p; sel = sel.includes(p) ? sel.filter(x => x !== p) : sel.concat(p); desenha();
      });
      m.$('#escg').addEventListener('change', async e => {
        if (e.target.type !== 'file') return;
        const files = [...e.target.files].filter(f => f.type.startsWith('image/')); if (!files.length) return;
        toast(`Enviando ${plural(files.length, 'imagem', 'imagens')}…`);
        try {
          const novas = await enviarFotos(pc.id, files);
          const atual = peca(pc.id);
          E.pc = await salvarReg('pecas', { fotos: (atual.fotos || []).concat(novas) }, pc.id);
          sel = sel.concat(novas); desenha();
        } catch (err) { toast(msgErro(err), 'erro'); }
      });
      m.$('#esc-ok').onclick = () => { E.F.tecnica.desenho = sel; agendarSalvar(E, 0); m.fechar(); desenharFolha(E); };
      desenha();
    },
  });
}

/* na impressão, cada caixa de digitar vira texto (quebra linha em vez de cortar) */
function prepararImpressao() {
  const f = $('#folha'); if (!f) return;
  limparImpressao();
  $$('img', f).forEach(i => { i.loading = 'eager'; });
  $$('input, select, textarea', f).forEach(el => {
    if (el.type === 'file' || el.type === 'hidden') return;
    let v = el.tagName === 'SELECT' ? ((el.selectedOptions[0] || {}).text || '') : el.value;
    if (el.type === 'date' && v) v = v.split('-').reverse().join('/');
    const t = document.createElement('div');
    t.className = 'pv'; t.textContent = v;
    el.after(t);
  });
}
function limparImpressao() { $$('.folha .pv').forEach(x => x.remove()); }
window.addEventListener('beforeprint', prepararImpressao);
window.addEventListener('afterprint', limparImpressao);
function imprimirFicha() { prepararImpressao(); setTimeout(() => window.print(), 50); }
async function baixarFichaImagem(E) {
  const btn = $('#f-img'); ocupado(btn, true, 'Gerando…');
  try {
    await carregarScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
    document.body.classList.add('exportando');
    const canvas = await window.html2canvas($('#folha'), { useCORS: true, scale: 2, backgroundColor: '#ffffff', logging: false });
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `${E.tipo === 'tecnica' ? 'ficha-tecnica' : 'ficha-consumo'}-${nomeSeguro(E.pc.ref)}.png`;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  } catch (err) { toast(msgErro(err), 'erro'); }
  finally { document.body.classList.remove('exportando'); ocupado(btn, false); }
}

/* exemplo para o modo demonstração */
function demoFicha(pc) {
  return {
    id: uid(), peca_id: pc.id, criado_em: agoraISO(), atualizado_em: agoraISO(),
    tecnica: {
      colecao: 'VERÃO 27', pedido: '123323', codigo2: '2026-2-12936', mod_aprovada: '2026-10-01', etiqueta: 'T11- ATITUDES (CLOCK HOUSE)',
      compradora: 'BRUNA / LUIZA', modelista: 'MARINA SOARES DE OLIVEIRA', lacre: '408338', rota: 'OPERAÇÃO LASTEX', resp: 'STEPHANY PEREIRA DO NASCIMENTO',
      grade: ['PP', 'P', 'M', 'G', 'GG'], piloto: 'P',
      obs_modelagem: 'DATA 05/10 APROVADA COM RESTRIÇÃO COMO TAMANHO P\n1- SEGUIR TABELA DE MEDIDAS\n2- ATENÇÃO AOS ACABAMENTOS E TOLERÂNCIAS\n3- DEIXAR COSTURA DO BUSTO RETA\n4- ATENÇÃO ÀS MEDIDAS DE ELÁSTICO E LASTEX',
      caixas: {
        marca: { txt: '2 travetes horizontais costurados no centro costas na linha da costura para não ficar aparente' },
        composicao: { txt: 'Etiqueta de composição costurar a 10 cm da barra na lateral esquerda de quem veste' },
        tag: { txt: 'Colocar na etiqueta de marca. A tag de preço/cód. barras deve ser colocada em local visível' },
        alarme: { txt: 'Colocar o alarme na costura lateral da direita de quem veste, acima 10 cm da barra' },
      },
      medidas: [
        { dim: 'A', desc: '1/2 TÓRAX / BUSTO', desc_en: '1/2 CHEST', tipo: 'Primária', critica: 'Não', tmenos: '-1,00', tmais: '1,00', v: { PP: '28,00', P: '32,00', M: '36,00', G: '40,00', GG: '44,00' } },
        { dim: 'B6', desc: 'ALTURA DA CINTURA', desc_en: 'WAIST HEIGHT', tipo: 'Primária', critica: 'Não', tmenos: '-1,00', tmais: '1,00', v: { PP: '17,00', P: '18,00', M: '19,00', G: '20,50', GG: '22,00' } },
        { dim: 'C', desc: '1/2 QUADRIL', desc_en: '1/2 HIP', tipo: 'Primária', critica: 'Não', tmenos: '-1,00', tmais: '1,00', v: { PP: '34,00', P: '38,00', M: '42,00', G: '46,00', GG: '50,00' } },
      ],
      acabamento: [{ desc: 'Elást. decote pronto', v: { PP: '28', P: '32', M: '36', G: '40', GG: '44' } }],
      avi_tam: [{ desc: 'Elást. 1cm', v: { PP: '0,65', P: '0,73', M: '0,81', G: '0,89', GG: '0,97' } }],
    },
    consumo: {
      cor: 'OFF WHITE',
      tecidos: [
        { codigo: '15.07.0395', tecido: 'TRICOLINE WORK CITY', gramatura: '0', largura: '1,47', consumo: '1,84', composicao: '', cor: 'OFF WHITE' },
        { codigo: '14.06.0059', tecido: 'MALHA FORRO ARIZONA (ADAR)', gramatura: '0,098', largura: '1,55', consumo: '0,185', composicao: '', cor: 'OFF WHITE' },
      ],
      aviamentos: [
        { codigo: '20.02.0001', material: 'ELÁSTICO JARAGUÁ 10MM', aplicacao: '0 - Geral', un: 'MT', cor: '100 | BRANCO', consumo: '0,77' },
        { codigo: '20.02.0011', material: 'ELASTEX', aplicacao: '0 - Geral', un: 'MT', cor: '100 | BRANCO', consumo: '30,50' },
        { codigo: '20.03.0023', material: 'RFID COSTURÁVEL (C&A)', aplicacao: '0 - Geral', un: 'UN', cor: '43 | ÚNICA', consumo: '1,00' },
      ],
    },
  };
}

/* ================================================================
   Início do app
   ================================================================ */
async function iniciar(sess) {
  if (S.iniciando || (S.user && S.user.id === sess.user.id && $('.shell'))) return;
  S.iniciando = true;
  S.user = sess.user;
  root.innerHTML = '<div class="boot"><img class="logo-claro" src="assets/img/logo.png" alt="Nathany Di Celio"><img class="logo-escuro" src="assets/img/logo-escuro.png" alt=""><div class="spinner"></div></div>';
  try { await carregarTudo(); }
  catch (e) {
    S.iniciando = false;
    root.innerHTML = `<div class="boot"><div class="aviso erro" style="max-width:420px">${ic('alert')}<span>Não foi possível carregar os dados: ${esc(msgErro(e))}</span></div><button class="btn primary" id="recarregar">Tentar de novo</button></div>`;
    $('#recarregar').onclick = () => location.reload();
    return;
  }
  S.iniciando = false;
  renderShell();
  window.onhashchange = () => route(true);
  route(true);
}

async function boot() {
  try { S.api = DEMO ? DemoAPI() : SupaAPI(); }
  catch (e) { root.innerHTML = `<div class="boot"><div class="aviso erro">${ic('alert')}<span>Falha ao iniciar: ${esc(msgErro(e))}</span></div></div>`; return; }
  S.api.aoMudarAuth((ev, sess) => {
    if (ev === 'PASSWORD_RECOVERY') { if (sess && !S.user) iniciar(sess).then(pedirNovaSenha); else pedirNovaSenha(); }
    else if (ev === 'SIGNED_OUT') { S.user = null; renderAuth(); }
    else if (ev === 'SIGNED_IN' && sess && !S.user && !S.iniciando) iniciar(sess);
  });
  let sess = null;
  try { sess = await S.api.sessao(); } catch (e) { /* sem sessão */ }
  if (sess) iniciar(sess); else renderAuth();
}

// recarrega os dados quando a aba volta a ficar visível (ex.: depois de usar no celular)
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible' || !S.user || !$('.shell') || S.api.demo) return;
  if (Date.now() - S.carregadoEm < 2 * 60e3 || $('.modal-bg') || (S.fichaAberta && S.fichaAberta.pendente)) return;
  try { await carregarTudo(); if (!$('.modal-bg')) rerender(); } catch (e) { /* tenta depois */ }
});

boot();
})();
