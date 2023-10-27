<script>
    import { onMount, afterUpdate } from 'svelte';

    export let voteSummary = { data: {}, startPositions: {} };
    export let barChartElement;
    export let totalVotes;
    export let filteredData = [];

    let barChartWidth = [];
    let visibleCategories;
    let anyCategoryVisible;
    let filtersApplied;

    const categoriesOrder = [
        'A favor',
        'A favor com ressalvas',
        'Não foi encontrado',
        'Não quis responder',
        'Não foi contactado',
        'Contra'
    ];

    function xScale(value) {
        return totalVotes === 0 ? 0 : (value * 100) / totalVotes;
    }

    function updateStartPositions() {
        let startPos = 0;
        for (const vote of categoriesOrder) {
            const count = voteSummary.data[vote] || 0;
            voteSummary.startPositions[vote] = startPos;
            startPos += xScale(count);
        }
    }

    function updateVisibleCategories() {
        visibleCategories = categoriesOrder.filter((category) => {
            return filteredData.some((row) => row['intenção de voto'] === category);
        });
        anyCategoryVisible = visibleCategories.some(vote => voteSummary.data[vote] > 0);
        filtersApplied = filteredData.length < 81;
    }

    function voteClass (vote) {
        return vote === 'A favor' ? 'afavor' : 
            vote === 'A favor com ressalvas' ? 'afavor-com-ressalvas' : 
            vote === 'Não foi encontrado' ? 'nao-foi-encontrado' : 
            vote === 'Não quis responder' ? 'nao-quis-responder' :
            vote === 'Não foi contactado' ? 'nao-foi-contactado' : 
            vote === 'Contra' ? 'contra' :  
            '';
    }

    function getBarChartWidth() {
    if (barChartWidth && window.innerWidth > 740) {
        const labels = document.querySelectorAll('.label');
        const naoEncontrado = document.querySelectorAll('.label.nao-foi-encontrado');
        const comRessalvas = document.querySelectorAll('.label.afavor-com-ressalvas');
        labels.forEach((label, index) => {
            const bar = label.parentElement;
            const barWidth = bar.clientWidth;
            const vote = categoriesOrder[index];
            
            if (barWidth < 65 && vote !== 'A favor' && vote !== 'Contra') {
                label.style.display = 'none';
            } else if (barWidth < 11 && vote === 'A favor') {
                naoEncontrado.forEach((naoEncontradoBar) => {
                    naoEncontradoBar.style.marginLeft = '35px';
                });

            } else if (barWidth > 11 && vote === 'A favor') {
                naoEncontrado.forEach((naoEncontradoBar) => {
                    naoEncontradoBar.style.marginLeft = '0';
                });
            
            } else {
                label.style.display = 'block';
            }
        });
    }
}





    $: if (voteSummary.data && filteredData.length > 0) {
        totalVotes = Object.values(voteSummary.data).reduce((a, b) => a + b, 0);
        updateStartPositions();
        updateVisibleCategories();
        getBarChartWidth();
    }

    $: if (filteredData.length === 0) {
        visibleCategories = [];
        anyCategoryVisible = false;
        getBarChartWidth();
    }

    onMount(() => {
        updateStartPositions();
        updateVisibleCategories();
        getBarChartWidth();
    });

    afterUpdate(() => {
        getBarChartWidth();
    });
</script>

