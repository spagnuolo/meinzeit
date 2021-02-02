<script>
    import { crossfade, scale } from "svelte/transition";
    import interviews from "./interviews.js";
    import Video from "./Video.svelte";
    import { bullshit } from "./stores.js";

    let show_bullshit = false;

    const unsubscribe = bullshit.subscribe((value) => {
        show_bullshit = value;
    });

    const [send, receive] = crossfade({
        duration: 300,
        fallback: scale,
    });

    let selected = null;
    let loading = null;

    const load = (image) => {
        // const timeout = setTimeout(() => (loading = image), 100);

        const img = new Image();

        img.onload = () => {
            selected = image;
            // clearTimeout(timeout);
            loading = null;
        };

        img.src = image.path;
    };

    var res = document.querySelector("audio");
    console.log(res);
</script>

<div class="flexbox">
    <div class="vcenter">
        <div>
            <h2>Aufruf aus unserer letzten Ausgabe:</h2>
            <article style="width:500px">
                <span class={show_bullshit ? "bullshit" : ""}>
                    Liebe Leser*innen,
                    <br />
                    <br />
                    ihre Meinung ist wieder gefragt. Diesmal zu dem sehr aktuellen
                    Thema: Das elektro-betriebene autonome Fahrzeug. Wie erleben
                    Sie diese neue Technologie, die uns nun schon seit einiger Zeit
                    begleitet? Was hat sich für Sie beruflich oder privat verändert,
                    seit der Vollautomatisierungspflicht und der Abschaffung des
                    Individualbesitzes? Haben Sie diesbezüglich Bedenken, Ängste
                    oder Sorgen? Haben Sie überhaupt Zugang zu dieser neuen Technik?
                    Wir wollen wissen, was Sie beschäftigt!
                    <br />
                    <br />
                    <br />
                    Mit freundlichen Grüßen
                    <br />
                    <br />
                    Ihre Redaktion
                </span>
            </article>
            <img id="karikatur" src="img/natoll.png" alt="" />
        </div>
    </div>
    <div class="container">
        <!-- <div class="phone"> -->
        <span class={show_bullshit ? "bullshit" : ""}>
            <h1>Leserantworten</h1>
        </span>
        <div class="grid">
            {#each interviews as image}
                {#if selected !== image}
                    <!-- style="background-color: {image.color};" -->
                    <button
                        style="background-image: url({image.path});background-position:{image.x} {image.y};"
                        on:click={() => load(image)}
                        in:receive={{ key: image.id }}
                        out:send={{ key: image.id }}
                    >
                        <!-- {loading === image ? "..." : image.id} -->
                    </button>
                {/if}
            {/each}
        </div>
        {#if selected}
            {#await selected then d}
                <div
                    class="overlay"
                    in:receive={{ key: d.id }}
                    out:send={{ key: d.id }}
                >
                    <!-- <img alt={d.alt} src={d.path} /> -->

                    {#if d.audio}
                        <div
                            class="full"
                            style="background-image: url({d.path});"
                            on:click={() => (selected = null)}
                        >
                            <div
                                class="binde"
                                style="background-color: {d.color};"
                            >
                                <i> {d.name} </i>
                            </div>

                            <!-- <audio controls style="background-color:{d.color};"> -->
                            <audio autoplay="true">
                                <source src={d.audio_path} type="audio/mpeg" />
                                <track kind="captions" />
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                    {:else if d.video}
                        <div
                            class="full flexbox"
                            style="background-color: black;"
                            on:click={() => (selected = null)}
                        >
                            <video
                                src={d.video_path}
                                poster="img/dots.png"
                                autoplay="true"
                            >
                                <track kind="captions" />
                            </video>
                        </div>
                    {:else}
                        <div
                            class="brief"
                            style="background-color:{d.color};"
                            on:click={() => (selected = null)}
                        >
                            <div class="written">
                                <i>{d.text}</i>
                                <i class="name"> {d.name} </i>
                            </div>
                        </div>
                    {/if}
                </div>
            {/await}
        {/if}
        <!-- </div> -->
    </div>
</div>

<style>
    .flexbox {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }

    .container {
        /* position: absolute; */
        /* display: flex; */
        /* align-items: center; */
        /* justify-content: flex-end; */
        margin-top: 10px;
        /* width: 100%; */
        /* height: 100%; */
        /* top: 0; */
        /* left: 0; */

        position: relative;
        display: flex;
        flex-direction: column;
        /* width: 52vmin;
        height: 76vmin; */
        width: 520px;
        height: 760px;
        /* border: 2vmin solid #ccc; */
        /* border-bottom-width: 10vmin; */
        /* padding: 3vmin; */
        border-radius: 2vmin;
    }

    h1 {
        font-weight: 300;
        text-transform: uppercase;
        /* font-size: 5vmin; */
        margin: 0.2em 0 0.5em 0;
    }

    .grid {
        display: grid;
        flex: 1;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-gap: 10px;
    }

    button {
        width: 100%;
        height: 100%;
        /* color: white; */
        /* font-size: 24px; */
        border: none;
        border-radius: 5px;
        margin: 0;

        background-size: cover;
        background-repeat: no-repeat;
        cursor: pointer;

        will-change: transform;
    }

    /* img, */
    .overlay {
        position: absolute;
        /* top: 0;
        left: 0; */
        width: 100%;
        height: 100%;
        border-radius: 5px;
        overflow: hidden;
    }

    .overlay {
        display: flex;
        align-items: stretch;
        justify-content: flex-end;
        flex-direction: column;
        will-change: transform;
    }

    /* img {
        filter: blur(3px);
        object-fit: cover;
    } */

    .binde {
        color: #fdfdfd;
        font-size: 20px;
        text-align: center;
        margin-top: 600px;
        background-color: rgb(26, 26, 26);
    }

    video {
        width: 100%;
    }

    audio {
        width: 100%;
        /* margin-top: 80%; */
        background-color: rgb(26, 26, 26);
    }

    .full {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        cursor: pointer;
    }

    .brief {
        text-align: center;
        width: 100%;
        height: 100%;
        /* font-size: 2.5vmin; */
        margin: 0;
        /* opacity: 0.8; */
        /* background: #373737;
        background: linear-gradient(to right, #333, #555); */
        cursor: pointer;
    }

    .written {
        /* font-size: 20px; */
        /* height: 100%; */
        color: white;
        /* padding: 32px; */

        margin-left: 20px;
        margin-right: 20px;

        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .name {
        margin-top: 20px;
    }

    #karikatur {
        width: 500px;
        border-radius: 50%;
        margin: 0;
        margin-top: 30px;
    }
</style>
