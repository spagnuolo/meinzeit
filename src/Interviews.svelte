<script>
    import { crossfade, scale } from "svelte/transition";
    import interviews from "./interviews.js";

    const [send, receive] = crossfade({
        duration: 200,
        fallback: scale,
    });

    let selected = null;
    let loading = null;

    const load = (image) => {
        const timeout = setTimeout(() => (loading = image), 100);

        const img = new Image();

        img.onload = () => {
            selected = image;
            clearTimeout(timeout);
            loading = null;
        };

        img.src = image.path;
    };
</script>

<div class="container">
    <div class="phone">
        <h1>Leserbriefe</h1>

        <div class="grid">
            {#each interviews as image}
                {#if selected !== image}
                    <button
                        style="background-color: {image.color};"
                        on:click={() => load(image)}
                        in:receive={{ key: image.id }}
                        out:send={{ key: image.id }}
                        >{loading === image ? "..." : image.id}</button
                    >
                {/if}
            {/each}
        </div>

        {#if selected}
            {#await selected then d}
                <div
                    class="photo"
                    in:receive={{ key: d.id }}
                    out:send={{ key: d.id }}
                >
                    <img alt={d.alt} src={d.path} />

                    <div class="brief" on:click={() => (selected = null)}>
                        <div class="written">
                            <i>{d.text}</i>
                            <br />
                            <br />
                            <i> {d.name} </i>
                        </div>
                    </div>
                </div>
            {/await}
        {/if}
    </div>
</div>

<style>
    .container {
        /* position: absolute; */
        /* display: flex; */
        /* align-items: center; */
        /* justify-content: flex-end; */
        margin-top: 100px;
        /* width: 100%; */
        /* height: 100%; */
        /* top: 0; */
        /* left: 0; */
    }

    .phone {
        position: relative;
        display: flex;
        flex-direction: column;
        /* width: 52vmin;
        height: 76vmin; */
        width: 450px;
        height: 600px;
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
        grid-template-rows: repeat(4, 1fr);
        grid-gap: 10px;
    }

    button {
        width: 100%;
        height: 100%;
        color: white;
        font-size: 24px;
        border: none;
        border-radius: 5px;
        margin: 0;
        will-change: transform;
    }

    .photo,
    img {
        position: absolute;
        /* top: 0;
        left: 0; */
        width: 100%;
        height: 100%;
        border-radius: 5px;
        overflow: hidden;
    }

    .photo {
        display: flex;
        align-items: stretch;
        justify-content: flex-end;
        flex-direction: column;
        will-change: transform;
    }

    img {
        filter: blur(3px);
        object-fit: cover;
        cursor: pointer;
    }

    .brief {
        text-align: center;
        width: 100%;
        height: 100%;
        /* font-size: 2.5vmin; */
        margin: 0;
        opacity: 0.8;
        background: rgba(0, 0, 0, 0.8);
    }

    .written {
        font-weight: bold;
        color: white;
        padding: 32px;
    }
</style>
