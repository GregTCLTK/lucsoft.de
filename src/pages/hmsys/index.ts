import { WebGen, list, span, Custom, Card, CommonCard, richCard, View, Grid } from '@lucsoft/webgen';
import { timeSince } from "../../commons/time";
import { renderNavigation } from '../../components/navigation';
import './animation.css';
import { svgElements } from './componets/svgRender';

WebGen();

const services = Promise.allSettled([
    fetch("https://hmsys.de/stats"),
    fetch("https://dev.hmsys.de/stats")
]);
const servicesName = [
    "Europa Stable Server (hmsys.de)",
    "Europa Development Server (dev.hmsys.de)"
]

const background = document.createElement('div');
background.style.position = "fixed"
background.style.top = "5rem";
background.style.left = "-8%";
background.style.right = "25%";
background.style.zIndex = "-1";

background.innerHTML = `<svg viewBox="0 0 5019 4492" fill="none" xmlns="http://www.w3.org/2000/svg">${svgElements.map(x => `<rect width="${x[ 0 ]}" height="${x[ 0 ]}" transform="matrix(${x[ 1 ]})" fill="${x[ 2 ]}" ${typeof x[ 3 ] !== "undefined" ? `class="mv ${x[ 3 ]}"` : ''}/>`)}</svg>`;

View<{ statusPage: CommonCard[] }>(({ use, state, update }) => {

    use(renderNavigation());
    use(Custom(background))

    if (state.statusPage === undefined)
        fetchData(update)

    if (!state.statusPage || state.statusPage.length == 0)
        use(Grid({ maxWidth: "50rem" }, richCard({
            title: 'HmSYS Status',
            content: span('Fetching Service...')
        })))
    else
        use(Grid({ maxWidth: "50rem" }, ...state.statusPage))

}).appendOn(document.body)


function fetchData(update: (data: Partial<{
    statusPage: CommonCard[];
}>) => void) {
    services.then(async x => {
        const data = await Promise.all(x.map(x => x.status == "fulfilled" ? x.value.json() : undefined))
        update({
            statusPage: [
                richCard({
                    title: 'HmSYS Status',
                    content:
                        list({ noHeigthLimit: false }, ...data.map((entry, index) => ({
                            left: servicesName[ index ],
                            right: span(loadTranslation(entry))
                        })))

                }),
                ...data.filter(x => x != undefined).map((entry, index) => richCard({
                    title: servicesName[ index ],
                    content:
                        list(
                            { noHeigthLimit: false },
                            {
                                left: 'LoadAverage',
                                right: entry.host.loadAverage.map((x: number) => x.toFixed(2)).join(' ')
                            },
                            {
                                left: 'Uptime (HmSYS)',
                                right: span(timeSince((new Date().getTime() - entry.uptime) / 1000))
                            },
                            {
                                left: 'Uptime (Host)',
                                right: span(timeSince(entry.host.uptime))
                            },
                            {
                                left: 'Events since Restart',
                                right: span(entry.eventsEmitted)
                            }
                        )
                }))
            ]
        })
    })
}


function loadTranslation(entry: any) {
    if (!entry)
        return "Offline";
    else if (entry.host.loadAverage[ 0 ] < 1)
        return "Normal";
    else if (entry.host.loadAverage[ 0 ] > 1)
        return "High load";
    return "Timeout";
}
