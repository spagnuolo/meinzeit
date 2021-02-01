<script>
    export let focus = 0;

    let panels = [
        { active: false, url: "img/01.jpg", title: "Titel? und BILD" },
        {
            active: false,
            url: "img/02.jpg",
            title: "Alles rund um das autonome Auto",
        },
        { active: false, url: "img/writting.jpg", title: "Meinungsbild" },
        { active: false, url: "img/03.jpg", title: "Fazit und BILD" },
    ];

    panels[focus].active = true;

    function handleClick(index) {
        console.log("click on panel ", index);
        panels[focus].active = false;
        panels[index].active = true;
        focus = index;
    }
</script>

<div class="gallery">
    {#each panels as { active, url, title }, i}
        <div
            class="panel {active}"
            style="background-image: url({url})"
            on:click={() => handleClick(i)}
        >
            <h3>{title}</h3>
        </div>
    {/each}
</div>

<style>
    .gallery {
        display: flex;
        height: 100%;
    }

    .panel {
        position: relative;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        filter: grayscale(80%);
        height: 100%;
        border-radius: 5px;
        color: #ffffff;
        cursor: pointer;
        flex: 0.5;
        margin: 0 10px 0 10px;
        transition: all 300ms ease-in;
    }

    .panel:hover {
        transform: scale(0.95);
    }

    .panel h3 {
        font-size: 24px;
        text-shadow: 0 0 4px black;
        position: absolute;
        bottom: 20px;
        left: 20px;
        margin: 0;
        opacity: 0;
    }

    .panel.true {
        flex: 3;
    }

    .panel.true h3 {
        opacity: 1;
        transition: opacity 0.3s ease-in 0.4s;
    }
</style>
