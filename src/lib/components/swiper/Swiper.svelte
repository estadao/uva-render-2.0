<script>
    import { onMount } from 'svelte';
    import Swiper, { Pagination, Autoplay } from 'swiper';
    import UvaContainer from 'components/charts/UvaContainer.svelte';
    import ImageContainer from "components/images/ImageContainer_responsive.svelte";
    import Text from "components/texts/Text.svelte";
    import { boolean } from "scripts/boolean.js";
    import 'swiper/swiper-bundle.css';
    let swiper;
    export let value;

    const {
        autoplay,
        conteúdo,
        classe,
        id,
        tamanho,
        tamanho_fundo,
        mostrar_ícone
    } = value;
    const cards = conteúdo.filter(item => item.type === "card");
    const showIcon = boolean(mostrar_ícone);

    const autoPlayConfig = (autoplay === {autoplay}) ? false : {
        delay: autoplay.delay ? autoplay.delay : 5000,
        disableOnInteraction: autoplay.disableOnInteraction ? autoplay.disableOnInteraction : false
    };

    onMount(async () => {
        Swiper.use([Pagination, Autoplay]);
        swiper = new Swiper(`#${id}`, {
            loop: false,
            autoplay: autoPlayConfig,
            pagination: {
                el: `#${id} .swiper-pagination`,
                dynamicBullets: true,
                clickable: false,
                renderBullet: function (index, className) {
                    return `<span class="${className}" data-index="${index}"></span>`;
                }
            },
            on: {
                slideChange: function () {
                    swiper.autoplay.stop();
                    //if slide is the first
                    if (this.activeIndex === 0) {
                        const firstBullet = document.querySelector(`#${id} .swiper-pagination-bullet[data-index="0"]`);
                        const bullets = document.querySelectorAll(`#${id} .swiper-pagination-bullet:not([data-index="0"])`);
                        bullets.forEach(bullet => {
                            bullet.classList.remove('swiper-pagination-bullet-active');
                        });
                        if (firstBullet) {
                            firstBullet.classList.add('swiper-pagination-bullet-active');
                        }
                    }
                    //if slide is the last
                    if (this.activeIndex === this.slides.length - 1) {
                        const lastBullet = document.querySelector(`#${id} .swiper-pagination-bullet[data-index="${this.slides.length - 1}"]`);
                        const bullets = document.querySelectorAll(`#${id} .swiper-pagination-bullet:not([data-index="${this.slides.length - 1}"])`);
                        bullets.forEach(bullet => {
                            bullet.classList.remove('swiper-pagination-bullet-active');
                        });
                        if (lastBullet) {
                            lastBullet.classList.add('swiper-pagination-bullet-active');
                        }
                    }
                    //if slide is active and not the first or last
                    if (this.activeIndex !== 0 && this.activeIndex !== this.slides.length - 1) {
                        const bullets = document.querySelectorAll(`#${id} .swiper-pagination-bullet`);
                        bullets.forEach(bullet => {
                            bullet.classList.remove('swiper-pagination-bullet-active');
                        });
                        const activeBullet = document.querySelector(`#${id} .swiper-pagination-bullet[data-index="${this.activeIndex}"]`);
                        if (activeBullet) {
                            activeBullet.classList.add('swiper-pagination-bullet-active');
                        }
                    }
                },
                slideChangeTransitionEnd: function () {
                    swiper.autoplay.start();
                }
            }
        });
    });

</script>

<div id={id} class='uva-swiper-container {classe} {tamanho}'>
    <div class="swiper-wrapper">
        {#each cards as item, index}
            <div class="swiper-slide" data-index={index}>
                <!-- ===== -->
                {#if item.value.uva}
                    <div style='margin:-48px 0; pointer-events: none'>
                        <UvaContainer value={{
                            classe: item.value.classe, 
                            fonte: item.value.uva,
                            showTitle: false,
                            showDescription: false,
                            showBrand: false
                        }} />
                    </div>
                {/if}
                <!-- ===== -->
                {#if item.value.imagemDesk}
                    <ImageContainer value={{
                        classe: item.value.classe, 
                        fonte: window.innerWidth > 580 ? item.value.imagemDesk : item.value.imagemMobile ,
                        legenda: item.value.legenda
                    }} />
                {/if}
                <!-- ===== -->
                {#if item.value.texto}
                    <Text value={item.value.texto} />
                {/if}
                <!-- ===== -->
            </div>
        {/each}
    </div>
    <div class="swiper-pagination {id}-swiper-pagination"></div>
</div>

{#if showIcon}
    <div class="swiper-icon">
        <img src='https://arte.estadao.com.br/arc/images/hand_seta.webp' alt='arraste para ler'>
        <div>Arraste para ler</div>
    </div>
{/if}

<style>
    .uva-swiper-container {
        margin:calc(var(--margem-vertical) * 2) auto calc(var(--margem-vertical) * 1.2) auto;
        overflow: hidden;
        cursor: grab;
        max-height: 82vh;
    }

    :global(.swiper-pagination-bullet-active) {
        background-color: var(--cor-primaria);
        opacity: 1;
    }

    .swiper-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        font: 700 calc(var(--corpo-desktop) * 0.6) var(--condensed), sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .swiper-icon img {
        width:30px; 
        height: 30px; 
        margin: auto;
        padding-bottom: 10px;
    }
</style>
