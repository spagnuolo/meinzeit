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
    <h2>
        Autonomes Fahren: Sind autonome Fahrzeuge ein exklusives Zukunftsmodell?
    </h2>
    <div class="container">
        <div class="column">
            <p>
                In unserer zweiten diesjährigen Ausgabe soll es um die bis jetzt
                mitunter größte Errungenschaft des 21. Jahrhunderts gehen: Das
                autonome Fahrzeug. Noch vor 10 Jahren war der Verkehr in
                Deutschland geprägt von umweltschädlichen Verbrennungsmotoren,
                einer unvernetzten Infrastruktur und Individualbesitz. Anfang
                des Jahres 2020 waren noch insgesamt 58,2 Millionen
                Kraftfahrzeuge in Deutschland zugelassen und die
                Verkehrsemissionen lagen bei circa 163,5 Millionen Tonnen CO<sub
                    >2</sub
                >. Selten fuhren elektrobetriebene Fahrzeuge auf den Straßen und
                für den Betrieb autonomer Fahrzeuge im öffentlichen Verkehr
                brauchte es eine Sondererlaubnis.
            </p>
            <p>
                <span class={show_bullshit ? "bullshit" : ""}>
                    Bis zum Jahr 2030 wandelte sich, mit dem autonomen Fahrzeug
                    der Stufe fünf, die Rolle der Menschen als Fahrer*innen zu
                    Passagier*innen ohne Fahraufgabe.</span
                >
            </p>
        </div>
        <div class="column">
            <p>
                <span class={show_bullshit ? "bullshit" : ""}>
                    Der Individualbesitz wurde abgeschafft, sodass sich
                    verschiedene Personengruppen, wie Familien oder benachbarte
                    Wohneinheiten ein autonomes Fahrzeug teilen. Des Weiteren
                    herrscht nun eine Vollautomatisierungspflicht. Demnach sind
                    keine nichtautomatisierten Fahrzeuge auf den Straßen
                    erlaubt, um eine zentralvernetzte Infrastruktur, die alle
                    Verkehrsteilnehmer*innen miteinander kommunizieren lässt, zu
                    ermöglichen. Der öffentliche Nahverkehr wurde auf autonome
                    Bahnen und Reisebusse reduziert, die nur noch weite Strecken
                    anfahren.</span
                >
            </p>
            <p>
                <span class={show_bullshit ? "bullshit" : ""}>
                    Dadurch hat sich viel verändert. Unter anderem sind mehr
                    Menschen von der Stadt zurück aufs Land gezogen, da der
                    ländliche Lebensraum, aufgrund der gestiegenen Mobilität an
                    Attraktivität gewonnen hat. Unsere CO<sub>2</sub>-Emissionen
                    konnten durch die Elektromobilität stark</span
                >
            </p>
        </div>
        <div class="column">
            <p>
                <span class={show_bullshit ? "bullshit" : ""}>
                    gesenkt werden. Durch die vernetzte Infrastruktur gibt es
                    keine Staus mehr und der Verkehr ist sicherer geworden,
                    sodass auch die Polizei diesbezüglich entlastet werden
                    konnte.</span
                >
            </p>
            <p>
                <span class={show_bullshit ? "bullshit" : ""}>
                    Außerdem hat sich der Arbeitsmarkt umgeschichtet: Manche
                    Arbeitsplätze, wie die der Fahrlehrer*innen, Busfahrer*innen
                    oder Taxifahrer*innen sind verloren gegangen, andere
                    Arbeitsplätze haben sich gewandelt, wie die der Auto
                    Mechatroniker*innen oder Automobilhersteller*innen und
                    wieder andere Arbeitsplätze sind neu entstanden, wie die der
                    3D-Druck-Expert*innen oder der Data Stewards. Und das sind
                    nur ein paar der Auswirkungen des autonomen Fahrens. Wir als
                    Redaktion stellen uns die Frage, wie sich die Gesellschaft
                    mit dieser neuen Errungenschaft arrangiert hat und wie
                    exklusiv das Modell des autonomen Fahrzeugs ist.</span
                >
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
    h2 {
        margin: 0;
        margin-bottom: 16px;
        font-weight: 800;
        font-size: 34px;
        text-align: center;
    }

    /* h3 {
        text-align: left;
        font-size: 18px;
    } */

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

    /* .block {
        text-align-last: justify;
    } */
</style>
