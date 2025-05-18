// server/api/submit-form.post.js
import {contactFormSchema} from "../../utils/schema/contact";

export default defineEventHandler(async (event) => {
    try {
        // Get the form data
        const formData = await readValidatedBody(event, (body) =>
            contactFormSchema.parse(body)
        )

        const connectionOptions = {
            from: '"Red Mountain" <ian@redmountainsoftware.com>',
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        }

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
        if (import.meta.dev) {
            console.log('dev', {
                connectionOptions,
                mailOptions
            })
            // Development: Use nodemailer (or any Node.js compatible email library)
            const nodemailer = await import('nodemailer')
            const transporter = nodemailer.default.createTransport(connectionOptions)
            await transporter.sendMail(mailOptions)
        } else {
            console.log('prod', {
                connectionOptions,
                mailOptions
            })
            // Production: Use worker-mailer in Cloudflare Workers environment
            const { WorkerMailer } = await import('worker-mailer')
            const mailer = await WorkerMailer.connect(connectionOptions)
            await mailer.send(mailer)
        }

        // Send the email
        return {
          success: true
        }

    } catch (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error,
        })
    }
})