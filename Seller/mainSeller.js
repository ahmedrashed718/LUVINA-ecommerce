document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
  });
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `./${currentPage}` || href === currentPage) {
      link.classList.add('active');
    }
    if ((currentPage === '' || currentPage === 'index.html') && href.includes('dashboard')) {
      link.classList.add('active');
    }
  });
});
