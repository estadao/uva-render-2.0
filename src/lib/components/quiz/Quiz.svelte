<script>
    import CorrectAnswers from 'components/quiz/CorrectAnswers.svelte';
    import MostAnswered from 'components/quiz/MostAnswered.svelte';
    import PointsAnswered from 'components/quiz/PointsAnswered.svelte';    
    
    export let value;
    let tipo;
    $: tipo = value.tipo;
</script>

{#if tipo === 'perguntas'}
    <CorrectAnswers {value} />
{:else if tipo === 'pontos'}
    <MostAnswered {value} />
{:else if tipo === 'peso'}
    <PointsAnswered {value} />
{/if}