
<script setup lang="ts">
defineProps({
    messageToCopy: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div class="container">
        <button @click="copyToClipboard"
            class="copy-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {{ buttonText }}
        </button>
    </div>
</template >

<script lang="ts">
export default {
    methods: {
        async copyToClipboard() {
            if (!navigator.clipboard) {
                return;
            }
            try {
                await navigator.clipboard.writeText(this.messageToCopy);
            } catch (err) {
                console.error('Failed to copy the text: ', err);
            }
        },
    },
};
</script>

<style scoped>
.container {
    @apply flex flex-col items-center justify-center;
}

.text-container {
    @apply mb-4 p-4 bg-gray-200 rounded;
}
</style>