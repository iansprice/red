<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
    <Menu title="Contact"/>
    <div class="max-w-lg mx-auto py-12">
      <LampEffect>
      <form @submit.prevent="handleSubmit" class="my-4 space-y-6">
        <div>
          <label for="name" class="block font-medium ">Name</label>
          <UInput
              id="name"
              v-model="form.name"
              type="text"
              required
              class="my-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label for="email" class="block font-medium ">
            Email address
          </label>
          <UInput
              id="email"
              v-model="form.email"
              type="email"
              required
              class="my-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label for="message" class="block font-medium">Message</label>
          <UTextarea
              tag="textarea"
              id="message"
              v-model="form.message"
              rows="10"
              required
              class="my-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></UTextarea>
        </div>
        <div>
          <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send Message
          </button>
        </div>
      </form>
      </LampEffect>
    </div>
  </div>
</template>

<script setup>

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  // Implement form submission logic here
  console.log('Form submitted:', form)
}
</script>