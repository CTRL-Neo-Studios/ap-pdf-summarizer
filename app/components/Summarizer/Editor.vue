<script setup lang="ts">
import type { EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'

const modelValue = defineModel('modelValue', {
    default: ''
})
const props = withDefaults(defineProps<{
    disabled: boolean
}>(), {
    disabled: false
})

const toolbarItems: EditorToolbarItem[][] = [
    [
        {
            icon: 'i-lucide-heading',
            tooltip: { text: 'Headings' },
            content: {
                align: 'start'
            },
            items: [
                {
                    kind: 'heading',
                    level: 1,
                    icon: 'i-lucide-heading-1',
                    label: 'Heading 1'
                },
                {
                    kind: 'heading',
                    level: 2,
                    icon: 'i-lucide-heading-2',
                    label: 'Heading 2'
                },
                {
                    kind: 'heading',
                    level: 3,
                    icon: 'i-lucide-heading-3',
                    label: 'Heading 3'
                },
                {
                    kind: 'heading',
                    level: 4,
                    icon: 'i-lucide-heading-4',
                    label: 'Heading 4'
                }
            ]
        }
    ],
    [
        {
            kind: 'mark',
            mark: 'bold',
            icon: 'i-lucide-bold',
            tooltip: { text: 'Bold' }
        },
        {
            kind: 'mark',
            mark: 'italic',
            icon: 'i-lucide-italic',
            tooltip: { text: 'Italic' }
        },
        {
            kind: 'mark',
            mark: 'underline',
            icon: 'i-lucide-underline',
            tooltip: { text: 'Underline' }
        },
        {
            kind: 'mark',
            mark: 'strike',
            icon: 'i-lucide-strikethrough',
            tooltip: { text: 'Strikethrough' }
        },
        {
            kind: 'mark',
            mark: 'code',
            icon: 'i-lucide-code',
            tooltip: { text: 'Code' }
        }
    ]
]

const suggestionsItems: EditorSuggestionMenuItem[][] = [
    [
        {
            type: 'label',
            label: 'Text'
        },
        {
            kind: 'paragraph',
            label: 'Paragraph',
            icon: 'i-lucide-type'
        },
        {
            kind: 'heading',
            level: 1,
            label: 'Heading 1',
            icon: 'i-lucide-heading-1'
        },
        {
            kind: 'heading',
            level: 2,
            label: 'Heading 2',
            icon: 'i-lucide-heading-2'
        },
        {
            kind: 'heading',
            level: 3,
            label: 'Heading 3',
            icon: 'i-lucide-heading-3'
        }
    ],
    [
        {
            type: 'label',
            label: 'Lists'
        },
        {
            kind: 'bulletList',
            label: 'Bullet List',
            icon: 'i-lucide-list'
        },
        {
            kind: 'orderedList',
            label: 'Numbered List',
            icon: 'i-lucide-list-ordered'
        }
    ],
    [
        {
            type: 'label',
            label: 'Insert'
        },
        {
            kind: 'blockquote',
            label: 'Blockquote',
            icon: 'i-lucide-text-quote'
        },
        {
            kind: 'codeBlock',
            label: 'Code Block',
            icon: 'i-lucide-square-code'
        },
        {
            kind: 'horizontalRule',
            label: 'Divider',
            icon: 'i-lucide-separator-horizontal'
        }
    ]
]

const appendToBody = false ? () => document.body : undefined
</script>

<template>
    <UEditor
        :editable="!props.disabled"
        content-type="html"
        v-slot="{editor}"
        v-model="modelValue"
        placeholder="Type / for commands..."
        class="w-full min-h-64 h-fit border border-default rounded-lg"
        :parseOptions="{
            preserveWhitespace: true,
        }"
        :markdown="{
            markedOptions: {
                breaks: true
            },
            indentation: {
                size: 4,
                style: 'tab'
            }
        }"
        :ui="{
            content: 'pt-4 pb-8 h-fit'
        }"
    >
        <UEditorToolbar :editor="editor" :items="toolbarItems" layout="fixed" class="border-b border-default sticky top-0 pt-4 inset-x-0 p-2 overflow-x-auto bg-default z-50 rounded-t-lg"/>
        <UEditorDragHandle :editor="editor" />
        <UEditorSuggestionMenu :editor="editor" :items="suggestionsItems" :append-to="appendToBody" />
    </UEditor>
</template>

<style scoped>

</style>