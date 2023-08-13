
window.addEventListener("DOMContentLoaded", () => {
    const rnds = document.querySelectorAll('.random-order>.inner');
    rnds.forEach((element) => {
        const children = [...element.querySelectorAll("article")].sort(() => Math.random() - 0.5);
        children.forEach((child) => {
            element.removeChild(child);
            element.appendChild(child);
        });
    });

    const concertContainer = document.querySelector('ul.concerts');
    const concerts = [...concertContainer.querySelectorAll('li')];
    concerts.sort((a, b) =>
        Date.parse(a.dataset.dateStart).valueOf() - Date.parse(b.dataset.dateStart).valueOf()
    )
    concerts.forEach((concert) => {
        concertContainer.removeChild(concert);
        const {name, dateStart, dateEnd, locationName, locationLink, fee, link} = concert.dataset;
        // TODO: fix date
        if (Date.parse(dateEnd) < Date.now()) {
            return;
        }
        const li = document.createElement("li");
        const headline = document.createElement('strong');
        if (link) {
            const a = document.createElement('a');
            a.href = link;
            a.target = "_blank";
            a.textContent = name;
            headline.appendChild(a);
        } else {
            headline.appendChild(document.createTextNode(name));
        }
        li.appendChild(headline);
        li.appendChild(document.createElement('br'));

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const start = (new Date(Date.parse(dateStart))).toLocaleString('de-DE', {...options, ...(dateStart && dateStart.includes("T") && {hour: "numeric", minute: "numeric"})});
        li.appendChild(document.createTextNode(start));
        if (dateEnd !== dateStart) {
            const end = (new Date(Date.parse(dateEnd))).toLocaleString('de-DE', {...options, ...(dateEnd && dateEnd.includes("T") && {hour: "numeric", minute: "numeric"})});
            li.appendChild(document.createTextNode(` bis ${end}`));
        }
        li.appendChild(document.createElement('br'));
        if (locationLink) {
            const a = document.createElement('a');
            a.href = locationLink;
            a.target = "_blank";
            a.textContent = locationName;
            li.appendChild(a);
        } else {
            li.appendChild(document.createTextNode(locationName));
        }


        if (fee) {
            li.appendChild(document.createElement('br'));
            if(fee.search(/[a-zA-Z]/) > -1) {
                li.appendChild(document.createTextNode(fee));
            } else {
                li.appendChild(document.createTextNode(`Eintritt: ${fee}€`));
            }
        }

        concertContainer.appendChild(li);
    })
});