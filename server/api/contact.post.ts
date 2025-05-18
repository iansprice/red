// server/api/submit-form.post.js
import {contactFormSchema} from "../../utils/schema/contact";

export default defineEventHandler(async (event) => {
    try {
        // Get the form data
        const formData = await readValidatedBody(event, (body) =>
            contactFormSchema.parse(body)
        )

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: `Red Mountain Subterranean Hub`,
                    email: "ian@redmountainsoftware.com",
                },
                to: [{
                    email: "ian@redmountainsoftware.com",
                    name: "Red Mountain Remote Raft"
                }],
                replyTo: {
                    email: formData.email,
                    name: formData.name,
                },
                subject: `Contact requested by ${formData.name}`,
                textContent: `
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
                htmlContent: `
                    <h2>Someone wishes to speak to Red Mountain</h2>
                    <p><h4>Name:</h4> ${formData.name || 'Not provided'}</p>
                    <p><h4>Email:</h4> ${formData.email || 'Not provided'}</p>
                    <p><h4>Submitted:</h4> ${new Date().toLocaleString()}</p>
                    
                    <p><h4>Message:</h4>${formData.message || 'No message provided'}</p>
                  `
            }),
        })

        if (!response.ok) {
            console.log(response)
            console.error("Could not send email", response)
            throw new Error("Message could not be sent at this time")
        }
        // Send the email
        return {
            success: true
        }
    } catch (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error.toString(),
        })
    }
})