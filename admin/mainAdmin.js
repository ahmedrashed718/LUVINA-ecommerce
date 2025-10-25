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
