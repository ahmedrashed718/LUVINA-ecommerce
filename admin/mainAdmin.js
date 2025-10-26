// log out button


  const logoutBtn = document.querySelector(".logout-btn");

  logoutBtn.addEventListener("click", () => {

    // localStorage.clear();

   
    window.location.href = "../../Home.html";
  });
// ****************************side bar****************
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('menu-toggle');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
// **************************chart in dashboard admin********************
 
      const ctx = document.getElementById("salesChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Sales (Log Scale)",
              data: [2, 40, 10, 150, 80, 200, 50], 
              borderColor: "#5a67d8",
              backgroundColor: "rgba(90,103,216,0.15)",
              borderWidth: 3,
              tension: 0.45, 
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: "#5a67d8",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, 
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              type: "logarithmic",
              beginAtZero: false,
              title: {
                display: true,
                text: "Sales (log scale)",
              },
              min: 1,
              max: 300,
              ticks: {
                callback: function (value) {
                  return value;
                },
              },
            },
            x: {
              title: {
                display: true,
                text: "Days",
              },
            },
          },
        },
      });
      // =====
      // =====
      // =====
      // Pagination Logic with Dynamic Data
document.addEventListener('DOMContentLoaded', function() {
    // Get pagination elements
    const pagination = document.querySelector('.pagination');
    const pageItems = document.querySelectorAll('.page-item');
    const prevBtn = document.querySelector('.page-item:first-child');
    const nextBtn = document.querySelector('.page-item:last-child');
    
    // Total pages
    const totalPages = 3;
    let currentPage = 1;

    // Sample data for each page (يمكن استبدالها ببيانات حقيقية من API)
    const pageData = {
        1: [
            { id: 1, name: "John Doe", email: "john@example.com", status: "Active", date: "2024-01-15" },
            { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending", date: "2024-01-14" },
            { id: 3, name: "Mike Johnson", email: "mike@example.com", status: "Active", date: "2024-01-13" },
            { id: 4, name: "Sarah Wilson", email: "sarah@example.com", status: "Inactive", date: "2024-01-12" },
            { id: 5, name: "Tom Brown", email: "tom@example.com", status: "Active", date: "2024-01-11" }
        ],
        2: [
            { id: 6, name: "Emily Davis", email: "emily@example.com", status: "Pending", date: "2024-01-10" },
            { id: 7, name: "Chris Lee", email: "chris@example.com", status: "Active", date: "2024-01-09" },
            { id: 8, name: "Lisa Garcia", email: "lisa@example.com", status: "Active", date: "2024-01-08" },
            { id: 9, name: "David Miller", email: "david@example.com", status: "Inactive", date: "2024-01-07" },
            { id: 10, name: "Amy Taylor", email: "amy@example.com", status: "Pending", date: "2024-01-06" }
        ],
        3: [
            { id: 11, name: "Kevin Wilson", email: "kevin@example.com", status: "Active", date: "2024-01-05" },
            { id: 12, name: "Rachel Moore", email: "rachel@example.com", status: "Active", date: "2024-01-04" },
            { id: 13, name: "Brian Clark", email: "brian@example.com", status: "Inactive", date: "2024-01-03" },
            { id: 14, name: "Michelle Lewis", email: "michelle@example.com", status: "Pending", date: "2024-01-02" },
            { id: 15, name: "Steven Walker", email: "steven@example.com", status: "Active", date: "2024-01-01" }
        ]
    };

    // Initialize pagination
    function initializePagination() {
        updatePaginationState();
        setupEventListeners();
        loadPageData(currentPage); // Load initial data
    }

    // Update pagination state based on current page
    function updatePaginationState() {
        // Remove active class from all pages
        pageItems.forEach(item => {
            if (item.querySelector('.page-link').textContent !== '«' && 
                item.querySelector('.page-link').textContent !== '»') {
                item.classList.remove('active');
            }
        });

        // Add active class to current page
        pageItems.forEach(item => {
            const pageLink = item.querySelector('.page-link');
            if (parseInt(pageLink.textContent) === currentPage) {
                item.classList.add('active');
            }
        });

        // Update previous button state
        if (currentPage === 1) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }

        // Update next button state
        if (currentPage === totalPages) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Add click event to page numbers
        pageItems.forEach(item => {
            const pageLink = item.querySelector('.page-link');
            
            pageLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                const pageText = pageLink.textContent;
                
                if (pageText === '«') {
                    // Previous button
                    if (currentPage > 1) {
                        currentPage--;
                        updatePaginationState();
                        loadPageData(currentPage);
                    }
                } else if (pageText === '»') {
                    // Next button
                    if (currentPage < totalPages) {
                        currentPage++;
                        updatePaginationState();
                        loadPageData(currentPage);
                    }
                } else {
                    // Page number
                    const pageNumber = parseInt(pageText);
                    if (pageNumber !== currentPage) {
                        currentPage = pageNumber;
                        updatePaginationState();
                        loadPageData(currentPage);
                    }
                }
            });
        });
    }

    // Function to load page data and update table
    function loadPageData(page) {
        console.log(`Loading data for page ${page}`);
        
        // Get the data for current page
        const data = pageData[page];
        
        if (!data) {
            console.error('No data found for page:', page);
            return;
        }

        // Update the table with new data
        updateTable(data);
        
        // Optional: Update page info if exists
        updatePageInfo(page);
    }

    // Function to update the table with new data
    function updateTable(data) {
        // Find the table body - adjust selector based on your actual table structure
        const tableBody = document.querySelector('table tbody');
        
        if (!tableBody) {
            console.error('Table body not found');
            return;
        }

        // Clear existing table rows (except header if it exists in tbody)
        tableBody.innerHTML = '';

        // Add new rows with data
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Create table cells based on your data structure
            // Adjust these based on your actual table columns
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(item.status)}">
                        ${item.status}
                    </span>
                </td>
                <td>${item.date}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1">Edit</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }

    // Helper function to get badge class based on status
    function getStatusBadgeClass(status) {
        switch(status.toLowerCase()) {
            case 'active':
                return 'bg-success';
            case 'pending':
                return 'bg-warning';
            case 'inactive':
                return 'bg-secondary';
            default:
                return 'bg-info';
        }
    }

    // Optional: Update page information display
    function updatePageInfo(page) {
        const pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            pageInfo.textContent = `Page ${page} of ${totalPages}`;
        }
    }

    // Initialize the pagination
    initializePagination();
});
// ==============================================================
// ==============================================================
// ==============================================================
// ===========================================================================









