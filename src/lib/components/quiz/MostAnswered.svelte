<script>
    import { onMount } from 'svelte';
    import AudioContainer from 'components/audios/AudioContainer.svelte';
    import Button from 'components/buttons/Button.svelte';
    import ImageContainer from 'components/images/ImageContainer_responsive.svelte';
    import YoutubeContainer from 'components/videos/YoutubeContainer.svelte';

    let alternativas = [];
    let selectedOption = {};
    let counts = {};
    let questions = [];
    let showResetButton = false;
    let showResults = true;
    let maxOption = '';
    let noMaxOption = false;
    let respostaMaisVotada = null;
    let nenhumResultado = '';
    let perguntaAtual = {};
    
    export let value;
    const {
        botão1,
        botão2,
        perguntas,
    } = value;

    const respostas = perguntas.find(item => item.type === 'respostas').value;
    nenhumResultado = respostas.find(item => item.type === 'empate').value;
    
    perguntas.forEach((item) => {
        if (item.type === "pergunta") {
            perguntaAtual.pergunta = item.value;
        } else if (item.type === "audio") {
            perguntaAtual.audio = item.value;
        } else if (item.type === "imagem") {
            perguntaAtual.imagem = item.value;
        } else if (item.type === "youtube") {
            perguntaAtual.youtube = item.value;
        } else if (item.type === "alternativas") {
            perguntaAtual.alternativas = item.value;
        } else if (item.type === "opções") {
            perguntaAtual.options = item.value;
            questions.push({ ...perguntaAtual });
            perguntaAtual = {};
        }
    });

    function handleClick() {
        if (showResults && alternativas.length === questions.length) {
            countOptions();
            showResetButton = true;
            showResults = false;
            if (maxOption && respostas) {
                respostaMaisVotada = respostas.find(resposta => resposta.type === maxOption);
            }
        } else {
            resetQuiz();
        }
    }

    function resetQuiz() {
        alternativas = [];
        counts = {};
        selectedOption = {};
        showResetButton = false;
        showResults = true;
        maxOption = '';
        noMaxOption = false;
        countOptions();
    }

    function countOptions() {
        counts = {};
        alternativas.forEach(answer => {
            const selectedOption = answer.selectedOption.charAt(0);
            counts[selectedOption] = (counts[selectedOption] || 0) + 1;
        });

        const maxCount = Math.max(...Object.values(counts));
        const maxOptions = Object.keys(counts).filter(option => counts[option] === maxCount);
            if (maxOptions.length === 1) {
                maxOption = maxOptions[0];
                noMaxOption = false;
            } else {
                maxOption = '';
                noMaxOption = true;
            }
    }

    function handleOptionChange(i, option) {
        selectedOption[i] = option;
        const answerIndex = alternativas.findIndex(answer => answer.i === i);
        if (answerIndex !== -1) {
            alternativas[answerIndex].selectedOption = option;
        } else {
            alternativas.push({ i, selectedOption: option });
        }
    }

    onMount(() => {
        countOptions();
    });
</script>