<div bind:this={barChartElement} class="uva-container-scoreboard">
    <div class="uva-scoreboard-chart G">
        {#if !filtersApplied}
            <div class="bar-divider"></div>
        {/if}
        {#if anyCategoryVisible}
            {#each categoriesOrder as vote, index}
                {#if visibleCategories.includes(vote)}
                    <div class='bar {voteClass(vote)}' style="width: {xScale(voteSummary.data[vote])}%; left: {voteSummary.startPositions[vote]}%;" bind:this={barChartWidth[index]}>
                        <div class='label {voteClass(vote)}' style='{vote === "Contra" ? "right: 0;" : ""}'>
                            <div class='count {vote === 'A favor' ? 'count-large' :  vote === 'Contra' ? 'count-large' : ''}' style= '{vote === 'A favor com ressalvas' || vote === 'Não foi encontrado' || vote === 'Não quis responder' ? 'margin-bottom: -12px;' : ''}{vote === 'Contra' ? 'text-align: right' : ''}'>
                                {vote === 'A favor' ? (voteSummary.data[vote] || 0) + (voteSummary.data['A favor com ressalvas'] || 0) : (voteSummary.data[vote] || 0)}
                            </div>
                            <div class='vote' style= '{vote === 'A favor com ressalvas' || vote === 'Não foi encontrado' || vote === 'Não quis responder' ? 'margin-bottom: -17px;' : vote === 'Contra' ? 'margin-bottom: 25px;' : ''}'>
                                {vote === 'A favor' ? 'A favor *' : vote === 'A favor com ressalvas' ? 'A favor com ressalvas' : vote === 'Não foi encontrado' ? 'Não foi encontrado' : vote === 'Não quis responder' ? 'Não quis responder' : vote === 'Não foi contactado' ? 'Não foi contactado' : vote === 'Contra' ? 'Contra' : ''}
                            </div>
                            <div class='uva-vote-icon {voteClass(vote)}'></div>
                        </div>
                    </div>
                {/if}
            {/each}
        {:else}
            <div class="uva-bar no-category-bar"></div>
            <div class="uva-label no-category-label">Nenhum dado encontrado</div>
        {/if}
    </div>
    <div class='uva-container-footnote G'>
        <div>* Somados votos a favor e a favor com ressalvas</div>
        <div><img class='uva-image-placar-brand' src='https://arte.estadao.com.br/arc/images/placar/placar-brand.svg' alt='Placar Estadão' width='92px' height='13px'></div>
    </div>
    <div class='uva-container-footer-mobile G'>
        <img loading='lazy' src='https://arte.estadao.com.br/arc/images/placar/placar-afavor-com-ressalvas.svg' alt='A favor com ressalvas' width='12px' height='12px' style='display: inline; margin-right:3px; margin-top:13px'/> Com ressalvas{#if voteSummary.data['A favor com ressalvas'] > 0}: {voteSummary.data['A favor com ressalvas']}{/if}
        <img loading='lazy' src='https://arte.estadao.com.br/arc/images/placar/placar-nao-foi-encontrado.svg' alt='Não foi encontrado' width='12px' height='12px' style='display: inline; margin: 3px 3px 0px 5px;'/> Não foi encontrado{#if voteSummary.data['Não foi encontrado'] > 0}: {voteSummary.data['Não foi encontrado']}{/if}
        <img loading='lazy' src='https://arte.estadao.com.br/arc/images/placar/placar-nao-quis-responder.svg' alt='Não quis responder' width='12px' height='12px' style='display: inline; margin: 0px 3px 0px 5px;'/> Não quis responder{#if voteSummary.data['Não quis responder'] > 0}: {voteSummary.data['Não quis responder']}{/if}
    </div>
</div>

<style>
    .uva-container-scoreboard {
        position: sticky;
        top: 45px;
        z-index: 10;
        margin: 0 auto;
        padding: 0 0 calc(var(--margem-vertical) * 1.8) 0; 
        background-color: var(--cor-fundo);
        width: 100%;
        max-width: 1054px;
        height: 103px;
        /* overflow: hidden; */
        /* left: 50%; */
        /* transform: translateX(-50%); */
        box-sizing: content-box;
    }
    
    .uva-scoreboard-chart {
        position: relative;
        white-space: nowrap;
        display: flex;
        align-items: flex-end;
        height:100%;
    }

    /* ***** */
    .label {
        position: absolute;
        color: black;
        font-size: 14px;
        line-height: 16px;
        font-family: var(--condensed);
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        bottom: 30px;
        /* width: 0; */
    }

    .count {
        font-size: 22px;
        /* margin-bottom: -28px; */
    }

    .count-large {
        font-size: calc((var(--corpo-mobile) * 1.3));
        margin-bottom: 5px;
    }
    
    .vote {
        text-transform: uppercase;
        letter-spacing: 0.03rem;
    }

    .bar {
        position: absolute;
        height: 20px;
        bottom: 0;
    }

    .bar-divider {
        position: absolute;
        width: 1px;
        height: 40px;
        left: 50%;
        top: 80;
        transform: translate(-50%, 0px);
        background-color: var(--cor-texto);
        z-index: 1;
    }

    .bar-divider:after {
        content: '41 votos necessários';
        font: 400 calc(var(--corpo-mobile) * 0.6) / calc(var(--entrelinha-mobile) * 0.6) var(--condensed);
        text-transform: uppercase;
        letter-spacing: 0.03rem;
        color: var(--cor-texto);
        position: absolute;
        width: 1px;
        right: 50%;
        bottom: 0;
        transform: translate(-52px, -44px);
        z-index: 1;
    }
    /* ***** */

    /* A favor */
    .bar.afavor {
        background-color:#007367;
        /* height: 20px; */
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        box-shadow: var(--sombra-leve);
    }

    .label.afavor {
        color: #007367;
    }

    .uva-vote-icon.afavor {
        background-image: url(https://arte.estadao.com.br/arc/images/placar/placar-afavor.svg);
        background-size: contain;
        background-repeat: no-repeat;
        width: 19px;
        height: 19px;
        margin-top: 6px;
    }
    /* ***** */

    /* A favor com ressalvas */
    .bar.afavor-com-ressalvas {
        background-color:#007367;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 10 10'%3E%3Cpath d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='white' stroke-width='1.4' stroke-linecap='square'/%3E%3C/svg%3E");
        /* height: 20px; */
        box-shadow: var(--sombra-leve);
    }

    .label.afavor-com-ressalvas {
        display: none;
        color: #007367;
        word-break: break-word;
        white-space: pre-wrap;
        width: 80px;
        max-width: 90px;
        line-height: 17px;
        /* bottom: 12px; */
    }

    .uva-vote-icon.afavor-com-ressalvas {
        background-image: url(https://arte.estadao.com.br/arc/images/placar/placar-afavor-com-ressalvas.svg);
        background-size: contain;
        background-repeat: no-repeat;
        width: 19px;
        height: 19px;
        margin-top: 6px;
    }
    /* ***** */

    /* Não foi contactado */
    .bar.nao-foi-contactado {
        background-color: var(--cor-terciaria);
        /* height: 20px; */
        border-left: 2px solid var(--cor-fundo);
    }
    /* ***** */

    /* Não foi encontrado, Não quis responder, não foi encontrado */
    .bar.nao-foi-encontrado {
        background-color:#d5d5d5;
        /* height: 20px; */
        border-left: 2px solid var(--cor-fundo);
        box-shadow: var(--sombra-leve);
    }

    .bar.nao-quis-responder {
        background-color:#838383;
        /* height: 20px; */
        border-left: 2px solid var(--cor-fundo);
        box-shadow: var(--sombra-leve);
    }

    .label.nao-foi-encontrado, .label.nao-quis-responder, .label.nao-foi-contactado {
        display: none;
        /* word-break: break-word; */
        white-space: pre-wrap;
        width: fit-content;
        max-width: 90px;
        line-height: 17px;
        /* bottom: 12px; */
        /* padding-left: 30px; */
    }

    /* .label.nao-quis-responder {
        max-width: 140px;
    } */

    /* .label.nao-foi-encontrado {
        padding-left:75px;
    } */

    .uva-vote-icon.nao-foi-encontrado {
        background-image: url(https://arte.estadao.com.br/arc/images/placar/placar-nao-foi-encontrado.svg);
        background-size: contain;
        background-repeat: no-repeat;
        width: 17px;
        height: 17px;
        margin-top: 6px;
    }

    .uva-vote-icon.nao-quis-responder {
        background-image: url(https://arte.estadao.com.br/arc/images/placar/placar-nao-quis-responder.svg);
        background-size: contain;
        background-repeat: no-repeat;
        width: 17px;
        height: 17px;
        margin-top: 6px;
    }
    /* ***** */

    /* Contra */
    .bar.contra {
        background-color:#c20736;
        height: 20px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-left: 2px solid var(--cor-fundo);
        box-shadow: var(--sombra-leve);
    }

    .label.contra{
        color: #c20736;
        align-items: flex-end;
        /* padding-bottom: 25px; */
    }

    .uva-vote-icon.contra {
        position: absolute;
        right: 0;
        bottom: 0;
        background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.1 19.1"%3E%3Cpolygon points="17.4,4.4 14.6,1.6 9.5,6.7 4.4,1.6 1.6,4.4 6.7,9.5 1.6,14.6 4.4,17.4 9.5,12.3 14.6,17.4 17.4,14.6 12.3,9.5"  fill="%23c20736"/%3E%3C/svg%3E');
        background-size: contain;
        background-repeat: no-repeat;
        width: 19px;
        height: 19px;
        margin-top: 6px;
    }
    /* ***** */

    /* ***** */
    .uva-container-footnote {
        display: flex; 
        justify-content: space-between; 
        padding-top: 8px;
        font: 400 calc(var(--corpo-mobile) * 0.5) / calc(var(--entrelinha-mobile) * 0.5) var(--condensed);
        text-transform: uppercase;
        letter-spacing: 0.03rem;
        color: var(--cor-texto);
    }

    .uva-image-placar-brand {
        width:auto;
        height: 11px;
        filter: grayscale(100%);
        opacity: 0.5;
    }

    .uva-container-footer-mobile {
        display: block;
        font: 400 calc(var(--corpo-mobile) * 0.5) / calc(var(--entrelinha-mobile) * 0.5) var(--condensed);
        text-transform: uppercase;
        letter-spacing: 0.03rem;
        color: var(--cor-texto);
        margin-top: -9px;
    }

    .no-category-bar {
        background-color: var(--cor-terciaria);
        width: 100%;
        height: 20px;
        border-radius: 4px;
    }

    .no-category-label {
        position: absolute;
        top: 55px;
        left: 0;
        font: 500 calc(var(--corpo-mobile) * 0.8) / calc(var(--entrelinha-mobile) * 0.8) var(--condensed);
        text-transform: uppercase;
        letter-spacing: 0.03rem;
        color: var(--cor-texto);
    }

    @media (min-width:740px) {
        /* desktop */
        .uva-container-scoreboard {
            padding: calc(var(--margem-vertical) * 0.5) 0 calc(var(--margem-vertical) * 2) 0; 
            height: 106px;
        }

        .count-large {
            font-size: calc((var(--corpo-desktop) * 2));
            margin-bottom: 17px;
        }
        
        .bar-divider {
            position: absolute;
            width: 1px;
            height: 30px;
            left: 50%;
            top: 80;
            transform: translate(-50%, 10px);
            background-color: var(--cor-texto);
            z-index: 1;
        }

        .bar-divider:after {
            content: '41 votos necessários';
            font: 400 calc(var(--corpo-mobile) * 0.6) / calc(var(--entrelinha-mobile) * 0.6) var(--condensed);
            text-transform: uppercase;
            letter-spacing: 0.03rem;
            color: var(--cor-texto);
            position: absolute;
            width: 1px;
            left: 50%;
            bottom: 0;
            transform: translate(-52%, 19px);
            z-index: 1;
        }

        .uva-container-footnote {
            padding-top: 15px;
            font: 400 calc(var(--corpo-desktop) * 0.5) / calc(var(--entrelinha-desktop) * 0.5) var(--condensed);
        }

        .uva-image-placar-brand {
            height: 15px;
        }

        .uva-container-footer-mobile {
            display: block;
            font: 400 calc(var(--corpo-desktop) * 0.5) / calc(var(--entrelinha-desktop) * 0.5) var(--condensed);
        }
    }

    @media (min-width: 740px) {
        .label.nao-foi-encontrado, .label.nao-quis-responder, .label.afavor-com-ressalvas{
            display: block;
        }
    }
</style>