// mainAdmin.js

// ==================== Navigation Logic ====================
// document.addEventListener('DOMContentLoaded', function() {
//     // Get all sidebar links
//     const sidebarLinks = document.querySelectorAll('.sidebar a');
    
//     // Add click event to each sidebar link
//     sidebarLinks.forEach(link => {
//         link.addEventListener('click', function(e) {
//             e.preventDefault();
            
//             // Get the text content and clean it
//             const pageName = this.textContent.trim().toLowerCase();
//             navigateToPage(pageName);
//         });
//     });
    
//     // Navigation function
//     function navigateToPage(pageName) {
//         let targetPage = '';
        
//         switch(pageName) {
//             case 'dashboard':
//                 targetPage = 'dashboard.html';
//                 break;
//             case 'orders':
//                 targetPage = 'order.html';
//                 break;
//             case 'products':
//                 targetPage = 'products.html';
//                 break;
//             case 'sellers':
//                 targetPage = 'customers.html';
//                 break;
//             case 'customer service':
//                 targetPage = 'customerService.html';
//                 break;
//             default:
//                 console.log('Page not found:', pageName);
//                 return;
//         }
        
//         // Redirect to the target page
//         window.location.href = targetPage;
//     }
    
//     // ==================== Logout Logic ====================
//     const logoutBtn = document.querySelector(".logout-btn");
    
//     if (logoutBtn) {
//         logoutBtn.addEventListener("click", () => {
//             // Clear any stored data if needed
//             // localStorage.clear();
            
//             // Redirect to home page
//             window.location.href = "../../Home.html";
//         });
//     }
    
//     // ==================== Sidebar Toggle ====================
//     const sidebar = document.getElementById('sidebar');
//     const toggleBtn = document.getElementById('menu-toggle');
    
