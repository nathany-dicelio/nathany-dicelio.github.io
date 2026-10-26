// Não deixa o sistema ser aberto dentro de outro site (o GitHub Pages não permite configurar isso no servidor).
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  try { window.top.location = window.self.location.href; } catch (e) { /* bloqueado: a página fica escondida */ }
}
// Aplica o tema (claro/noturno) antes de a página aparecer, para não piscar.
(function () {
  var t = null;
  try { t = localStorage.getItem('nd.tema'); } catch (e) { /* armazenamento bloqueado */ }
  if (t !== 'dark' && t !== 'light') t = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
