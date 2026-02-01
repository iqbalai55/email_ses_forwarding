import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const sesClient = new SESv2Client({
  region: process.env.SES_REGION as string,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
  },
});

// Hash password sekali saat server start
const hashedPassword = bcrypt.hashSync(process.env.APP_PASSWORD!, 10);

export async function POST(req: NextRequest) {
  try {
    const { password, to, sender, title, message, validateOnly } =
      await req.json();

    // Validasi input
    if (!to || !sender || !message || !title) {
      return NextResponse.json(
        { error: 'To, sender, title, dan message wajib diisi' },
        { status: 400 }
      );
    }

    // Validasi password
    if (!bcrypt.compareSync(password, hashedPassword)) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // Jika hanya validasi (frontend unlock), return sukses saja
    if (validateOnly) {
      return NextResponse.json({ success: true });
    }

    // Persiapkan email
    const sendEmailCommand = new SendEmailCommand({
      FromEmailAddress: sender,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: title },
          Body: {
            Text: { Data: message }, // plain text
            Html: { Data: message.replace(/\n/g, '<br>') }, // HTML dengan newline
          },
        },
      },
    });

    // Kirim email
    const result = await sesClient.send(sendEmailCommand);

    return NextResponse.json({
      success: true,
      message: 'Email terkirim!',
      messageId: result.MessageId,
    });
  } catch (error: any) {
    console.error('SES Error:', error);
    return NextResponse.json(
      { error: `Gagal kirim: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
