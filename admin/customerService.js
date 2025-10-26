// customerService.js

// Sample initial data
let tickets = [
    {
        id: "#1234867",
        customerName: "Dalila Mohamed",
        status: "open",
        subject: "Shipping Delay",
        description: "My order is delayed and I need to know when it will arrive.",
        email: "dalila@example.com",
        category: "Shipping Delay"
    },
    {
        id: "#1234868",
        customerName: "Sally Ahmed",
        status: "inprogress",
        subject: "Product Defect",
        description: "The product I received has a manufacturing defect.",
        email: "sally@example.com",
        category: "Product Defect"
    },
    {
        id: "#1234869",
        customerName: "Monira Ali",
        status: "open",
        subject: "Return Request",
        description: "I would like to return the product I purchased.",
        email: "monira@example.com",
        category: "Order Inquiry"
    },
    {
        id: "#1234870",
        customerName: "Jasmin Adel",
        status: "closed",
        subject: "Billing Issue",
        description: "There is an error in my billing statement.",
        email: "jasmin@example.com",
        category: "Billing Issue"
    }
];

// DOM Elements
const createBtn = document.querySelector('.create-ticket');
const tableSection = document.getElementById('ticketsTable');
const formSection = document.getElementById('createTicketForm');
const cancelBtn = document.getElementById('cancelForm');
const ticketForm = document.getElementById('ticketForm');
const ticketsBody = document.getElementById('ticketsBody');
const searchInput = document.querySelector('.search input');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderTickets();
    
    // Event Listeners
    createBtn.addEventListener('click', showCreateForm);
    cancelBtn.addEventListener('click', hideCreateForm);
    ticketForm.addEventListener('submit', submitTicket);
    searchInput.addEventListener('input', filterTickets);
});

// Render tickets in the table
function renderTickets(filteredTickets = null) {
    const ticketsToRender = filteredTickets || tickets;
    
    ticketsBody.innerHTML = '';
    
    ticketsToRender.forEach((ticket, index) => {
        const row = document.createElement('tr');
        
        // Determine badge class based on status
        let badgeClass = '';
        let statusText = '';
        switch(ticket.status) {
            case 'open':
                badgeClass = 'bg-danger-subtle text-danger';
                statusText = 'Open';
                break;
            case 'inprogress':
                badgeClass = 'bg-warning-subtle text-warning';
                statusText = 'In Progress';
                break;
            case 'closed':
                badgeClass = 'bg-success-subtle text-success';
                statusText = 'Closed';
                break;
        }
        
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.customerName}</td>
            <td class="text-center align-middle">
                <span class="badge ${badgeClass} px-3 py-2 rounded-5 status ${ticket.status}">${statusText}</span>
            </td>
            <td>${ticket.subject}</td>
            <td><a href="#" class="text-primary text-decoration-none view" data-index="${index}">View</a></td>
        `;
        
        ticketsBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const ticketIndex = this.getAttribute('data-index');
            showTicketPopup(ticketIndex);
        });
    });
}

// Show create ticket form
function showCreateForm() {
    tableSection.style.display = 'none';
    formSection.style.display = 'block';
}

// Hide create ticket form
function hideCreateForm() {
    formSection.style.display = 'none';
    tableSection.style.display = 'block';
    ticketForm.reset();
}

// Show ticket popup
function showTicketPopup(ticketIndex) {
    const ticket = tickets[ticketIndex];
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    // Create popup content
    overlay.innerHTML = `
        <div class="popup-content">
            <button class="popup-close">&times;</button>
            <h3 class="popup-title">Ticket Details</h3>
            <div class="popup-form-group">
                <label>Customer Name</label>
                <input type="text" id="ticketName" value="${ticket.customerName}" readonly>
            </div>
            <div class="popup-form-group">
                <label>Problem Description</label>
                <input type="text" id="ticketProblem" value="${ticket.description}" readonly>
            </div>
            <div class="popup-actions">
                <button id="takeActionBtn" class="popup-btn take-action">Take Action</button>
                <button id="closeTicketBtn" class="popup-btn close">Close Ticket</button>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(overlay);
    
    // Get buttons
    const takeActionBtn = overlay.querySelector('#takeActionBtn');
    const closeTicketBtn = overlay.querySelector('#closeTicketBtn');
    const closeBtn = overlay.querySelector('.popup-close');
    
    // Update button states based on current status
    updateButtonStates(ticket.status, takeActionBtn, closeTicketBtn);
    
    // Take Action logic - فقط يغير من open إلى inprogress
    takeActionBtn.addEventListener('click', () => {
        // Update ticket status فقط إذا كانت open
        if (ticket.status === 'open') {
            ticket.status = 'inprogress';
            
            // Re-render tickets
            renderTickets();
            
            // Close popup
            document.body.removeChild(overlay);
            
            // Show success message
            alert('Ticket status changed to In Progress!');
        } else {
            // إذا كانت الحالة ليست open، نظهر رسالة
            alert('Ticket is already in progress. Only Open tickets can be moved to In Progress.');
        }
    });
    
    // Close Ticket logic - يغير الحالة إلى closed بغض النظر عن الحالة الحالية
    closeTicketBtn.addEventListener('click', () => {
        // Update ticket status to closed
        ticket.status = 'closed';
        
        // Re-render tickets
        renderTickets();
        
        // Close popup
        document.body.removeChild(overlay);
        
        // Show success message
        alert('Ticket has been closed!');
    });
    
    // Close button logic
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// Function to update button states based on ticket status
function updateButtonStates(status, takeActionBtn, closeTicketBtn) {
    switch(status) {
        case 'open':
            takeActionBtn.disabled = false;
            takeActionBtn.textContent = 'Take Action';
            closeTicketBtn.disabled = false;
            break;
        case 'inprogress':
            takeActionBtn.disabled = true;
            takeActionBtn.textContent = 'Already In Progress';
            takeActionBtn.style.backgroundColor = '#6c757d';
            closeTicketBtn.disabled = false;
            break;
        case 'closed':
            takeActionBtn.disabled = true;
            takeActionBtn.textContent = 'Take Action';
            takeActionBtn.style.backgroundColor = '#6c757d';
            closeTicketBtn.disabled = true;
            closeTicketBtn.style.backgroundColor = '#6c757d';
            closeTicketBtn.textContent = 'Already Closed';
            break;
    }
}

// Submit new ticket
function submitTicket(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const issueCategory = document.getElementById('issueCategory').value;
    const ticketSubject = document.getElementById('ticketSubject').value;
    const ticketDescription = document.getElementById('ticketDescription').value;
    
    // Generate a new ticket ID
    const newTicketId = `#${Math.floor(1000000 + Math.random() * 9000000)}`;
    
    // Create new ticket object
    const newTicket = {
        id: newTicketId,
        customerName: customerName,
        status: "open",
        subject: ticketSubject || issueCategory,
        description: ticketDescription,
        email: customerEmail,
        category: issueCategory
    };
    
    // Add to tickets array
    tickets.push(newTicket);
    
    // Reset form and show table
    hideCreateForm();
    
    // Re-render tickets
    renderTickets();
    
    // Show success message
    alert('Ticket created successfully!');
}

// Filter tickets based on search input
function filterTickets() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        renderTickets();
        return;
    }
    
    const filteredTickets = tickets.filter(ticket => 
        ticket.customerName.toLowerCase().includes(searchTerm) ||
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.id.toLowerCase().includes(searchTerm)
    );
    
    renderTickets(filteredTickets);
}