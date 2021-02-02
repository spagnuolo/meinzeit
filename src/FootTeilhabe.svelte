<script>
    import { fade } from "svelte/transition";
    import { bullshit } from "./stores.js";
    let show_bullshit = false;

    const unsubscribe = bullshit.subscribe((value) => {
        show_bullshit = value;
    });
</script>

<div
    class="headline"
    in:fade={{ delay: 350, duration: 1000 }}
    out:fade={{ duration: 200 }}
>
    <h1>Rückblick: Autofahren im Jahr 2020</h1>
    <div class="container">
        <div class="column">
            <h2>In Bezug auf die Teilhabe</h2>
            <p>
                Gehen wir mal 10 Jahre in der Zeit zurück. Hier musste man noch
                eine Fahrerlaubnis erwerben, um Auto zu fahren. Zu dieser Zeit
                galt die sogenannte Fahrerlaubnisverordnung (FeV), die über die
                Zulassung von Personen im Straßenverkehr entschied. Denn nicht
                jede*r konnte diese Fahrerlaubnis bekommen. Kinder und
                Jugendliche konnten grundsätzlich erst ab dem Alter von 17
                Jahren einen Führerschein erwerben und erst ab 18 Jahren ohne
                Begleitung fahren. Ebenso ausgeschlossen waren Menschen mit
                bestimmten körperlichen oder geistigen Behinderungen. Darunter
                fiel beispielsweise eine hochgradige Schwerhörigkeit, mangelndes
                Sehvermögen, Krankheiten des Nervensystems oder bestimmte Herz-
                und Gefäßkrankheiten. Häufig musste dann auch das Auto umgebaut
                werden. Je nach Art der Behinderung mussten Rampen,
                Einstiegshilfen, verlängerte Pedale oder Lenksäulen angebracht
                werden.
            </p>
            <p class="block">
                Für ältere Menschen wurde die Verkehrsteilnahme durch den
                schleichenden Prozess körperlicher Einbußen stark erschwert.
                Reaktions-, Seh-, und Hörvermögen, Aufmerksamkeit, Beweglichkeit
                und Wahrnehmung gehörten nämlich zu den zentralen
                Voraussetzungen für eine sichere Teilnahme am Verkehr. Außerdem
                handelte man ordnungswidrig, wenn man mit mehr als 0,5 Promille
                am Straßenverkehr teilnahm. Menschen mit Verdacht auf
                Alkoholabhängigkeit oder Alkoholmissbrauch mussten sich einem
                ärztlichen oder
            </p>
        </div>
        <div class="column">
            <p>
                einem medizinischpsychologischem Gutachten unterziehen und
                bekamen beim negativen Ausfall des Gutachtens ihre Fahrerlaubnis
                entzogen oder verweigert. Auch Menschen in Abhängigkeit zu
                Betäubungs- und Arzneimitteln mussten vorerst ihre Eignung für
                den Straßenverkehr prüfen lassen. Die Kosten für ein Auto
                setzten sich damals aus Erstanschaffungskosten, Kosten für
                Benzin oder Diesel, Versicherungskosten, Instandhaltungs- und
                Führerscheinkosten zusammen. In Zeiten des Individualbesitzes
                wurden diese Kosten auch nicht aufgeteilt und mussten von
                Besitzer*innen allein bezahlt werden. Wie man sehen kann war das
                Autofahren 2020 kein inklusives Modell, denn nicht jede*r konnte
                am Straßenverkehr teilnehmen. Dadurch wurden Menschen in ihrer
                Teilhabe am gesellschaftlichen Leben und in ihrer Lebenswelt
                eingeschränkt.
            </p>
            <h2>Die Umschichtung des Arbeitsmarkts</h2>
            <p>
                Mit der wachsenden Aussicht auf das autonome Fahrzeug und die
                Vollautomatisierungspflicht, wuchs 2020 auch die Sorge um
                Arbeitsfelder und Beschäftigte, die vom nichtautonomen Fahrzeug
                abhängig waren. Die Berufe der Taxifahrer*innen,
                Lastkraftwagenfahrer*innen, Bus- und Bahnfahrer*innen sind heute
                überflüssig, denn den Personen- und Warentransport übernehmen
                die autonomen Fahrzeuge. Die Angst vor der Arbeitslosigkeit
                durch den technologischen Wandel war stark zu spüren.
            </p>
        </div>
        <div class="column">
            <p>
                Berufe, wie die der Automobilhersteller*innen oder
                Kfz-Mechatroniker*innen haben sich gewandelt und erfordern heute
                andere Kompetenzen und Fähigkeiten als noch vor 10 Jahren.
            </p>

            <p>
                <span class={show_bullshit ? "bullshit" : ""}>
                    Es wurde versucht auf die Veränderung der Arbeitswelt, durch
                    die Digitalisierung vorzubereiten, indem ermittelt wurde,
                    welche Kompetenzen an Bedeutung und Wichtigkeit gewinnen
                    würden. Technologieentwickler*innen und zuständige
                    Akteur*innen in Ausbildung und Qualifizierung setzten sich
                    zusammen und trafen Maßnahmen, die Fachkräfte in ihrer
                    Ausbildung auf neue Anforderungen und Technologien
                    vorbereiteten. Für Beschäftigte, deren Berufe zur Gänze
                    wegfielen wurden Angebote zur Neuqualifizierung und
                    Umschulung angeboten, zum Beispiel über Online-Plattformen.
                    Man forschte, wie man Angebote attraktiv gestalten könne,
                    sodass Betroffene unabhängig von Alter, Geschlecht und
                    individuellen Voraussetzungen an diesen teilnehmen und sie
                    erfolgreich beenden können. Heute haben wir an die Technik
                    angepasste Lehrpläne und verschieden eingerichtete Angebote
                    zur Qualifizierung und Umschulung. Personen aus bestimmten
                    Berufsgruppen haben die Möglichkeit für diese staatliche
                    Zuschüsse zu beantragen und zu erhalten.
                </span>
            </p>
        </div>
    </div>
</div>

<style>
    .headline {
        display: flex;
        flex-direction: column;
    }

    .container {
        display: flex;
        width: 100%;
        /* justify-content: space-evenly; */
    }

    .column {
        height: 100%;
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        /* justify-items: flex-start; */
        /* align-content: flex-start; */
        /* align-content: center; */
    }

    /* h3, */
    h1,
    h2 {
        margin: 0;
        margin-bottom: 16px;
        font-weight: 800;
        font-size: 28px;
        text-align: center;
    }

    h1 {
        font-size: 42px;
    }

    div {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    p {
        text-align: justify;
        margin: auto;
        margin-bottom: 16px;
    }

    .block {
        text-align-last: justify;
    }
</style>
