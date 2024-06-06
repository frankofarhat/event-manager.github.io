function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    const eventDate = document.querySelector(".event-date");
    eventDate.setAttribute("min", today);
}

function validateDate() {
    const today = new Date().toISOString().split("T")[0];
    const eventDate = document.querySelector(".event-date");
    if (eventDate.value < today) {
        eventDate.value = today;
    }
}

setMinDate();

function addEvent() {
    const eventName = document.querySelector(".event-name").value;
    const eventOrganizer = document.querySelector(".organizer-name").value;
    const eventDate = document.querySelector(".event-date").value;

    if (eventName && eventOrganizer && eventDate) {
        // Get Time In Milliseconds From Epoch Time To Event Date
        const eventTimeStamp = new Date(eventDate).getTime();

        // Create Event Object
        const event = {
            name: eventName,
            organizer: eventOrganizer,
            date: eventDate,
            timeStamp: eventTimeStamp,
        };

        let events = JSON.parse(localStorage.getItem("events")) || [];
        events.push(event);
        localStorage.setItem("events", JSON.stringify(events));

        // Clear the inputs
        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => {
            input.value = "";
        });

        // Display the events
        displayEvents();
    } else {
        alert("Please fill in all fields");
    }
}

function displayEvents() {
    const eventsContainer = document.querySelector(".events");
    const events = JSON.parse(localStorage.getItem("events")) || [];
    eventsContainer.innerHTML = "";

    events.forEach((event, index) => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");
        const timeRemaining = calculateTimeRemaining(event.timeStamp);

        eventElement.innerHTML = `
            <h3>${event.name}</h3>
            <p>Organized by: ${event.organizer}</p>
            <p>Date: ${event.date}</p>
            <p>Time Remaining: ${timeRemaining}</p>
            <button class="delete" onclick="deleteEvent(${index})">Delete</button>
        `;
        eventsContainer.appendChild(eventElement);
    });
}

function calculateTimeRemaining(timeStamp) {
    const now = new Date().getTime();
    const distance = timeStamp - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function deleteEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
}

// Initial display of events on page load
displayEvents();

// Update the time remaining every second
setInterval(displayEvents, 1000);
