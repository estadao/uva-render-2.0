<script>
    import { onMount } from 'svelte';
    import AudioContainer from 'components/audios/AudioContainer.svelte';
    import Button from 'components/buttons/Button.svelte';
    import ImageContainer from 'components/images/ImageContainer_responsive.svelte';
    import YoutubeContainer from 'components/videos/YoutubeContainer.svelte';

    export let value;
    let score = 0;
    let showExplanation = false;
    let showScore = false;
    let isCorrect;

    const { perguntas } = value;
    const questions = [];

    perguntas.forEach((item) => {
        if(item.type === 'pergunta') {
            questions.push({
                pergunta: item.value,
                alternativas: [],
                resposta: null,
            });
        } else if (item.type == 'audio') {
            questions[questions.length - 1].audio = item.value;
        } else if (item.type === 'imagem') {
            questions[questions.length - 1].imagem = item.value;
        } else if (item.type === 'youtube') {
            questions[questions.length - 1].youtube = item.value;
        } else if (item.type === 'alternativas') {
            questions[questions.length - 1].alternativas = item.value.map((alt, index) => ({
                texto: alt,
                peso: index + 1,
            }));
        } else if (item.type === 'resposta') {
            questions[questions.length - 1].resposta = item.value;
        } else if (item.type === 'explicação') {
            questions[questions.length - 1].explicacao = item.value;
        }
    });
    
    function handleClick(event) {
        const target = event.target;
        if (!target) return;

        target.classList.add('selected');

        const button = target.closest('.uva-quiz-button');
        if (!button) return;

        const questionContainer = button.closest('.uva-quiz-container-question');
        if (!questionContainer) return;

        const buttons = questionContainer.querySelectorAll('.uva-quiz-button');
        buttons.forEach(b => b.disabled = true);

        const questionNumber = questionContainer.dataset.question;
        const questionIndex = parseInt(questionNumber) - 1;
        if (isNaN(questionIndex) || questionIndex < 0 || questionIndex >= questions.length) {
            console.error(`Índice de pergunta inválido: ${questionIndex}`);
            return;
        }

        const questionData = questions[questionIndex];
        if (!questionData) {
            console.error(`Pergunta ${questionIndex} não foi encontrada.`);
            return;
        }

        const questionAnswer = questionData.resposta;
        const alternativeSelected = button.textContent.trim();

        isCorrect = alternativeSelected === questionAnswer;

        if (isCorrect) {
            score++;
        } else {
            buttons.forEach(button => {
                if (button.textContent.trim() === questionAnswer) {
                    button.classList.add('correct');
                }
            });
        }

        button.classList.add(isCorrect ? 'correct' : 'incorrect');
        questionContainer.classList.remove('unanswered');
        questionContainer.classList.add('answered');

        showExplanation = true;
        showScore = true;
    }

    onMount(() => {
        const buttons = document.querySelectorAll('.uva-quiz-button');
        buttons.forEach(button => {
            button.addEventListener('click', handleClick);
        });
    });
</script>