//     if (toggleBtn && sidebar) {
//         toggleBtn.addEventListener('click', () => {
//             sidebar.classList.toggle('active');
//         });
//     }
    
//     // ==================== Chart in Dashboard ====================
//     // Only initialize chart if we're on dashboard page
//     if (window.location.pathname.includes('dashboard') || 
//         window.location.pathname.includes('dashboard.html')) {
        
//         const chartElement = document.getElementById("salesChart");
//         if (chartElement) {
//             const ctx = chartElement.getContext("2d");
//             new Chart(ctx, {
//                 type: "line",
//                 data: {
//                     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//                     datasets: [
//                         {
//                             label: "Sales (Log Scale)",
//                             data: [2, 40, 10, 150, 80, 200, 50], 
//                             borderColor: "#5a67d8",
//                             backgroundColor: "rgba(90,103,216,0.15)",
//                             borderWidth: 3,
//                             tension: 0.45, 
//                             fill: true,
//                             pointRadius: 4,
//                             pointBackgroundColor: "#5a67d8",
//                         },
//                     ],
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false, 
//                     plugins: {
//                         legend: { display: false },
//                     },
//                     scales: {
//                         y: {
//                             type: "logarithmic",
//                             beginAtZero: false,
//                             title: {
//                                 display: true,
//                                 text: "Sales (log scale)",
//                             },
//                             min: 1,
//                             max: 300,
//                             ticks: {
//                                 callback: function (value) {
//                                     return value;
//                                 },
//                             },
//                         },
//                         x: {
//                             title: {
//                                 display: true,
//                                 text: "Days",
//                             },
//                         },
//                     },
//                 },
//             });
//         }
//     }
    
//     // ==================== Highlight Active Page ====================
//     function highlightActivePage() {
//         const currentPage = window.location.pathname.split('/').pop();
        
//         sidebarLinks.forEach(link => {
//             link.classList.remove('active');
            
//             const linkPage = link.getAttribute('href');
//             if (linkPage && linkPage.includes(currentPage)) {
//                 link.classList.add('active');
//             }
//         });
//     }
    
//     // Call this function to highlight the current page
//     highlightActivePage();
// });
// ==============================================================
// ==============================================================
// ==============================================================
// ===========================================================================






// // log out button
// const logoutBtn = document.querySelector(".logout-btn");

// logoutBtn.addEventListener("click", () => {
//   // localStorage.clear();
//   window.location.href = "../../Home.html";
// });

// // ****************************side bar****************
// const sidebar = document.getElementById('sidebar');
// const toggleBtn = document.getElementById('menu-toggle');

// toggleBtn.addEventListener('click', () => {
//   sidebar.classList.toggle('active');
// });

// // **************************chart in dashboard admin********************
// const ctx = document.getElementById("salesChart").getContext("2d");
// new Chart(ctx, {
//   type: "line",
//   data: {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         label: "Sales (Log Scale)",
//         data: [2, 40, 10, 150, 80, 200, 50], 
//         borderColor: "#5a67d8",
//         backgroundColor: "rgba(90,103,216,0.15)",
//         borderWidth: 3,
//         tension: 0.45, 
//         fill: true,
//         pointRadius: 4,
//         pointBackgroundColor: "#5a67d8",
//       },
//     ],
//   },
//   options: {
//     responsive: true,
//     maintainAspectRatio: false, 
//     plugins: {
//       legend: { display: false },
//     },
//     scales: {
//       y: {
//         type: "logarithmic",
//         beginAtZero: false,
//         title: {
//           display: true,
//           text: "Sales (log scale)",
//         },
//         min: 1,
//         max: 300,
//         ticks: {
//           callback: function (value) {
//             return value;
//           },
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Days",
//         },
//       },
//     },
//   },
// });

// // ************************** Customer Service Navigation Only ********************
// document.addEventListener('DOMContentLoaded', function() {
//   // Get the customer service link specifically
//   const customerServiceLink = document.querySelector('.sidebar a[href="./customer service.html"]');
  
//   if (customerServiceLink) {
//     customerServiceLink.addEventListener('click', function(e) {
//       e.preventDefault();
//       window.location.href = 'customerService.html';
//     });
//   }
// });