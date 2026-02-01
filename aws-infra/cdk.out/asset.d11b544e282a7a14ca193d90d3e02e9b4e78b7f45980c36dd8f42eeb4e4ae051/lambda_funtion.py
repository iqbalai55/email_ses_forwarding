import os
import logging
import boto3
import json
import email
from email import policy

ssm = boto3.client('ssm')
s3 = boto3.client('s3')
ses = boto3.client('ses')

EMAIL_MAPPING_SSM_KEY = os.environ.get('EMAIL_MAPPING_SSM_KEY')
FROM_EMAIL = os.environ.get('FROM_EMAIL')
BUCKET_NAME = os.environ.get('BUCKET_NAME')
BUCKET_PREFIX = os.environ.get('BUCKET_PREFIX', '')
ENABLE_LOGGING = os.environ.get('ENABLE_LOGGING', 'false').lower() == 'true'

email_mapping = None

def log(*args):
    if ENABLE_LOGGING:
        print(' '.join(str(a) for a in args))

def load_email_mapping_from_ssm():
    global email_mapping
    if email_mapping is None:
        resp = ssm.get_parameter(Name=EMAIL_MAPPING_SSM_KEY)
        val = resp.get('Parameter', {}).get('Value')
        if val:
            email_mapping = json.loads(val)
    return email_mapping

def parse_and_forward(event, context):
    log('Received SES S3 event:', json.dumps(event))
    if not (EMAIL_MAPPING_SSM_KEY and FROM_EMAIL and BUCKET_NAME):
        print("Missing required env vars.")
        raise Exception("Missing required env vars")
    
    mapping = load_email_mapping_from_ssm()
    if not mapping:
        log('No mapping found in SSM:', EMAIL_MAPPING_SSM_KEY)
        return

    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        if BUCKET_PREFIX and not key.startswith(BUCKET_PREFIX):
            log('Skipping record, prefix mismatch:', key)
            continue

        s3obj = s3.get_object(Bucket=bucket, Key=key)
        raw_email = s3obj['Body'].read()
        msg = email.message_from_bytes(raw_email, policy=policy.SMTP)
        rcpt = msg['To']
        
        # mapping bisa literal atau wildcard
        forward_to = mapping.get(rcpt)
        if not forward_to and '*' in mapping:
            forward_to = mapping['*']

        if not forward_to:
            log('Recipient not found in mapping, skipping:', rcpt)
            continue

        response = ses.send_raw_email(
            Source=FROM_EMAIL,
            Destinations=[forward_to],
            RawMessage={'Data': raw_email}
        )
        log('Forwarded email:', response)

def lambda_handler(event, context):
    try:
        parse_and_forward(event, context)
    except Exception as e:
        print('Error:', e)
        raise e
