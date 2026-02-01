from aws_cdk import (
    aws_s3 as s3,
    aws_lambda as _lambda,
    aws_iam as iam,
    aws_ses as ses,
    aws_ssm as ssm,
    aws_ses_actions as ses_actions,
    App, Stack, Duration
)
from constructs import Construct

class EmailForwardingStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        bucket = s3.Bucket(self, "SESEmailBucket")
        param_name = "/ses/email_mapping"

        forwarder = _lambda.Function(
            self, "SESEmailForwarder",
            runtime=_lambda.Runtime.PYTHON_3_12,
            handler="lambda_function.lambda_handler",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "SES_INCOMING_BUCKET": bucket.bucket_name,
                "EMAIL_MAPPING_SSM_KEY": param_name,
                "FROM_EMAIL": "no-reply@croptic.co",
                "BUCKET_NAME": bucket.bucket_name,
                "BUCKET_PREFIX": "",
                "ENABLE_LOGGING": "true"
            },
            timeout=Duration.seconds(60),
            memory_size=512
        )
        bucket.grant_read(forwarder)
        forwarder.add_to_role_policy(iam.PolicyStatement(
            actions=["ses:SendRawEmail", "ssm:GetParameter"],
            resources=["*"]
        ))

        # Receipt RuleSet tanpa argumen rule_set_name
        rule_set = ses.ReceiptRuleSet(self, "RuleSet")
        rule_set.add_rule("ForwardRule",
            recipients=["*@croptic.co"],
            actions=[
                ses_actions.S3(bucket=bucket),
                ses_actions.Lambda(function=forwarder)
            ],
            enabled=True,
            scan_enabled=True
        )


app = App()
EmailForwardingStack(app, "EmailForwardingStack")
app.synth()
