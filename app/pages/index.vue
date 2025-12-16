<script setup lang="ts">

const selectedSubject = ref('')

const subjects = ref(['AP World History', 'AP European History', 'AP United States History', 'AP Art History'])

</script>


<template>
    <UContainer>

        <div class="text-center py-12">
            <h1 class="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                <UIcon name="i-lucide-notebook" class="text-primary" />
                AP Textbook Summarizer</h1>
            <p class="text-lg text-neutral flex items-center justify-center gap-4">
                Get AI-powered, detailed, structured summaries for your AP textbook <UColorModeSwitch></UColorModeSwitch>
            </p>
        </div>

        <div class="max-w-4xl mx-auto mb-6">
            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold flex gap-2">
                        <span class="text-primary">1.</span>
                        <span>Select Your Subject</span>
                    </h2>
                </template>
                <USelectMenu
                    v-model="selectedSubject"
                    :items="subjects"
                    placeholder="Choose your AP subject..."
                    size="xl"
                />
            </UCard>
        </div>

        <UCard
            class="max-w-4xl mx-auto mt-7 justify-center"
        >
            <template #header>
                <h2 class="text-xl font-semibold flex gap-2">
                    <span class="text-primary">2.</span>
                    <span>Upload Your Textbook</span>
                </h2>

            </template>
            <UFileUpload
                label="Drop your PDF/text file here"
                description="PDF, TXT, or DOC"
                class="mx-auto justify-center"
            />
        </UCard>
    </UContainer>
</template>


<style scoped>

</style>