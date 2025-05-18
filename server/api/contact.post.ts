// server/api/submit-form.post.js
import {contactFormSchema} from "../../utils/schema/contact";
import createTra
export default defineEventHandler(async (event) => {
    try {
        // Get the form data
        const formData = await readValidatedBody(event, (body) =>
            contactFormSchema.parse(body)
        )

        // Set up email data
        const mailOptions = {
            from: 'ian@redmountainsoftware.com',
            to:  'ian@redmountainsoftware.com',
            reply: formData.email,
            replyTo: formData.email,
            subject: `New Form Submission: ${formData.subject || 'Website Contact Form'}`,
            text: `
          New form submission received:
          
          Name: 
          ${formData.name || 'Not provided'}
          
          Email:
          ${formData.email || 'Not provided'}
          
          Submitted: 
          ${new Date().toLocaleString()}
          
          Message:
          ${formData.message || 'No message provided'}
        `,
            html: `
          <h2>Someone wishes to speak to Red Mountain</h2>
          <p><h4>Name:</h4> ${formData.name || 'Not provided'}</p>
          <p><h4>Email:</h4> ${formData.email || 'Not provided'}</p>
          <p><h4>Submitted:</h4> ${new Date().toLocaleString()}</p>
          
          <p><h4>Message:</h4>${formData.message || 'No message provided'}</p>
      `
        }
        // See https://github.com/zou-yu/worker-mailer #3

        const { sendMail } = useNodeMailer()
        await sendMail(mailOptions)

        // Send the email
        return {
          success: true
        }

    } catch (error) {
        console.error("could not send mail", error)
        throw createError({
            statusCode: 400,
            statusMessage: error,
        })
    }
})