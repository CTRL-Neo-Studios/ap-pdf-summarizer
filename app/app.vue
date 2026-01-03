<template>
    <div>
        <NuxtLoadingIndicator/>
        <UApp>
            <NuxtLayout>
                <NuxtPage/>
            </NuxtLayout>
        </UApp>
    </div>
</template>
<script setup lang="ts">

useHead({
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
        { rel: 'icon', href: '/favicon.ico' }
    ],
    htmlAttrs: {
        lang: 'en'
    }
})

useSeoMeta({
    title: 'AP PDF Summarizer',
    ogTitle: 'Create new scratch file from selection',
    description: 'Summarizes AP-subject related PDFs for you to your own preference.',
    ogDescription: 'Summarizes AP-subject related PDFs for you to your own preference.',
    ogImage: '/og.png',
    twitterCard: 'summary_large_image',
})
</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.25s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
.layout-enter-active,
.layout-leave-active {
    transition: all 0.25s;
}
.layout-enter-from,
.layout-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>