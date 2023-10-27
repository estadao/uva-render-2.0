<script>
    import UvaRepositorioMediaOnce from 'components/observer/Uva-repositorio-media-once.svelte';
    import Audio from 'components/audios/Audio.svelte';
    export let value;
    const { id, fonte } = value;
    const tamanho = 'P';
</script>
<UvaRepositorioMediaOnce {id} {tamanho}>
    <Audio {value} {fonte} />
    <placeholder slot='placeholder'>
        <p>Carregando o áudio...</p>
    </placeholder>
</UvaRepositorioMediaOnce>