<div class="uva-quiz-container">
    {#each questions as item, i}
        <div data-question={i + 1} class="uva-quiz-container-question unanswered">
            <div class="uva-quiz-counter P"> {i + 1} de {questions.length}</div>
            <h3 class="uva-quiz-question P">{@html item.pergunta}</h3>
            {#if item.audio}
                <AudioContainer value={item.audio} />
            {:else if item.imagem}
                <ImageContainer value={item.imagem} />
            {:else if item.youtube}
                <YoutubeContainer value={item.youtube} />
            {/if}

            {#each item.alternativas as item, i}
                <Button classe="uva-quiz-button P" value={item.texto} {handleClick} />
            {/each}

            {#if showExplanation && item.explicacao}
                {#if showScore}
                    <div class="uva-quiz-score P" style="color:var(--cor-{isCorrect ? 'correto' : 'incorreto'})">
                        {#if isCorrect}
                            Correto! 🎉🎉🎉
                        {:else}
                            Incorreto! 😢
                        {/if}
                        <span>Pontuação atual: {score}/{questions.length}</span>
                    </div>
                {/if}

                <div class='uva-quiz-explanation'>
                    {#each Object.keys(item.explicacao) as key}
                        {#if item.explicacao[key] && item.explicacao[key].type === 'text'}
                            <p class='P'>{@html item.explicacao[key].value}</p>
                        {:else if item.explicacao[key] && item.explicacao[key].type === 'audio'}
                            <AudioContainer value={item.explicacao[key].value} />
                        {:else if item.explicacao[key] && item.explicacao[key].type === 'imagem'}
                            <ImageContainer value={item.explicacao[key].value} />
                        {:else if item.explicacao[key] && item.explicacao[key].type === 'youtube'}
                            <YoutubeContainer value={item.explicacao[key].value} />
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .uva-quiz-counter::before {
        content: '';
        display: flex;
        margin-top: -0.8rem;
        padding-top: var(--margem-horizontal);
        border-top: var(--fio-pontilhado);
    }

    .uva-quiz-counter {
        margin-top: calc(var(--margem-vertical) * 2.2);
        padding-top: calc(var(--margem-vertical) * .2);
        border-top: var(--fio-pontilhado);
        font: 600 calc(var(--corpo-mobile) * 0.9)/calc(var(--entrelinha-mobile) * 1) var(--condensed);
        text-transform: uppercase;
        text-align: left;
        color: var(--cor-primaria);
    }

    .uva-quiz-counter::after {
        content: "";
        display: block;
        width: var(--filete);
        margin: 8px 0 calc(var(--margem-vertical) * 0.5) 0;
        border-bottom: var(--fio-solido-grosso);
        border-color: var(--cor-primaria);
    }

    :global(.uva-quiz-question, .uva-quiz-explanation > p) {
        margin: calc(var(--margem-vertical) * 1) auto;
        font: 400 calc(var(--corpo-mobile) * 1)/calc(var(--entrelinha-mobile) * 1) var(--semicondensed);
        text-align: left;
        color: var(--cor-texto);
    }

    :global(.uva-quiz-score) {
        display: flex;
        justify-content: space-between;
        margin-top: calc(var(--margem-vertical) * 1.25);
        font: 600 calc(var(--corpo-mobile) * 0.9)/calc(var(--entrelinha-mobile) * 0.9) var(--condensed);
        letter-spacing: 0.04rem;
        text-transform: uppercase;
    }

    :global(.uva-quiz-score > span) {
        font-size: 65%;
        text-transform: uppercase;
        border: var(--borda-fina);;
        border-radius: 4px;
        padding: 0px 16px 0px 16px;
        background-color: var(--cor-fundo);
        color: var(--cor-texto);
        box-shadow: var(--sombra-leve);
    }
    
    :global(.uva-quiz-button) {
        margin: 0.5rem auto;
        transition-property: padding, background-color;
        background-color: var(--cor-secundaria);
        background-size: 15px 15px;
        background-position: calc(100% - 20px) 15px;
        background-repeat: no-repeat;
        color: var(--cor-fundo);
    }

    :global(.uva-quiz-button:hover) {
        background-color: var(--cor-primaria);
    }

    :global(.uva-quiz-button:disabled) {
        color: #b4b3b3;
        cursor: default;
        background-color: #f2f2f2;
    }

    :global(.uva-quiz-button.correct) {
        background-image: url(https://arte.estadao.com.br/arc/images/quiz-correta.svg);
        color: var(--cor-correto);
    }

    :global(.uva-quiz-button.selected.correct) {
        background-color: var(--cor-correto);
        background-image: url(https://arte.estadao.com.br/arc/images/quiz-correta.svg);
        color: var(--cor-fundo);
    }

    :global(.uva-quiz-button.selected.incorrect) {
        background-color: var(--cor-incorreto);
        background-image: url(https://arte.estadao.com.br/arc/images/quiz-incorreta.svg);
        color: var(--cor-fundo);
    }

    :global(.uva-quiz-youtube) {
        position:relative;
        padding-bottom:56.25%;
        height:0;
        overflow:hidden;
        margin: calc(var(--margem-vertical) * 2) auto;
        background-color: var(--cor-texto);
        border-radius: 6px;
        box-shadow: var(--sombra-forte);
    }

    :global(.uva-quiz-youtube > iframe) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    @media (min-width:740px) { /* Desktop */
        :global(.uva-quiz-question, .uva-quiz-explanation > p) {
            font-size: calc(var(--corpo-desktop) * 1);
            line-height: calc(var(--entrelinha-desktop) * 1);
        }
    }
</style>