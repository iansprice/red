<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
    <Menu title="Contact"/>
    <div v-if="sent">
      <div class="h-64">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-white">Your form has been submitted</h1>
          <ClientOnly>
            <div class="my-6">
              <SpotlightButton to="/~" class="mt-6">Go Home</SpotlightButton>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
    <div class="max-w-lg mx-auto pb-12" v-else>
      <UForm
          @submit="handleSubmit"
          class="my-4 space-y-6"
          :schema="contactFormSchema"
          :state="form"
          v-slot="{ errors }"
      >
        <UFormGroup name="name" class="block font-medium" label="Name" :error="errors.name">
          <UInput
              id="name"
              v-model="form.name"
              type="text"
              required
              class="my-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
          />
        </UFormGroup>
        <UFormGroup name="email" class="block font-medium " label="Email" :error="errors.email">
          <UInput
              id="email"
              v-model="form.email"
              type="email"
              required
              class="my-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
          />
        </UFormGroup>
        <UFormGroup name="message" class="block font-medium" label="Message" :error="errors.message">
          <UTextarea
              tag="textarea"
              id="message"
              v-model="form.message"
              :rows="10"
              required
              class="my-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
          />
        </UFormGroup>
        <UButton
            :disabled="submitting"
            type="submit"
            :class="['w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500', {'bg-neutral-900': submitting}]"
        >
          <div role="status" v-if="submitting">
            <Spinner/>
          </div>
          <div v-else>
            Send Message
          </div>
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpotlightButton from "../components/SpotlightButton.vue";
import {contactFormSchema, type ContactFormSchema} from "../utils/schema/contact";

const submitting = ref(false)
const sent = ref(false);
const form = reactive<Partial<ContactFormSchema>>({
  name: '',
  email: '',
  message: ''
})
const toast = useToast()
const handleSubmit = async (event: FormSubmitEvent<ContactFormSchema>) => {
  console.table(event)
  try {
    submitting.value = true
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form,
    })

    console.log(response)

    toast.add({
      title: 'Message sent',
      description: "Your message was submitted to Red Mountain. ",
      type: 'success',
    })
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    sent.value = true
    submitting.value = false
    // Handle success
  } catch (error) {
    toast.add({
      title: 'Error submitting form',
      description: "Your message wasn't sent. See console for details.",
      type: 'error',
    })
    console.error(error)
    submitting.value = false
    // Handle error
  }
}
</script>