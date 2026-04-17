export const template =(code , firstName , subject )=>
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
            }
            .content {
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
            }
            .code {
                display: block;
                width: fit-content;
                margin: 20px auto;
                padding: 10px 20px;
                font-size: 24px;
                font-weight: bold;
                color: #ffffff;
                background-color: #007BFF;
                border-radius: 5px;
                text-align: center;
                letter-spacing: 5px;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #777777;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${subject}</h1>
            </div>
            <div class="content">
                <p>Hi ${firstName},</p>
                <p>Please use the following code to confirm your email address:</p>
                <div class="code">${code}</div>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2023 Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
    `