// Conexão com o banco de dados (Supabase) — projeto "nathany-atelie" (organização Nathany Di Celio).
// Chave "publishable": pode ficar no site; a segurança é feita pelas regras do banco (RLS).
// NUNCA coloque aqui a chave "secret" / "service_role".
// Para usar o MODO DEMONSTRAÇÃO, deixe os dois valores vazios ou abra o site com ?demo no endereço.
window.ND_CONFIG = {
  supabaseUrl: 'https://bubhhonjvyijgfiipseb.supabase.co',
  supabaseAnonKey: 'sb_publishable_W0Ut6IXmUZUMpgpfwgppVQ_8difPSz7',
  // Cadastro fechado: as contas da Nathany e do Henrique já existem.
  // "Allow new users to sign up" também está desligado no Supabase (Authentication > Sign In / Providers).
  permitirCadastro: false,
};
