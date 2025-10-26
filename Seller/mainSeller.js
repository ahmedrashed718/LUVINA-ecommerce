// Sidebar Active State Handler
// ضع هذا الكود في ملف mainSeller.js أو في نهاية كل صفحة HTML

document.addEventListener('DOMContentLoaded', function() {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop();
  
  // Remove active class from all sidebar links
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current page link
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if link matches current page
    if (href === `./${currentPage}` || href === currentPage) {
      link.classList.add('active');
    }
    
    // Special case: if on index or root, activate dashboard
    if ((currentPage === '' || currentPage === 'index.html') && href.includes('dashboard')) {
      link.classList.add('active');
    }
  });
});