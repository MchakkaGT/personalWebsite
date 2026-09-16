// Sketch Drive is the portfolio's only design, set before styles paint.
document.documentElement.dataset.concept = 'sketch-drive';
// Keep old shared links working while removing the retired theme parameter.
const portfolioURL = new URL(location.href);
if (portfolioURL.searchParams.has('concept')) {
  portfolioURL.searchParams.delete('concept');
  history.replaceState(history.state, '', portfolioURL);
}
