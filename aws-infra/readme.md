# AWS SES Email Forwarding via S3/Lambda – Python AWS CDK

This pipeline allows any email sent to a custom domain (e.g., `@croptic.co`) to be automatically forwarded to a specific Gmail address, including attachments and email content, using **AWS SES, S3, Lambda**, and mapping via **SSM Parameter Store**.

## Features

* Forward emails from a custom domain to specific Gmail addresses (per-account mapping).
* Preserve attachments and email content intact.
* Flexible mapping through **AWS SSM Parameter Store**.
* Fully automated infrastructure with **AWS CDK (Python)**.

## Project Structure

```
.
├── README.md
├── app.py                # CDK entry point
├── lambda/
│   ├── lambda_function.py  # SES email forwarder Lambda (Python)
├── requirements.txt
└── cdk.json
```

## Prerequisites

* Active AWS account and AWS CLI installed.
* CDK v2 and Python 3.8+.
* Custom domain verified in SES.
* `FROM_EMAIL` (SES source) verified.

Ensure your domain is set up to receive emails. See the guide: [Receiving Emails in SES](https://docs.aws.amazon.com/ses/latest/dg/receiving-email.html)

Basically, allow **Amazon SES to receive email for your domain** by publishing an MX record. Guide: [SES MX Record Setup](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-mx-record.html)

## Installation

1. **Clone repo & set up environment**

```bash
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/Mac:
source .venv/bin/activate
pip install -r requirements.txt
```

2. **Initialize CDK**

```bash
cdk bootstrap
```

3. **Set mapping in AWS SSM Parameter Store**

* Create a **String parameter**, e.g., `/ses/email_mapping`
* Value should be JSON, example:

```json
{
  "bayu@croptic.co": "bayucroptic@gmail.com",
  "finance@croptic.co": "cropticfinance@gmail.com"
}
```

4. **Edit configuration in `app.py` and `lambda/lambda_function.py`**

* Update `FROM_EMAIL`, domain, and SSM parameter key according to your setup.

5. **Deploy to AWS**

```bash
cdk synth
cdk deploy
```

## Lambda Environment Variables

* `EMAIL_MAPPING_SSM_KEY` : SSM parameter key for email mapping.
* `FROM_EMAIL` : SES-verified source email.
* `BUCKET_NAME` : S3 bucket for SES emails.
* `BUCKET_PREFIX` : (Optional) S3 prefix.
* `ENABLE_LOGGING` : `"true"` / `"false"` to enable logging.

## Testing

1. Send an email to your custom domain (e.g., `bayu@croptic.co`).
2. If mapping is correct, the email is automatically delivered to the target Gmail (e.g., `bayucroptic@gmail.com`).
3. Verify headers, body, and attachments: all should appear intact in Gmail.

## Customization

* Mapping can be **per-email** or use a wildcard: `{"*": "target@gmail.com"}`
* Multiple emails can forward to multiple Gmail accounts.
* Logging can be enabled for Lambda debugging.

## License

MIT

---

This README summarizes setup, deployment, mapping, and testing for a **custom domain → specific Gmail** SES email forwarding solution using **SES, S3, Lambda, SSM**, with best practices included.

References:
[1](https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-python.html)
[2](https://github.com/aws-samples/aws-cdk-project-structure-python)
[3](https://dev.to/kelvinskell/getting-started-with-aws-cdk-in-python-a-comprehensive-and-easy-to-follow-guide-2k44)
[4](https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CDK-Demo)
[5](https://towardsdatascience.com/build-your-first-aws-cdk-project-18b1fee2ed2d/)
[6](https://www.datacamp.com/tutorial/aws-cdk)
[7](https://www.youtube.com/watch?v=I2cXlYYoQqQ)
[8](https://docs.aws.amazon.com/cdk/v2/guide/projects.html)
[9](https://gitlab.ecs.baylor.edu/chujiang_wu/dsc3310/-/blob/main/AWS/CDK/apigw-http-api-lambda-cdk/README.md)


