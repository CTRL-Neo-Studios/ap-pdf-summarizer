<script setup lang="ts">



const subjects = ref(['AP World History', 'AP European History', 'AP United States History', 'AP Art History'])

const selectedSubject = ref('AP World History')

function onCreate(item: string) {
    subjects.value.push(item)
    selectedSubject.value = item
}

const showSettings = ref(false)
const emDashes = ref(50)
const showEmDashes = ref(false)
const showArrows = ref(false)
const arrows = ref(50)

</script>


<template>
    <UContainer>
        <div class="text-center py-12">
            <h1 class="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                <UIcon name="i-lucide-notebook" class="text-primary" />
                AP Textbook Summarizer
            </h1>
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
                    create-item
                    placeholder="Choose your AP subject..."
                    size="xl"
                    @create="onCreate"
                    :ui="{
                        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                    }"
                />
            </UCard>
        </div>

        <UCard
            class="max-w-4xl mx-auto mt-7 justify-center"
        >
            <template #header>
                <h2 class="text-xl font-semibold flex gap-2">
                    <span class="text-primary">2.</span>
                    <span>Upload Your Textbook & Adjust Additional Settings</span>
                </h2>
            </template>
            <UFileUpload
                label="Drop your PDF/text file here"
                description="PDF, TXT, or DOC"
                class="mx-auto justify-center"
                size="xl"
            />
            <UCollapsible>
                <UButton
                    variant="ghost"
                    class="mt-4"
                    size="xl"
                    @click="showSettings =!showSettings"
                >
                    <UIcon :name="showSettings ? 'i-lucide-chevron-up' : 'i-lucide-settings'"/>
                    {{ showSettings ? 'Hide Settings' : 'Show Settings' }}
                </UButton>
                <template #content>
                    <div v-if="showSettings" class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 class="font-medium text-lg">Additional Configuration</h3>
                        <UCollapsible
                            class="mt-3"
                        >
                            <UButton
                                variant="ghost"
                                size="lg"
                                @click="showEmDashes =!showEmDashes"
                            >
                                <UIcon
                                    :name="showEmDashes ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                                />
                                {{ showEmDashes ? 'Hide Em-Dashes' : 'Show Em-Dashes' }}
                            </UButton>
                            <template #content>
                                <div class="my-4 space-y-2 mx-4">
                                    <h3 class="font-medium text-sm">Amount of Em-dashes</h3>
                                    <USlider
                                        v-model="emDashes"
                                    />
                                </div>
                            </template>
                        </UCollapsible>
                        <UCollapsible>
                            <UButton
                                variant="ghost"
                                size="lg"
                                @click="showArrows =!showArrows"
                            >
                                <UIcon
                                    :name="showArrows ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                                />
                                {{ showArrows ? 'Hide Arrows' : 'Show Arrows' }}
                            </UButton>
                            <template #content>
                                <div class="my-4 space-y-2 mx-4">
                                    <h3 class="font-medium text-sm">Amount of Arrows</h3>
                                    <USlider
                                        v-model="arrows"
                                    />
                                </div>
                            </template>
                        </UCollapsible>
                    </div>
                </template>
            </UCollapsible>







        </UCard>

        <UCard
            class="max-w-4xl mx-auto mt-7 justify-center"
        >
            <template #header>
                <h2 class="text-xl font-semibold flex gap-2">
                    <span class="text-primary">3.</span>
                    <span> Edit Your Summary</span>
                </h2>
            </template>

        </UCard>


    </UContainer>
</template>

<style scoped>

</style>