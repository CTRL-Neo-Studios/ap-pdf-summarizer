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
useSeoMeta({
    title: 'AP PDF Summarizer',
    ogTitle: 'Create new scratch file from selection',
    description: 'Summarizes AP-subject related PDFs for you to your own preference.',
    ogDescription: 'Summarizes AP-subject related PDFs for you to your own preference.',
    ogImage: '/og.png',
    twitterCard: 'summary_large_image',
})
</script>