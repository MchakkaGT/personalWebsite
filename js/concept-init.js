// Set the theme before styles paint. Unknown URLs safely fall back to the original.
(() => {
  const supported = ['original', 'exploded-engine', 'turbocharger', 'abstract-assembly'];
  const requested = new URLSearchParams(location.search).get('concept') || 'original';
  document.documentElement.dataset.concept = supported.includes(requested) ? requested : 'original';
})();
