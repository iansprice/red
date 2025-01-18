<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-lg mx-auto">
      <h1 class="text-3xl font-bold ">Contact Me</h1>
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium ">Name</label>
          <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium ">Email</label>
          <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium">Message</label>
          <textarea
              id="message"
              v-model="form.message"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div>
          <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send Message
          </button>
        </div>
      </form>
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