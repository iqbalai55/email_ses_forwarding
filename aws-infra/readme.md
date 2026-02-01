# AWS SES Email Forwarding via S3/Lambda – Python AWS CDK

Pipeline ini memungkinkan email apapun dari domain custom (misal `@croptic.co`) langsung diteruskan (forward) ke email Gmail secara spesifik, termasuk attachment dan isi email, lewat AWS SES, S3, Lambda, dan mapping dari SSM Parameter Store.

## Fitur
- Forward email dari domain custom ke Gmail secara spesifik (mapping per akun).
- Attachment dan isi email tetap utuh.
- Mapping fleksibel via AWS SSM Parameter Store.
- Infrastruktur otomatis dengan AWS CDK (Python).

## Struktur Project
```
.
├── README.md
├── app.py                # CDK entry point
├── lambda/
│   ├── lambda_function.py  # Lambda SES email forwarder (Python)
├── requirements.txt
└── cdk.json
```

## Prasyarat
- AWS CLI & akun AWS aktif.
- CDK v2 dan Python 3.8+.
- Domain custom sudah diverifikasi di SES.
- `FROM_EMAIL` (source SES) diverifikasi.

pastikan domain email sudah disetting untuk receiveng email, panduan disini: https://docs.aws.amazon.com/ses/latest/dg/receiving-email.html

basicly, Permit Amazon SES to receive email for your domain by publishing an MX record. panduan disini: https://docs.aws.amazon.com/ses/latest/dg/receiving-email-mx-record.html


## Instalasi

1. **Clone repo & setup environment**
   ```
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Inisialisasi CDK**
   ```
   cdk bootstrap
   ```

3. **Set mapping di AWS SSM Parameter Store**
   - Buat parameter tipe String dengan nama misal `/ses/email_mapping`
   - Nilai JSON, contoh:
     ```json
     {
       "bayu@croptic.co": "bayucroptic@gmail.com",
       "finance@croptic.co": "cropticfinance@gmail.com"
     }
     ```

4. **Edit konfigurasi di `app.py` dan `lambda/lambda_function.py`**
   - Ganti `FROM_EMAIL`, domain, dan parameter SSM sesuai kebutuhan.

5. **Deploy ke AWS**
   ```
   cdk synth
   cdk deploy
   ```

## Environment Variable Lambda

- `EMAIL_MAPPING_SSM_KEY` : Nama parameter mapping di SSM.
- `FROM_EMAIL` : Email source verified di SES.
- `BUCKET_NAME` : S3 bucket SES email.
- `BUCKET_PREFIX` : (Opsional) prefix S3.
- `ENABLE_LOGGING` : "true"/"false" aktifkan logging.

## Testing

- Kirim email ke domain custom (misal `bayu@croptic.co`)
- Jika mapping benar, email otomatis masuk Gmail target (misal `bayucroptic@gmail.com`)
- Cek header, body, attachment: harus tampil utuh di Gmail.

## Customisasi
- Mapping bisa per email atau wild card `{"*": "target@gmail.com"}`
- Bisa multi email → multi Gmail
- Logging bisa diaktifkan untuk debug Lambda

## Lisensi
MIT

***

README ini meringkas setup, deploy, mapping, dan testing project AWS CDK Python untuk **spesifik email domain → spesifik Gmail** dengan SES, S3, Lambda, SSM, beserta best practice-nya.[2][3][6]

[1](https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-python.html)
[2](https://github.com/aws-samples/aws-cdk-project-structure-python)
[3](https://dev.to/kelvinskell/getting-started-with-aws-cdk-in-python-a-comprehensive-and-easy-to-follow-guide-2k44)
[4](https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CDK-Demo)
[5](https://towardsdatascience.com/build-your-first-aws-cdk-project-18b1fee2ed2d/)
[6](https://www.datacamp.com/tutorial/aws-cdk)
[7](https://www.youtube.com/watch?v=I2cXlYYoQqQ)
[8](https://docs.aws.amazon.com/cdk/v2/guide/projects.html)
[9](https://gitlab.ecs.baylor.edu/chujiang_wu/dsc3310/-/blob/main/AWS/CDK/apigw-http-api-lambda-cdk/README.md)