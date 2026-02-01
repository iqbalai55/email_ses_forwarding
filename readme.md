## Email SES Solution 

Third-party email services are often use generic domains like `@gmail.com` that look **unprofessional**. This solution uses **AWS SES with serverless infrastructure**, enabling email delivery from **your own domain** for professional appearance, with an **auto-forwarder** that routes incoming messages to free inboxes like Gmail - keeping your inbox functional without losing messages.

This system is perfect for **low to medium email volumes**, **cost-effective**, **easy to use**, boosts **team/startup credibility**, and **scales** as needed.


## **web-interface** - Manual Email Sender

**Function:** Send emails manually via SES with sender dropdown + password authentication.

**Features:**
- Verified sender dropdown (team@domain.com, noreply@domain.com)  
- To + message inputs
- Password protection (.env)
- Modern UI (Tailwind glassmorphism)

```bash
cd web-interface
npm install && npm run dev
```

**.env.local:**
```
SES_ACCESS_KEY_ID=your_key
SES_SECRET_ACCESS_KEY=your_secret
SES_REGION=us-east-1
APP_PASSWORD=supersecret123
```

## **infra** - Auto-Forward Incoming Email

**Architecture:**
```
Email → *@domain.com → SES Receipt Rule → S3 → Lambda → Forward
```

**Deploy:**
```bash
cd infra
pip install -r requirements.txt
cdk deploy
```

