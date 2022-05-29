const mailjet_client = require("./modules/email-mailjet-client");


exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const {
      contact__name: contact_name,
      contact__email: contact_email,
      contact__message: contact_message,
      source,
      source_name,
      timestamp,
      date,
    } = body;

    const forwarded_to_me = await forwardMessageToMyEmail({
      contact_name,
      contact_email,
      contact_message,
      source,
      source_name,
      timestamp,
      date,
    });
    if (!forwarded_to_me) {
      throw new Error("Error forwarding message to my email.");
    }
    const confirmed_to_contacter = await sendConfirmationEmailToContacter({
      contact_name,
      contact_email,
      contact_message,
      date,
    });

    if (!confirmed_to_contacter) {
      throw new Error("Error sending confirmation email to contacter."); s
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ context: "Email send", success: true })
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ context: "Email send", success: false }),
    };
  }
};


async function forwardMessageToMyEmail(data) {

  const {
    contact_name,
    contact_email,
    contact_message,
    source,
    source_name,
    timestamp,
    date
  } = data;

  try {
    const result = await mailjet_client
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "jacopo.marrone27@gmail.com",
              "Name": "Jacopo"
            },
            "To": [
              {
                "Email": "jacopo.marrone27@gmail.com",
                "Name": "Jacopo"
              }
            ],
            // "CustomID": "AppGettingStartedTest",
            "Subject": "New Contact from portfolio.",
            "TextPart": `
            New Contact from portfolio.
            Name: ${contact_name}
            Email: ${contact_email}
            Message: ${contact_message}
            Source: ${source}
            Source Name: ${source_name}
            Timestamp: ${timestamp}
            Date: ${date}
            `,
            "HTMLPart": `
            <h3>New Contact from portfolio.</h3>
            <br />
            <br />
            <br />Name: ${contact_name}
            <br />Email: ${contact_email}
            <br />Message: ${contact_message}
            <br />Source: ${source}
            <br />Source Name: ${source_name}
            <br />Timestamp: ${timestamp}
            <br />Date: ${date}
            `,
          }
        ]
      }
      );
    console.log(result.body);
    return true;
  } catch (err) {
    console.log("Error sending email with errorcode: " + err.statusCode);
    return false;
  }
}
async function sendConfirmationEmailToContacter(data) {

  const { contact_name, contact_email, contact_message, date } = data;

  try {
    const result = await mailjet_client
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "jacopo.marrone27@gmail.com",
              "Name": "Jacopo Marrone"
            },
            "To": [
              {
                "Email": contact_email,
                "Name": contact_name
              }
            ],
            "CustomID": "AppGettingStartedTest",
            "Subject": "Your message is arrived.",
            "TextPart": `
            Your message has been delivered to me.

            Thank for your interest.
            I will contact you as soon as possible.

            Your message:
            Name: ${contact_name}
            Email: ${contact_email}
            Message: ${contact_message}
            Date: ${date}
            `,
            "HTMLPart": `
              <h3>Your message has been delivered to me.</h3>
              <br />
              Thank for your interest.
              I will contact you as soon as possible.
              <br />
              <br />
              Your message:<br />
              Name: ${contact_name}<br />
              Email: ${contact_email}<br />
              Message: ${contact_message}<br />
            `,
          }
        ]
      }
      );
    console.log(result.body);
    return true;
  } catch (err) {
    console.log(err.statusCode);
    return false;
  }
}