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