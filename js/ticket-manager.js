const TICKETS_KEY = 'supportTickets';
function generateTicketNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TKT${timestamp}${random}`;
}
function submitTicket(ticketData) {
    try {
        const tickets = getAllTickets();
        const newTicket = {
            ticketNumber: generateTicketNumber(),
            name: ticketData.name,
            email: ticketData.email,
            phone: ticketData.phone || 'Not provided',
            category: ticketData.category,
            subject: ticketData.subject,
            message: ticketData.message,
            priority: ticketData.priority || 'Medium',
            status: 'Open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            responses: []
        };
        tickets.push(newTicket);
        localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
        console.log('✅ Ticket submitted:', newTicket.ticketNumber);
        return newTicket.ticketNumber;
    } catch (error) {
        console.error('Error submitting ticket:', error);
        return null;
    }
}
function getAllTickets() {
    try {
        return JSON.parse(localStorage.getItem(TICKETS_KEY)) || [];
    } catch (error) {
        console.error('Error getting tickets:', error);
        return [];
    }
}
function getTicketByNumber(ticketNumber) {
    const tickets = getAllTickets();
    return tickets.find(t => t.ticketNumber === ticketNumber);
}
function getTicketsByStatus(status) {
    const tickets = getAllTickets();
    return tickets.filter(t => t.status === status);
}
function getTicketsByPriority(priority) {
    const tickets = getAllTickets();
    return tickets.filter(t => t.priority === priority);
}
function updateTicketStatus(ticketNumber, newStatus) {
    try {
        const tickets = getAllTickets();
        const ticketIndex = tickets.findIndex(t => t.ticketNumber === ticketNumber);
        if (ticketIndex !== -1) {
            tickets[ticketIndex].status = newStatus;
            tickets[ticketIndex].updatedAt = new Date().toISOString();
            localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating ticket status:', error);
        return false;
    }
}
function addTicketResponse(ticketNumber, response, respondedBy = 'Admin') {
    try {
        const tickets = getAllTickets();
        const ticketIndex = tickets.findIndex(t => t.ticketNumber === ticketNumber);
        if (ticketIndex !== -1) {
            const newResponse = {
                message: response,
                respondedBy: respondedBy,
                timestamp: new Date().toISOString()
            };
            tickets[ticketIndex].responses.push(newResponse);
            tickets[ticketIndex].updatedAt = new Date().toISOString();
            localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error adding ticket response:', error);
        return false;
    }
}
function deleteTicket(ticketNumber) {
    try {
        const tickets = getAllTickets();
        const filteredTickets = tickets.filter(t => t.ticketNumber !== ticketNumber);
        if (filteredTickets.length < tickets.length) {
            localStorage.setItem(TICKETS_KEY, JSON.stringify(filteredTickets));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting ticket:', error);
        return false;
    }
}
function searchTickets(query) {
    const tickets = getAllTickets();
    const lowerQuery = query.toLowerCase();
    return tickets.filter(t =>
        t.ticketNumber.toLowerCase().includes(lowerQuery) ||
        t.name.toLowerCase().includes(lowerQuery) ||
        t.email.toLowerCase().includes(lowerQuery) ||
        t.subject.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery)
    );
}
function getTicketStats() {
    const tickets = getAllTickets();
    return {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        inProgress: tickets.filter(t => t.status === 'In Progress').length,
        resolved: tickets.filter(t => t.status === 'Resolved').length,
        closed: tickets.filter(t => t.status === 'Closed').length,
        high: tickets.filter(t => t.priority === 'High').length,
        medium: tickets.filter(t => t.priority === 'Medium').length,
        low: tickets.filter(t => t.priority === 'Low').length
    };
}
function formatTicketDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function getTicketStatusBadge(status) {
    const badges = {
        'Open': 'bg-primary',
        'In Progress': 'bg-warning',
        'Resolved': 'bg-success',
        'Closed': 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
}
function getTicketPriorityBadge(priority) {
    const badges = {
        'High': 'bg-danger',
        'Medium': 'bg-warning',
        'Low': 'bg-info'
    };
    return badges[priority] || 'bg-secondary';
}
