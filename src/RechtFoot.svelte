<script>
    import Plot from "./Plot.svelte";
    import { bullshit } from "./stores.js";
    let show_bullshit = false;

    const unsubscribe = bullshit.subscribe((value) => {
        show_bullshit = value;
    });
</script>

<div class="container">
    <div>
        <h2>Recht und Sicherheit</h2>
        <p>
            Ein Jahr nach der DARPA Challenge, bei der klar wurde, dass
            autonomes Fahren möglich ist, kam die erste Gesetzesänderung, die
            das autonome Fahren ermöglicht. Die Europäischen Union
            verabschiedete 2008, die Nutzung von Funkfrequenzen im Frequenzband
            5 875 bis 5 905 MHz für sicherheitsbezogene Anwendungen
            intelligenter Verkehrssysteme. Diese ermöglicht eine
            Fahrzeug-zu-Fahrzeug Kommunikation, sowie eine
            Fahrzeug-zu-Infrastruktur und eine Infrastruktur-zu-Fahrzeug
            Kommunikation. Durch die 2015 beschlossenen EU-Verordnung, ist der
            eCall, ein bordeigenes 112-Notruf basierendes System, ab April 2018
            in allen Neuwagen verpflichtend. Dieser eCall setzt auch den exakten
            Standort durch GPS mit Zeitstempel voraus und ermöglicht diese
            Funktion dann auch autonomen Autos. Die meisten Änderungen im
            Bundesstraßengesetz kamen im Jahr 2017. Autonomes Fahren auf Stufe 1
            und 2 war rechtlich in der EU schon vor 2017 möglich. Diese neuen
            Gesetzesänderungen ermöglichten jetzt auch das autonome Fahren auf
            Stufe 3 und 4. Sie erfassten aber noch nicht das Fahren auf Stufe 5,
            also das Fahren ohne einsatzfähige Fahrer*innen. Fahrer*innen
            durften sich zwar von der Fahrzeugsteuerung abwenden, mussten aber
            wahrnehmungsbereit bleiben, um jederzeit zu übernehmen. Daten, die
            autonome Fahrzeuge erzeugen, wurden für 6 Monate gespeichert und bei
            einem Unfall für 3 Jahre. Dementsprechend sind autonome Autos, wie
            Flugzeuge, mit einer Black-Box ausgestattet, die ununterbrochen
            Telemetriedaten sammelt. Bei einem
        </p>
    </div>
    <div class="middle">
        <div class="top">
            <p>
                Unfall oder beim technischen Versagen wird so dann nach dem
                Schuldigen gesucht. Ebenfalls im Jahr 2017 wurde die
                Ethik-Kommission vom Bundesverkehrsminister eingesetzt. Diese
                hat Leitlinien erstellt, die bei der Zulassung von autonomen
                Autos gelten sollten. Bei Unfällen hat der Schutz des Menschen
                immer die höchste Priorität. Autonome Autos müssen den
                geringsten Schaden anrichten, wenn sie in eine Situation
                geraten, in der es unvermeidlich ist, einen Menschen zu treffen
                und sie können nicht aufgrund von Alter, Geschlecht, Ethnie,
                Behinderung oder anderen Faktoren diskriminiert werden. In jeder
                Fahrsituation muss geregelt sein wer zuständig ist: Mensch oder
                Maschine.
                <span class={show_bullshit ? "bullshit" : ""}>
                    In den Letzen 10 Jahren kamen dann die für das autonome Auto
                    entscheidenden Maßnahmen. Die Europäische Union
                    standardisierte ein Prüfverfahren für die Erteilung einer
                    Betriebserlaubnis für Kraftfahrzeuge mit</span
                >
            </p>
            <p>
                <span class={show_bullshit ? "bullshit" : ""}>
                    autonomen Fahrfunktionen, führte Pflichten der beteiligten
                    Personen ein und setzte einheitliche Vorschriften zur
                    Ermöglichung der Erprobung von automatisierten und autonomen
                    Kraftfahrzeugen vor. Hersteller von autonomen Fahrzeugen
                    mussten ab dann kritische Daten erfassen und
                    veröffentlichen. Die Daten beinhalten den genauen Standort
                    mit einem Zeitpunkt und Events, die jedes Mal stattfinden,
                    wenn das Auto auf öffentlichen Straßen von Autonom- zum
                    Manuellen Modus aus sicherheitsrelevantem Grunde wechselt.
                    Als diese Daten dann die Werte von vergleichbaren
                    Menschlichen Fahren unterbot wurde dann
                    Vollautomatiesierungspflicht eingeführt. Die zu
                    unterbietenden Werte waren: die Unfallrate (0.003), Unfälle
                    mit Verletzungen (0.00077) und Unfälle mit Toten (0.00001),
                    jeweils bei 1000 gefahrenen Kilometern.</span
                >
            </p>
        </div>
        <!-- <div class="plot"> -->
        <span class={show_bullshit ? "bullshit" : ""}>
            <Plot />
        </span>
        <!-- </div> -->
    </div>
</div>

<style>
    .container {
        /* background-color: red; */
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .middle {
        width: 66%;
        /* background-color: orange; */
        display: flex;
        flex-direction: column;
    }

    .top {
        width: 100%;
        display: flex;
        align-self: flex-start;
        /* background-color: pink; */
        justify-content: space-around;
    }

    h2 {
        margin: 0;
        margin-bottom: 16px;
        font-weight: 800;
        font-size: 32px;
        text-align: center;
    }

    p {
        text-align: justify;
    }
</style>
