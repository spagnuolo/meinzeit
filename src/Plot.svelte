<script>
    import { scaleLinear, scaleLog } from "d3-scale";
    import points from "./data.js";

    const yTicks = [0.000001, 0.00001, 0.0001, 0.001, 0.01, 0.1, 1, 10, 100];
    const xTicks = [2015, 2020, 2025, 2030];
    const padding = { top: 20, right: 15, bottom: 20, left: 45 };

    let width = 550;
    let height = 300;

    $: xScale = scaleLinear()
        .domain([minX, maxX])
        .range([padding.left, width - padding.right]);

    $: yScale = scaleLog()
        .domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
        .range([height - padding.bottom, padding.top]);

    $: minX = points.crash[0].x;
    $: maxX = points.crash[points.crash.length - 1].x;
    $: path0 = `M${points.crash
        .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
        .join("L")}`;
    $: path1 = `M${points.injurie
        .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
        .join("L")}`;
    $: path2 = `M${points.death
        .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
        .join("L")}`;
    $: path3 = `M${points.google
        .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
        .join("L")}`;
    $: path4 = `M${points.uber
        .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
        .join("L")}`;
    $: path5 = `M${points.gm
        .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
        .join("L")}`;
    $: path6 = `M${points.vw
        .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
        .join("L")}`;
    $: path7 = `M${points.apple
        .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
        .join("L")}`;
    // $: area = `${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;

    function formatMobile(tick) {
        return "'" + tick.toString().slice(-2);
    }
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
    <svg>
        <!-- y axis -->
        <g class="axis y-axis" transform="translate(0, {padding.top})">
            {#each yTicks as tick}
                <g
                    class="tick tick-{tick}"
                    transform="translate(0, {yScale(tick) - padding.bottom})"
                >
                    <line x2="100%" />
                    <text y="-4"
                        >{tick}
                        {tick === 100 ? " Events pro 1000 km" : ""}</text
                    >
                </g>
            {/each}
        </g>

        <!-- x axis -->
        <g class="axis x-axis">
            {#each xTicks as tick}
                <g
                    class="tick tick-{tick}"
                    transform="translate({xScale(tick)},{height})"
                >
                    <line y1="-{height}" y2="-{padding.bottom}" x1="0" x2="0" />
                    <text y="-2">{width > 380 ? tick : formatMobile(tick)}</text
                    >
                </g>
            {/each}
        </g>

        <!-- data -->
        <!-- <path class="path-area" d={area} /> -->
        <path class="path-line" d={path0} style="stroke: orange;" />
        <path class="path-line" d={path1} style="stroke: brown;" />
        <path class="path-line" d={path2} style="stroke: red;" />
        <path class="path-line" d={path3} style="stroke: green;" />
        <path class="path-line" d={path4} style="stroke: blue;" />
        <path class="path-line" d={path5} style="stroke: purple;" />
        <path class="path-line" d={path6} style="stroke: yellow;" />
        <path class="path-line" d={path7} style="stroke: black;" />
    </svg>
</div>

<style>
    .chart {
        width: 100%;
        max-width: 550px;
        max-height: 300px;
        margin-left: auto;
        margin-right: auto;
    }

    svg {
        position: relative;
        width: 100%;
        height: 300px;
        overflow: visible;
    }

    .tick {
        font-size: 0.725em;
        font-weight: 200;
    }

    .tick line {
        stroke: #aaa;
        stroke-dasharray: 2;
    }

    .tick text {
        fill: #666;
        text-anchor: start;
    }

    .tick.tick-0 line {
        stroke-dasharray: 0;
    }

    .x-axis .tick text {
        text-anchor: middle;
    }

    .path-line {
        fill: none;
        /* stroke: rgb(0, 100, 100); */
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 2;
    }

    .path-line:hover {
        fill: rgba(0, 0, 0, 0.2);
        stroke-width: 6;
    }

    .path-area {
        fill: rgba(0, 100, 100, 0.2);
    }
</style>
