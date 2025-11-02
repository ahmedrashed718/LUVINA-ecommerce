  const logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", () => {
    window.location.href = "../../Home.html";
  });
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('menu-toggle');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
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
document.addEventListener('DOMContentLoaded', function() {
    const pagination = document.querySelector('.pagination');
    const pageItems = document.querySelectorAll('.page-item');
    const prevBtn = document.querySelector('.page-item:first-child');
    const nextBtn = document.querySelector('.page-item:last-child');
    const totalPages = 3;
    let currentPage = 1;
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
    function initializePagination() {
        updatePaginationState();
        setupEventListeners();
        loadPageData(currentPage); 
    }
    function updatePaginationState() {
        pageItems.forEach(item => {
            if (item.querySelector('.page-link').textContent !== '«' && 
                item.querySelector('.page-link').textContent !== '»') {
                item.classList.remove('active');
            }
        });
        pageItems.forEach(item => {
            const pageLink = item.querySelector('.page-link');
            if (parseInt(pageLink.textContent) === currentPage) {
                item.classList.add('active');
            }
        });
        if (currentPage === 1) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        if (currentPage === totalPages) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    function setupEventListeners() {
        pageItems.forEach(item => {
            const pageLink = item.querySelector('.page-link');
            pageLink.addEventListener('click', function(e) {
                e.preventDefault();
                const pageText = pageLink.textContent;
                if (pageText === '«') {
                    if (currentPage > 1) {
                        currentPage--;
                        updatePaginationState();
                        loadPageData(currentPage);
                    }
                } else if (pageText === '»') {
                    if (currentPage < totalPages) {
                        currentPage++;
                        updatePaginationState();
                        loadPageData(currentPage);
                    }
                } else {
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
    function loadPageData(page) {
        console.log(`Loading data for page ${page}`);
        const data = pageData[page];
        if (!data) {
            console.error('No data found for page:', page);
            return;
        }
        updateTable(data);
        updatePageInfo(page);
    }
    function updateTable(data) {
        const tableBody = document.querySelector('table tbody');
        if (!tableBody) {
            console.error('Table body not found');
            return;
        }
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
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
    function updatePageInfo(page) {
        const pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            pageInfo.textContent = `Page ${page} of ${totalPages}`;
        }
    }
    initializePagination();
});
