import os
import boto3
import json
import email
from email import policy
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SES_REGION = os.getenv("SES_REGION", "ap-southeast-1")

ssm = boto3.client('ssm')
s3 = boto3.client('s3')
ses = boto3.client('ses', region_name=SES_REGION)

EMAIL_MAPPING_SSM_KEY = os.environ.get('EMAIL_MAPPING_SSM_KEY')
FROM_EMAIL = os.environ.get('FROM_EMAIL')   # mail@croptic.co
BUCKET_NAME = os.environ.get('BUCKET_NAME')


def lambda_handler(event, context):

    # load mapping
    resp = ssm.get_parameter(Name=EMAIL_MAPPING_SSM_KEY)
    mapping = json.loads(resp["Parameter"]["Value"])

    for record in event["Records"]:
        mail = record["ses"]["mail"]
        message_id = mail["messageId"]

        # get email from S3
        obj = s3.get_object(Bucket=BUCKET_NAME, Key=message_id)
        raw_email = obj["Body"].read()

        msg = email.message_from_bytes(raw_email, policy=policy.default)
        original_from = msg["From"]
        original_subject = msg["Subject"]

        original_to = msg["To"]
        forward_to = mapping.get(original_to) or mapping.get("*")
        if not forward_to:
            print("No forward target for:", original_to)
            continue

        # ambil body plain text (jika ada)
        body = msg.get_body(preferencelist=('plain'))
        body_text = body.get_content() if body else "(No plain text body)"

        # ========== BUILD EMAIL BARU ----------
        new_msg = MIMEMultipart("alternative")
        new_msg["Subject"] = f" [{original_from}] {original_subject}"
        new_msg["From"] = FROM_EMAIL
        new_msg["To"] = forward_to

        # Body bersih tanpa metadata
        clean_body = f"""
        {body_text}
        """

        new_msg.attach(MIMEText(clean_body, "plain"))

        ses.send_raw_email(
            Source=FROM_EMAIL,
            Destinations=[forward_to],
            RawMessage={"Data": new_msg.as_bytes()}
        )

        print("Forwarded to:", forward_to)