<div class='uva-quiz-container'>
    {#each questions as item, i}
        <div data-question={i + 1}>
            <h3 class='uva-quiz-question'>{@html item.pergunta}</h3>
            {#if item.audio}
                <AudioContainer value={item.audio} />
            {:else if item.imagem}
                <ImageContainer value={item.imagem} />
            {:else if item.youtube}
                <YoutubeContainer value={item.youtube} />
            {/if}
            <div class="uva-quiz-container-alternatives">
                {#each item.options as option}
                    <label>
                        <input
                            type="radio"
                            name={`pergunta-${i + 1}`}
                            value={`resposta-${i + 1}`}
                            on:change={() => handleOptionChange(i, option)}
                            checked={selectedOption[i] === option}
                        />
                        <span>{item.alternativas[item.options.indexOf(option)]}</span>
                    </label>
                {/each}
            </div>

            
        </div>
    {/each}
    {#if (showResults && alternativas.length === questions.length) || showResetButton}
        <div class='uva-quiz-button-container'>
            <Button
                classe='uva-quiz-button' 
                {handleClick}
                value={ showResults ? botão1 : botão2 }
            />
        </div>
    {/if}

    {#if Object.keys(counts).length > 0 && !showResults}
        <div class='uva-quiz-container-result'>
            {#if maxOption !== '' && !noMaxOption && respostaMaisVotada !== null}
                <div>{@html respostaMaisVotada.value}</div>
            {/if}

            {#if noMaxOption}
                <div>{@html nenhumResultado}</div>
            {/if}
        </div>
    {/if}
</div>

<style>
    label {
        display: flex;
        align-items: baseline;
        margin-bottom: calc(var(--margem-vertical) * 0.25);
        cursor: pointer;
    }

    .uva-quiz-question::before {
        content: "";
        position: absolute;
        width: var(--filete);
        margin: -14px 0 0 0;
        border-top: var(--fio-solido-fino);
        border-color: var(--cor-primaria);
    }

    .uva-quiz-question {
        width: var(--largura-celular);
        max-width: var(--P);
        margin: calc(var(--margem-vertical) * 2) auto calc(var(--margem-vertical) * 0.5) auto;
        font: 700 var(--corpo-mobile) / var(--entrelinha-mobile) var(--texto);
        color: var(--texto);
    }

    input[type=radio] {
        position: relative;
        cursor: pointer;
        margin: 0px 20px 4px -5px;
        box-sizing: content-box;
        transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    input[type=radio]:before {
        content: "";
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        top: -6px;
        left: 0px;
        background-color: var(--cor-fundo);
        border: 2px solid var(--cor-secundaria);
        border-radius: 50%;
        transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    input[type=radio]:checked:before {
        content: "";
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        top: -6px;
        left: 0px;
        background-color:var(--cor-texto);
        border: 2px solid var(--cor-texto);
        border-radius: 50%;
        transform: scale(1.3);
        transition: background-color 0.5s ease, border-color 0.5s ease;
    }
    
    input[type=radio]:checked:after {
        content: "";
        display: block;
        width: 3px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        position: absolute;
        top: 0px;
        left: 10px;
        opacity: 1;
        transition: opacity 0.3s ease;
    }

    input[type=radio]:checked:before:hover {
        background-color: var(--cor-primaria-hover);
        border-color: var(--cor-primaria-hover);
    }

    input[type=radio]:hover:before {
        border-color: var(--cor-secundaria-hover);
    }

    .uva-quiz-container-alternatives {
        display: flex;
        flex-direction: column;
        width: var(--largura-celular);
        max-width: var(--P);
        margin: 0 auto calc(var(--margem-vertical) * 1.5) auto;
    }

    .uva-quiz-container {
        margin: 0 auto calc(var(--margem-vertical) * 1.5) auto;
        font: 500 var(--corpo-mobile) / var(--entrelinha-mobile) var(--texto);
        color: var(--texto);
        text-align: left;
    }

    .uva-quiz-button-container {
        display: flex;
        justify-content: center;
        margin: calc(var(--margem-vertical) * 1.5) auto calc(var(--margem-vertical) * 1.5) auto;
    }

    :global(.uva-quiz-button) {
        background-color: var(--cor-primaria);
        color: var(--cor-fundo);
        transition: all .35s ease-out;
    }

    :global(.uva-quiz-button:hover) {
        background-color: var(--cor-secundaria);
    }

    .uva-quiz-container-result {
        width: var(--largura-celular);
        max-width: var(--P);
        margin: 0 auto calc(var(--margem-vertical) * 1.5) auto;
        text-align: left;
        background-color: var(--cor-texto);
        border-radius: 6px;
        box-shadow: var(--sombra-leve);
    }
    .uva-quiz-container-result > div {
        padding: calc(var(--margem-vertical) * 1.5);
        font: 800 var(--corpo-mobile) / var(--entrelinha-mobile) var(--texto);
        color: var(--cor-fundo);
    }

    @media (min-width: 740px) {
        .uva-quiz-container {
            font-size: var(--corpo-desktop);
            line-height: var(--entrelinha-desktop);
            margin-bottom: calc(var(--margem-vertical) * 0.5);
        }

        .uva-quiz-question {
            font: 700 var(--corpo-desktop) / var(--entrelinha-desktop) var(--texto);
        }
    }
</style>