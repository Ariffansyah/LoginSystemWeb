export const handleScrollToHome = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  const target = document.getElementById('Home');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, ' ');
  }
};
